"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, UserCheck, BarChart3, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Assignments",
    description: "Seamlessly create, distribute, and grade assignments with automated tracking and due date reminders.",
    icon: BookOpen,
  },
  {
    name: "Attendance",
    description: "One-click attendance tracking for daily classes, complete with comprehensive absent/present reports.",
    icon: UserCheck,
  },
  {
    name: "Analytics",
    description: "Deep insights into student performance with visual charts to identify learning trends securely.",
    icon: BarChart3,
  },
  {
    name: "Communication",
    description: "Real-time chat and announcements to keep the entire classroom connected and informed.",
    icon: MessageSquare,
  },
];

const testimonials = [
  {
    content: "ClassPulse completely changed how I manage my daily lectures. Grading is faster and insights are incredible.",
    author: "Sarah Jenkins",
    role: "High School Teacher",
  },
  {
    content: "Keeping track of assignments used to be a nightmare, but now I know exactly what's due and when. Highly recommended!",
    author: "David M.",
    role: "Computer Science Student",
  },
  {
    content: "An absolute game-changer. The interface is beautiful, minimalistic, and distraction-free.",
    author: "Prof. Alan R.",
    role: "University Lecturer",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px] opacity-50 dark:opacity-30 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px] opacity-50 dark:opacity-30 mix-blend-multiply" />
        </div>

        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              ClassPulse v2.0 is now live
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
              Revolutionizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Classroom Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The premium, all-in-one platform for modern educators and students. Manage assignments, track attendance, and analyze performance with an intelligent, elegant interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-full w-full sm:w-auto px-8 h-14 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto px-8 h-14 text-base">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo / Dashboard Preview */}
      <section id="demo" className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-3xl shadow-2xl overflow-hidden shadow-primary/10"
          >
            <div className="h-12 border-b border-border/50 bg-muted/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 bg-background/50 rounded-md px-3 py-1 flex-1 max-w-md border border-border/50 flex items-center mx-auto absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                <BookOpen className="w-3 h-3 mr-2" /> classpulse.app/dashboard
              </div>
            </div>
            
            <div className="aspect-[16/9] w-full bg-card flex">
              {/* Fake Sidebar */}
              <div className="w-16 md:w-64 border-r border-border/50 flex flex-col p-4 bg-muted/20">
                <div className="h-8 w-8 md:w-full bg-primary/10 rounded-md mb-8 animate-pulse" />
                <div className="space-y-4 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-muted rounded-md animate-pulse opacity-50" />
                  ))}
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                <div className="h-32 bg-muted rounded-xl md:col-span-2 animate-pulse" />
                <div className="h-32 bg-muted rounded-xl animate-pulse" />
                <div className="h-64 bg-muted rounded-xl md:col-span-3 border border-border/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 hidden md:block">
              Everything you need to <span className="text-primary italic">excel</span>.
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:hidden">
              Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools designed to reduce administrative overhead and increase meaningful connections between students and educators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl border border-border/50 bg-card hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-4 -translate-y-4">
                  <feature.icon className="w-32 h-32" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            Loved by <span className="text-primary">educators</span> globally.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm relative"
              >
                <div className="mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-500 text-lg mr-1">★</span>
                  ))}
                </div>
                <p className="text-foreground/90 italic mb-6 leading-relaxed">"{test.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {test.author[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{test.author}</h4>
                    <p className="text-xs text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to transform your classroom?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of teachers and students who are already using ClassPulse to streamline their educational journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl">
                  Get Started for Free
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
