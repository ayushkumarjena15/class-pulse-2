"use client";

import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, FileText, Upload, Plus, AlertCircle, Calendar, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const classPerformance = [
  { name: "Computer Sci", avg: 85 },
  { name: "Mathematics", avg: 76 },
  { name: "Physics", avg: 81 },
  { name: "Literature", avg: 92 },
  { name: "History", avg: 65 },
];

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teacher Overview</h2>
          <p className="text-muted-foreground mt-1 text-lg">Manage your classes, assignments, and curriculum securely.</p>
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
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1 text-green-500 flex items-center">
              +12 this semester
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">3 due this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground mt-1 text-red-400 flex items-center">
              -2% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requires Grading</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive/80">
              High priority tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50 bg-background/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle>Class Performance Analytics</CardTitle>
            <CardDescription>Average scores across different subjects you teach.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformance} maxBarSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: 8, border: '1px solid hsl(var(--border))' }}
                />
                <Bar 
                  dataKey="avg" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
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
            {[1, 2, 3].map((i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                key={i} 
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold">
                    AT
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Alex Turner</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-destructive" /> Missing 3 assignments
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
                  Message
                </Button>
              </motion.div>
            ))}
            <div className="mt-auto pt-4">
              <Button variant="outline" className="w-full text-xs hover:bg-background">View Complete List</Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
