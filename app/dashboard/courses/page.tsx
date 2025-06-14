"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/lib/types";
import { BookOpen, Users, Clock, Plus, Calendar } from "lucide-react";

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadCourses();
  }, [status, router]);

  const loadCourses = async () => {
    // Mock data for demonstration
    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Advanced Web Development",
        code: "CS 350",
        credits: 3,
        color: "#3B82F6",
        semester: "Fall",
        year: "2024",
        instructor: "Dr. Sarah Smith",
        schedule: "MWF 10:00-11:00 AM",
        assignments: [
          { id: "1", title: "React Components Lab", type: "assignment", dueDate: new Date(), points: 100, completed: false, priority: "high" },
          { id: "2", title: "API Integration Project", type: "project", dueDate: new Date(), points: 150, completed: true, priority: "high" },
        ],
      },
      {
        id: "2",
        name: "Database Systems",
        code: "CS 340",
        credits: 3,
        color: "#10B981",
        semester: "Fall",
        year: "2024",
        instructor: "Prof. Michael Johnson",
        schedule: "TTh 2:00-3:30 PM",
        assignments: [
          { id: "3", title: "Database Design Quiz", type: "quiz", dueDate: new Date(), points: 50, completed: false, priority: "medium" },
          { id: "4", title: "SQL Optimization Lab", type: "assignment", dueDate: new Date(), points: 100, completed: false, priority: "medium" },
        ],
      },
      {
        id: "3",
        name: "Data Structures & Algorithms",
        code: "CS 260",
        credits: 4,
        color: "#F59E0B",
        semester: "Fall",
        year: "2024",
        instructor: "Dr. Emily Williams",
        schedule: "MWF 1:00-2:00 PM",
        assignments: [
          { id: "5", title: "Algorithm Analysis", type: "assignment", dueDate: new Date(), points: 100, completed: true, priority: "high" },
          { id: "6", title: "Binary Tree Implementation", type: "project", dueDate: new Date(), points: 120, completed: false, priority: "high" },
        ],
      },
      {
        id: "4",
        name: "Software Engineering",
        code: "CS 380",
        credits: 3,
        color: "#8B5CF6",
        semester: "Fall",
        year: "2024",
        instructor: "Prof. David Chen",
        schedule: "TTh 11:00-12:30 PM",
        assignments: [
          { id: "7", title: "Requirements Analysis", type: "assignment", dueDate: new Date(), points: 80, completed: true, priority: "medium" },
          { id: "8", title: "Team Project Proposal", type: "project", dueDate: new Date(), points: 200, completed: false, priority: "high" },
        ],
      },
      {
        id: "5",
        name: "Computer Networks",
        code: "CS 420",
        credits: 3,
        color: "#EF4444",
        semester: "Fall",
        year: "2024",
        instructor: "Dr. Lisa Anderson",
        schedule: "MWF 3:00-4:00 PM",
        assignments: [
          { id: "9", title: "Network Protocol Lab", type: "assignment", dueDate: new Date(), points: 100, completed: false, priority: "medium" },
          { id: "10", title: "Security Analysis", type: "assignment", dueDate: new Date(), points: 90, completed: false, priority: "low" },
        ],
      },
    ];

    setCourses(mockCourses);
  };

  const calculateProgress = (course: Course) => {
    if (!course.assignments) return 0;
    const completed = course.assignments.filter(a => a.completed).length;
    return course.assignments.length > 0 ? (completed / course.assignments.length) * 100 : 0;
  };

  const getUpcomingAssignments = (course: Course) => {
    if (!course.assignments) return 0;
    return course.assignments.filter(a => !a.completed).length;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">
              Manage your enrolled courses and track progress
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const progress = calculateProgress(course);
            const upcomingAssignments = getUpcomingAssignments(course);
            
            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <Badge variant="outline" style={{ borderColor: course.color, color: course.color }}>
                          {course.code}
                        </Badge>
                        <span>{course.credits} credits</span>
                      </CardDescription>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: course.color }}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{course.schedule?.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{upcomingAssignments} pending</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Enrolled this semester
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.length > 0 
                  ? (courses.reduce((sum, course) => sum + calculateProgress(course), 0) / courses.length).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((sum, course) => sum + getUpcomingAssignments(course), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Due soon
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}