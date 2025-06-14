"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/dashboard/header";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentAssignments from "@/components/dashboard/recent-assignments";
import GradeChart from "@/components/dashboard/grade-chart";
import CourseProgress from "@/components/dashboard/course-progress";
import { DashboardStats, Assignment, Course } from "@/lib/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    averageGrade: 0,
    upcomingDeadlines: 0,
  });
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    // Load dashboard data
    loadDashboardData();
  }, [status, router]);

  const loadDashboardData = async () => {
    // Mock data for demonstration
    const mockStats: DashboardStats = {
      totalCourses: 5,
      totalAssignments: 12,
      completedAssignments: 8,
      averageGrade: 87.5,
      upcomingDeadlines: 3,
    };

    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "React Components Lab",
        type: "assignment",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        points: 100,
        completed: false,
        priority: "high",
        course: { name: "Web Development", code: "CS 350" } as Course,
      },
      {
        id: "2",
        title: "Database Design Quiz",
        type: "quiz",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        points: 50,
        completed: false,
        priority: "medium",
        course: { name: "Database Systems", code: "CS 340" } as Course,
      },
      {
        id: "3",
        title: "Algorithm Analysis",
        type: "assignment",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        points: 100,
        completed: true,
        priority: "high",
        course: { name: "Data Structures", code: "CS 260" } as Course,
      },
    ];

    const mockCourses: Course[] = [
      {
        id: "1",
        name: "Web Development",
        code: "CS 350",
        credits: 3,
        color: "#3B82F6",
        semester: "Fall",
        year: "2024",
        instructor: "Dr. Smith",
        assignments: mockAssignments.slice(0, 2),
      },
      {
        id: "2",
        name: "Database Systems",
        code: "CS 340",
        credits: 3,
        color: "#10B981",
        semester: "Fall",
        year: "2024",
        instructor: "Prof. Johnson",
        assignments: [mockAssignments[1]],
      },
      {
        id: "3",
        name: "Data Structures",
        code: "CS 260",
        credits: 4,
        color: "#F59E0B",
        semester: "Fall",
        year: "2024",
        instructor: "Dr. Williams",
        assignments: [mockAssignments[2]],
      },
    ];

    setStats(mockStats);
    setRecentAssignments(mockAssignments);
    setCourses(mockCourses);
  };

  const gradeData = [
    { name: "Quiz 1", grade: 85, average: 78 },
    { name: "Assignment 1", grade: 92, average: 85 },
    { name: "Midterm", grade: 88, average: 82 },
    { name: "Project", grade: 95, average: 87 },
    { name: "Quiz 2", grade: 82, average: 79 },
    { name: "Assignment 2", grade: 90, average: 84 },
  ];

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
        <StatsCards stats={stats} />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAssignments assignments={recentAssignments} />
          <CourseProgress courses={courses} />
        </div>
        
        <GradeChart data={gradeData} />
      </main>
    </div>
  );
}