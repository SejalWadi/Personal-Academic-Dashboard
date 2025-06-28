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
  const [gradeData, setGradeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadDashboardData();
  }, [status, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load dashboard stats
      const statsResponse = await fetch("/api/dashboard/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // Load recent assignments
      const assignmentsResponse = await fetch("/api/assignments");
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        const assignments = assignmentsData.assignments || [];
        setRecentAssignments(assignments.slice(0, 5)); // Show only 5 recent assignments
      }

      // Load courses
      const coursesResponse = await fetch("/api/courses");
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        const coursesArray = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
        setCourses(coursesArray);
      }

      // Load grades for chart
      const gradesResponse = await fetch("/api/grades");
      if (gradesResponse.ok) {
        const gradesData = await gradesResponse.json();
        const grades = gradesData.grades || [];
        
        // Transform grades data for chart
        const chartData = grades.map((grade: any, index: number) => ({
          name: grade.assignment?.title || `Assignment ${index + 1}`,
          grade: grade.percentage,
          average: 82, // You can calculate class average if you have that data
        }));
        
        setGradeData(chartData);
      }

    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentToggle = async (assignmentId: string) => {
    try {
      const assignment = recentAssignments.find(a => a.id === assignmentId);
      if (!assignment) return;

      const response = await fetch(`/api/assignments?id=${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !assignment.completed
        }),
      });

      if (response.ok) {
        // Update local state
        setRecentAssignments(prev => 
          prev.map(a => 
            a.id === assignmentId 
              ? { ...a, completed: !a.completed }
              : a
          )
        );

        // Reload dashboard stats to reflect changes
        const statsResponse = await fetch("/api/dashboard/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.stats);
        }
      }
    } catch (error) {
      console.error("Failed to update assignment:", error);
    }
  };

  if (status === "loading" || loading) {
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
          <RecentAssignments 
            assignments={recentAssignments} 
            onToggleComplete={handleAssignmentToggle}
          />
          <CourseProgress courses={courses} />
        </div>
        
        {gradeData.length > 0 && <GradeChart data={gradeData} />}
      </main>
    </div>
  );
}