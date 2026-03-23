"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function DashboardHeader() {
  const pathname = usePathname();
  const title = pathname.split("/").pop() || "Dashboard";
  const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-xl font-semibold tracking-tight hidden sm:block">
          {capitalizedTitle === "Teacher" || capitalizedTitle === "Student" ? "Overview" : capitalizedTitle}
        </h1>
        <div className="relative max-w-md w-full ml-4 hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search classes, assignments..." 
            className="pl-9 bg-muted/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 flex-1">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative rounded-full cursor-pointer")}>
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-2 right-2.5 h-2 w-2 bg-destructive rounded-full animate-pulse border border-background" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 py-8 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost" }), "relative h-9 w-9 rounded-full ml-2 p-0 cursor-pointer overflow-hidden")}>
            <Avatar className="h-9 w-9 border border-primary/20">
              <AvatarImage src="/placeholder-user.jpg" alt="@user" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">UK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          {/* @ts-expect-error Next 15 React 19 type mismatch */}
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  user@classpulse.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
