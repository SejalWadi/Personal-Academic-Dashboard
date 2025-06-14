import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { HoverEffect } from "@/components/aceternity/card-hover-effect";
import { GraduationCap, BookOpen, BarChart3, Calendar, Target, Users } from "lucide-react";

const features = [
  {
    title: "Course Management",
    description: "Organize all your courses, track credits, and manage schedules in one place.",
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Assignment Tracking",
    description: "Never miss a deadline with smart assignment tracking and priority management.",
    icon: <Calendar className="h-6 w-6 text-green-500" />,
  },
  {
    title: "Grade Analytics",
    description: "Visualize your academic performance with detailed charts and insights.",
    icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
  },
  {
    title: "Goal Setting",
    description: "Set academic goals and track your progress towards achieving them.",
    icon: <Target className="h-6 w-6 text-orange-500" />,
  },
  {
    title: "Progress Tracking",
    description: "Monitor your academic journey with comprehensive progress indicators.",
    icon: <Users className="h-6 w-6 text-red-500" />,
  },
  {
    title: "Smart Planning",
    description: "Plan your academic future with intelligent scheduling and recommendations.",
    icon: <GraduationCap className="h-6 w-6 text-indigo-500" />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundBeams className="opacity-30" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">EduTrack</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Master Your Academic Journey
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The ultimate personal dashboard for students to track courses, manage assignments, 
          analyze performance, and achieve academic excellence.
        </p>
        <div className="space-x-4">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed specifically for modern students
          </p>
        </div>
        <HoverEffect items={features} />
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Academic Experience?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students who are already using EduTrack to achieve their academic goals.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold">EduTrack</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 EduTrack. Built for academic excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}