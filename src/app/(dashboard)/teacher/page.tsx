"use client";

import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, FileText, Upload, Plus, AlertCircle, Calendar, BookOpen, Activity, CheckSquare, Clock, Video, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const classPerformance = [
  { name: "Quiz 1", avg: 85 },
  { name: "Midterm", avg: 76 },
  { name: "Assignment", avg: 81 },
  { name: "Quiz 2", avg: 92 },
  { name: "Project", avg: 88 }
];


function TeacherDashboardContent() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [meets, setMeets] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  
  const [meetForm, setMeetForm] = useState({ student_email: "all", topic: "", meet_link: "", date: "", time: "" });

  // Sync Tabs with URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const handleTabChange = (value: string) => {
    router.push(`/teacher?tab=${value}`);
  };

  useEffect(() => {
    async function loadData() {
      // Load current user context
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setTeacherProfile(session.user.user_metadata);
      }
      
      // Load all teachers for timetable computation
      const { data: tData } = await supabase.from('teachers').select('*');
      if (tData) setTeachers(tData);

      // Load specific students
      const { data: sData } = await supabase.from('students').select('*');
      if (sData) setStudents(sData);

      // Load assignments for this teacher
      if (session?.user) {
        const { data: aData } = await supabase.from('assignments').select('*').eq('teacher_id', session.user.id);
        if (aData) setAssignments(aData);
      }

      // Load scheduled meets
      const { data: mData } = await supabase.from('proctor_meets').select('*').eq('teacher_id', session?.user?.id);
      if (mData) setMeets(mData);
      
      setLoading(false);
    }
    loadData();

    // Set up Realtime Subscriptions
    const channel = supabase.channel('teacher_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
         loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, (payload) => {
         loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance_records' }, (payload) => {
         loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proctor_meets' }, (payload) => {
         loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleScheduleMeet = async () => {
    if (!meetForm.topic || !meetForm.date || !meetForm.time) {
      alert("Please fill necessary meeting details.");
      return;
    }
    setIsScheduling(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const combinedDate = new Date(`${meetForm.date}T${meetForm.time}`).toISOString();
    
    const { error } = await supabase.from('proctor_meets').insert({
       teacher_id: session?.user?.id,
       teacher_name: teacherProfile?.name || "Teacher",
       teacher_subject: teacherProfile?.subject || "Subject",
       student_email: meetForm.student_email,
       topic: meetForm.topic,
       meeting_time: combinedDate,
       meet_link: "N/A"
    });
    
    setIsScheduling(false);
    if (!error) {
       alert("Proctor meet scheduled!");
       setMeetForm({ student_email: "all", topic: "", meet_link: "", date: "", time: "" });
       // Reload meets
       const { data: mData } = await supabase.from('proctor_meets').select('*').eq('teacher_id', session?.user?.id);
       if (mData) setMeets(mData);
    } else {
       alert(error.message);
    }
  };

  const handleMeetStatusUpdate = async (meetId: string, newStatus: string) => {
    const { error } = await supabase.from('proctor_meets').update({ status: newStatus }).eq('id', meetId);
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: mData } = await supabase.from('proctor_meets').select('*').eq('teacher_id', session?.user?.id);
      if (mData) setMeets(mData);
    } else {
      alert("Error: " + error.message);
    }
  };

  const handleCreateAssignment = async () => {
    const title = prompt("Enter assignment title:");
    if (!title) return;
    const due_date = prompt("Enter due date (YYYY-MM-DD):");
    if (!due_date) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('assignments').insert({
      teacher_id: session?.user?.id,
      subject: teacherProfile?.subject || "Subject",
      title,
      due_date: new Date(due_date).toISOString(),
    });
    
    if (!error) {
      alert("Assignment published securely!");
      window.location.reload();
    } else {
      alert(error.message);
    }
  };

  const markAttendance = async (studentId: string, studentName: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.from('attendance_records').insert({
      teacher_id: session?.user?.id,
      subject: teacherProfile?.subject || "Subject",
      student_id: studentId,
      student_name: studentName,
      status: status
    }).select().single();
    
    if (!error && data) {
      const formattedTime = new Date(data.created_at || new Date()).toLocaleString(undefined, { 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
      });
      alert(`Marked ${studentName} as ${status} on ${formattedTime}`);
    } else if (!error) {
      alert(`Marked ${studentName} as ${status}.`);
    } else {
      alert(error.message);
    }
  };

  // Algorithm to deduce global timetable
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const periods = ["09:00 - 10:00", "10:00 - 11:00", "11:15 - 12:15", "01:00 - 02:00", "02:00 - 03:00"];

  const getTeacherForSlot = (dayIndex: number, periodIndex: number) => {
    if (teachers.length === 0) return null;
    // Weekends usually have fewer classes or no classes, but for the algorithm we will scatter them
    if (dayIndex >= 5 && periodIndex > 2) return null; 
    const index = (dayIndex * periods.length + periodIndex) % teachers.length;
    return teachers[index];
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading Faculty Dashboard...</div>;

  const totalStudents = students.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome, {teacherProfile?.name || "Professor"} 👋</h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage {teacherProfile?.subject ? `your ${teacherProfile.subject}` : 'your'} curriculum, students, and timetable seamlessly.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
            <Upload className="h-4 w-4 mr-2" /> Upload Material
          </Button>
          <Button className="shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" /> Create Assignment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center">
              Active in DataBase
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments tracking</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Student CGPA</CardTitle>
            <Activity className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center">
              +0.2 from last semester
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive/80">
              Absence Requests
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle>Class Performance Analytics</CardTitle>
                <CardDescription>Average scores across recent graded materials in {teacherProfile?.subject || 'your subjects'}.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classPerformance} maxBarSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: 8, border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border/50 bg-background/50 backdrop-blur-sm shadow-sm flex flex-col">
              <CardHeader>
                <CardTitle>Needs Attention</CardTitle>
                <CardDescription>Students falling behind or missing work.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                {students.slice(0, 3).map((student, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    key={student.id || i} 
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold">
                        {student.name ? student.name.substring(0, 2).toUpperCase() : "NA"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{student.name || "Student"}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-destructive" /> Missing assignments
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
                      Ping
                    </Button>
                  </motion.div>
                ))}
                {students.length === 0 && (
                  <div className="text-sm text-center text-muted-foreground p-4">No students populate the database yet.</div>
                )}
                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full text-xs hover:bg-background">View Complete Risk List</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
           <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Assignments</CardTitle>
                <CardDescription>Published tasks synced real-time from Supabase.</CardDescription>
              </div>
              <Button size="sm" onClick={handleCreateAssignment}><Plus className="w-4 h-4 mr-1"/> New</Button>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/10">No assignments created yet.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell className="text-muted-foreground">{assignment.subject}</TableCell>
                        <TableCell className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap pt-4"><Clock className="w-3 h-3"/> {new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{assignment.difficulty}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
           <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Today's Attendance Registry</CardTitle>
              <CardDescription>Live real-time student tracking for your active class.</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">No students are currently registered in the database. When students log in and complete setup, they will appear here dynamically.</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-[120px]">Roll No.</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Reg. Number</TableHead>
                        <TableHead className="text-right">Mark Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.rollno}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{student.registration_no}</TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                             <Button size="sm" variant="secondary" onClick={() => markAttendance(student.id, student.name, 'present')} className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600 border border-green-500/20">Present</Button>
                             <Button size="sm" variant="secondary" onClick={() => markAttendance(student.id, student.name, 'absent')} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 border border-red-500/20">Absent</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Weekly Roster</CardTitle>
                <CardDescription>7-Day Schedule. Only displaying assigned slots for {teacherProfile?.subject || 'your subject'}.</CardDescription>
              </div>
              <Badge className="bg-primary text-primary-foreground">{teacherProfile?.subject || 'Faculty'}</Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="min-w-[120px] font-bold">Time</TableHead>
                    {days.map(day => <TableHead key={day} className="text-center font-bold min-w-[100px]">{day}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periods.map((period, periodIndex) => (
                    <TableRow key={period}>
                      <TableCell className="font-medium text-xs bg-muted/10 border-r whitespace-nowrap">{period}</TableCell>
                      {days.map((day, dayIndex) => {
                        const slotTeacher = getTeacherForSlot(dayIndex, periodIndex);
                        
                        // Check if this slot belongs to the logic map of the current logged in teacher
                        // We check by strict name matching or subject matching to isolate THEIR slots
                        const isMyClass = slotTeacher && (slotTeacher.name === teacherProfile?.name || slotTeacher.subject === teacherProfile?.subject);
                        
                        return (
                          <TableCell key={day} className={`text-center transition-colors p-3 border-l border-border/30 ${isMyClass ? 'bg-primary/10 border-primary/40' : 'bg-muted/5'}`}>
                            {isMyClass ? (
                              <div className="flex flex-col items-center justify-center">
                                <span className="font-bold text-primary flex items-center gap-1"><BookOpen className="w-3 h-3"/> {slotTeacher.subject}</span>
                                <span className="text-[10px] text-muted-foreground font-semibold mt-1 bg-background/50 px-2 py-0.5 rounded-full border border-primary/20">Class assigned</span>
                              </div>
                            ) : (
                               <div className="text-muted-foreground/30 text-xs italic opacity-50">-</div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meets">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-3 border-border/50 shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border/50">
                <CardTitle>Schedule Proctor Meet</CardTitle>
                <CardDescription>Invite students for specific 1-1 or group video sessions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Target Participant</Label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={meetForm.student_email}
                    onChange={(e) => setMeetForm({...meetForm, student_email: e.target.value})}
                  >
                    <option value="all">Entire Class / All Students</option>
                    {students.map(s => <option key={s.id} value={s.email}>{s.name} ({s.rollno})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Topic / Agenda</Label>
                  <Input placeholder="e.g. Midterm Grades Discussion" value={meetForm.topic} onChange={(e) => setMeetForm({...meetForm, topic: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={meetForm.date} onChange={(e) => setMeetForm({...meetForm, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input type="time" value={meetForm.time} onChange={(e) => setMeetForm({...meetForm, time: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleScheduleMeet} disabled={isScheduling} className="w-full mt-2">
                  {isScheduling ? "Publishing..." : "Publish Meet Invitation"}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4 border-border/50 shadow-sm flex flex-col">
              <CardHeader className="bg-muted/10 border-b border-border/50">
                <CardTitle>Scheduled Meets</CardTitle>
                <CardDescription>Upcoming proctoring and 1-on-1 sessions you've hosted.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto">
                {meets.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">You have no upcoming meets scheduled.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/5">
                        <TableHead>Topic</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Status / Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meets.map(meet => (
                        <TableRow key={meet.id}>
                          <TableCell className="font-medium text-sm">{meet.topic}</TableCell>
                          <TableCell>
                             <Badge variant="outline" className={meet.student_email === 'all' ? 'border-primary/50 text-primary' : 'border-blue-500/50 text-blue-500'}>
                                {meet.student_email === 'all' ? 'All Class' : "1-on-1"}
                             </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground flex items-center gap-1.5 pt-4">
                            <Clock className="w-3 h-3" /> {new Date(meet.meeting_time).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short'})}
                          </TableCell>
                          <TableCell className="text-right">
                             {meet.status === 'happened' ? (
                               <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 w-[70px] justify-center">Happened</Badge>
                             ) : meet.status === 'failed' ? (
                               <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 w-[70px] justify-center">Failed</Badge>
                             ) : (
                               <div className="flex items-center justify-end gap-2">
                                 <Button size="sm" variant="outline" className="h-7 text-xs border-green-500/50 text-green-600 hover:bg-green-500/10" onClick={() => handleMeetStatusUpdate(meet.id, 'happened')}>Happened</Button>
                                 <Button size="sm" variant="outline" className="h-7 text-xs border-red-500/50 text-red-600 hover:bg-red-500/10" onClick={() => handleMeetStatusUpdate(meet.id, 'failed')}>Failed</Button>
                               </div>
                             )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground animate-pulse">Loading Faculty Dashboard...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  )
}
