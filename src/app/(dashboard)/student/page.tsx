"use client";

import { motion } from "framer-motion";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { BookOpen, CheckCircle, Clock, Award, FileUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const progressData = [
  { name: "Week 1", score: 65 },
  { name: "Week 2", score: 72 },
  { name: "Week 3", score: 85 },
  { name: "Week 4", score: 82 },
  { name: "Week 5", score: 90 },
  { name: "Week 6", score: 95 },
];

const assignments = [
  { id: 1, title: "Data Structures & Algorithms", due: "Tomorrow, 11:59 PM", status: "pending", difficulty: "High" },
  { id: 2, title: "Modern Web Frameworks", due: "Next Week", status: "submitted", difficulty: "Medium" },
  { id: 3, title: "Database Architecture", due: "Oct 24", status: "pending", difficulty: "Hard" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, Student 👋</h2>
          <p className="text-muted-foreground mt-1 text-lg">Here's your learning progress for this week.</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20"><FileUp className="w-4 h-4 mr-2" /> Upload Work</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">+1 from last semester</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 due this week</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+4 in the last 7 days</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3.8</div>
            <p className="text-xs text-muted-foreground mt-1">Top 15% of class</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Your average score trajectory over the last 6 weeks.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: 5 }} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  activeDot={{ r: 8, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Tasks requiring your attention soon.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5 flex-1">
              {assignments.map((assignment, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  key={assignment.id} 
                  className="flex items-start justify-between p-4 rounded-xl border border-border/40 bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <p className="font-semibold text-sm">{assignment.title}</p>
                       {assignment.status === "submitted" && <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Done</Badge>}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="w-3 h-3" /> {assignment.due}
                    </div>
                  </div>
                  {assignment.status === "pending" ? (
                    <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10">Submit</Button>
                  ) : (
                    <Button size="sm" variant="ghost" disabled>Submitted</Button>
                  )}
                </motion.div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-primary hover:bg-primary/10">View All Tasks</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
