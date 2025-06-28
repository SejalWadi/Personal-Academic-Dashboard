"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Target, Award, BookOpen, Clock } from "lucide-react";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadAnalyticsData();
  }, [status, router]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load user profile for GPA
      const profileResponse = await fetch("/api/user/profile");
      const profileData = await profileResponse.json();
      
      // Load grades for trend analysis
      const gradesResponse = await fetch("/api/grades");
      const gradesData = await gradesResponse.json();
      
      // Load courses for performance analysis
      const coursesResponse = await fetch("/api/courses");
      const coursesData = await coursesResponse.json();
      
      // Load assignments for completion analysis
      const assignmentsResponse = await fetch("/api/assignments");
      const assignmentsData = await assignmentsResponse.json();

      // Process data for charts
      const grades = gradesData.grades || [];
      const courses = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
      const assignments = assignmentsData.assignments || [];

      // Grade trend data
      const gradeData = grades.map((grade: any, index: number) => ({
        name: grade.assignment?.title?.substring(0, 10) || `Assignment ${index + 1}`,
        grade: Math.round(grade.percentage),
        target: 85,
      }));

      // Time distribution (based on assignment types)
      const assignmentTypes = assignments.reduce((acc: any, assignment: any) => {
        acc[assignment.type] = (acc[assignment.type] || 0) + 1;
        return acc;
      }, {});

      const timeDistribution = Object.entries(assignmentTypes).map(([type, count]: [string, any]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
        color: getTypeColor(type),
      }));

      // Weekly progress (last 4 weeks of assignments)
      const now = new Date();
      const weeklyProgress = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        const weekAssignments = assignments.filter((a: any) => {
          const dueDate = new Date(a.dueDate);
          return dueDate >= weekStart && dueDate < weekEnd;
        });
        
        const completed = weekAssignments.filter((a: any) => a.completed).length;
        
        weeklyProgress.push({
          week: `Week ${4 - i}`,
          completed,
          total: weekAssignments.length,
        });
      }

      setAnalyticsData({
        user: profileData.user,
        gradeData,
        timeDistribution,
        weeklyProgress,
        totalAssignments: assignments.length,
        completedAssignments: assignments.filter((a: any) => a.completed).length,
        averageGrade: grades.length > 0 
          ? Math.round(grades.reduce((sum: number, g: any) => sum + g.percentage, 0) / grades.length)
          : 0,
      });
      
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assignment": return "#3B82F6";
      case "quiz": return "#10B981";
      case "exam": return "#EF4444";
      case "project": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        </main>
      </div>
    );
  }

  const { user, gradeData, timeDistribution, weeklyProgress } = analyticsData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Academic Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your academic performance and progress
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.gpa || 'N/A'}</div>
              <p className="text-xs text-green-600">
                {user?.gpa ? `Out of 10.0` : 'Set in profile'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.totalAssignments > 0 
                  ? Math.round((analyticsData.completedAssignments / analyticsData.totalAssignments) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-blue-600">
                {analyticsData.completedAssignments}/{analyticsData.totalAssignments} assignments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.averageGrade}%</div>
              <p className="text-xs text-purple-600">Across all assignments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
                <Award className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.year || 'N/A'}</div>
              <p className="text-xs text-orange-600">{user?.major || 'Set major in profile'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grade Trend */}
          {gradeData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Grade Trend</CardTitle>
                <CardDescription>Your academic performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="grade"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      name="Your Grade"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Weekly Progress - Moved up */}
          {weeklyProgress.some((w: any) => w.total > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Assignment completion by week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                    <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Assignment Distribution */}
          {timeDistribution.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Assignment Distribution</CardTitle>
                <CardDescription>Types of assignments you have</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {timeDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Performance Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyticsData.averageGrade >= 85 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">High average grade performance</span>
                </div>
              )}
              {(analyticsData.completedAssignments / analyticsData.totalAssignments) >= 0.8 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Consistent assignment completion</span>
                </div>
              )}
              {user?.gpa >= 3.5 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Strong overall GPA</span>
                </div>
              )}
              {(!analyticsData.averageGrade || analyticsData.averageGrade < 85) && 
               (!user?.gpa || user.gpa < 3.5) && 
               (analyticsData.completedAssignments / analyticsData.totalAssignments) < 0.8 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Getting started with academic tracking</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analyticsData.averageGrade < 85 && analyticsData.averageGrade > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Focus on improving assignment grades</span>
                </div>
              )}
              {(analyticsData.completedAssignments / analyticsData.totalAssignments) < 0.8 && analyticsData.totalAssignments > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Increase assignment completion rate</span>
                </div>
              )}
              {user?.gpa && user.gpa < 3.5 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Work on overall GPA improvement</span>
                </div>
              )}
              {analyticsData.totalAssignments === 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Add assignments to track progress</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Set up regular study schedule</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Track all assignments and deadlines</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Review analytics weekly for insights</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}