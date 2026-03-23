"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  role: "student" | "teacher";
}

const teacherLinks = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { name: "Assignments", href: "/teacher/assignments", icon: FileText },
  { name: "Attendance", href: "/teacher/attendance", icon: Users },
  { name: "Analytics", href: "/teacher/analytics", icon: BarChart },
];

const studentLinks = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Assignments", href: "/student/assignments", icon: FileText },
  { name: "Progress", href: "/student/progress", icon: BarChart },
];

export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-card border-r border-border/50 sticky top-0 flex flex-col z-20 shadow-sm"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50 relative">
        <Link href="/" className="flex items-center gap-2 overflow-hidden">
          <div className="bg-primary/10 p-1.5 rounded-lg flex-shrink-0">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg whitespace-nowrap tracking-tight text-primary"
              >
                ClassPulse
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-border bg-background shadow-md hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-3">
        <div className="mb-2 px-2">
          {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p>}
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.name} href={link.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group overflow-hidden",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <link.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{link.name}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50 space-y-2">
        <Link href={`/${role}/settings`}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all group">
            <Settings className="h-5 w-5 flex-shrink-0 group-hover:text-primary" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </div>
        </Link>
        <Link href="/login">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-destructive hover:bg-destructive/10 transition-all group">
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
