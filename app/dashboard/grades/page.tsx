"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import AddGradeModal from "@/components/modals/add-grade-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Grade, Assignment, Course } from "@/lib/types";
import { format } from "date-fns";
import { Plus, BookOpen, TrendingUp, Award, BarChart3 } from "lucide-react";

export default function GradesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadData();
  }, [status, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [gradesResponse, assignmentsResponse, coursesResponse] = await Promise.all([
        fetch("/api/grades"),
        fetch("/api/assignments"),
        fetch("/api/courses")
      ]);

      if (gradesResponse.ok) {
        const gradesData = await gradesResponse.json();
        setGrades(gradesData.grades || []);
      }

      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.assignments || []);
      }

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(Array.isArray(coursesData) ? coursesData : coursesData.courses || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const calculateStats = () => {
    if (grades.length === 0) {
      return {
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
        totalGrades: 0,
      };
    }

    const percentages = grades.map(g => g.percentage);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    
    return {
      averageGrade: Math.round(average * 10) / 10,
      highestGrade: Math.max(...percentages),
      lowestGrade: Math.min(...percentages),
      totalGrades: grades.length,
    };
  };

  const stats = calculateStats();

  // Get assignments that don't have grades yet
  const ungraduatedAssignments = assignments.filter(assignment => 
    !grades.some(grade => grade.assignmentId === assignment.id)
  );

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Grades</h1>
            <p className="text-muted-foreground">
              Track and manage your assignment grades and performance
            </p>
          </div>
          <AddGradeModal 
            assignments={ungraduatedAssignments}
            courses={courses}
            onGradeAdded={loadData} 
          />
        </div>

        {/* Grade Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageGrade}%</div>
              <p className="text-xs text-muted-foreground">
                {getLetterGrade(stats.averageGrade)} average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Highest Grade</CardTitle>
                <Award className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.highestGrade}%</div>
              <p className="text-xs text-muted-foreground">
                {getLetterGrade(stats.highestGrade)} grade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lowest Grade</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(stats.lowestGrade)}`}>
                {stats.lowestGrade}%
              </div>
              <p className="text-xs text-muted-foreground">
                {getLetterGrade(stats.lowestGrade)} grade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Total Grades</CardTitle>
                <BookOpen className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGrades}</div>
              <p className="text-xs text-muted-foreground">
                {ungraduatedAssignments.length} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grades List */}
        <div className="space-y-4">
          {grades.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No grades yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding grades for your completed assignments
                  </p>
                  {ungraduatedAssignments.length > 0 ? (
                    <AddGradeModal 
                      assignments={ungraduatedAssignments}
                      courses={courses}
                      onGradeAdded={loadData}
                      trigger={
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Grade
                        </Button>
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Add some assignments first to start grading
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {grades.map((grade) => (
                <Card key={grade.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold">
                              {grade.assignment?.title || "Unknown Assignment"}
                            </h3>
                            <Badge variant="outline">
                              {grade.assignment?.type || "assignment"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {grade.course?.name} ({grade.course?.code})
                            </span>
                          </div>
                          <div>
                            Due: {grade.assignment?.dueDate ? format(new Date(grade.assignment.dueDate), 'MMM d, yyyy') : 'N/A'}
                          </div>
                        </div>

                        {grade.feedback && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Feedback:</strong> {grade.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`text-2xl font-bold ${getGradeColor(grade.percentage)}`}>
                            {Math.round(grade.percentage)}%
                          </div>
                          <Badge variant="outline" className={getGradeColor(grade.percentage)}>
                            {getLetterGrade(grade.percentage)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {grade.score}/{grade.points} points
                        </div>
                        <div className="w-24">
                          <Progress value={grade.percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pending Assignments */}
        {ungraduatedAssignments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assignments Pending Grades</CardTitle>
              <CardDescription>
                {ungraduatedAssignments.length} assignment(s) waiting for grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ungraduatedAssignments.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course?.name} • Due {format(new Date(assignment.dueDate), 'MMM d')}
                      </p>
                    </div>
                    <AddGradeModal 
                      assignments={[assignment]}
                      courses={courses}
                      onGradeAdded={loadData}
                      trigger={
                        <Button size="sm" variant="outline">
                          Add Grade
                        </Button>
                      }
                    />
                  </div>
                ))}
                {ungraduatedAssignments.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    And {ungraduatedAssignments.length - 5} more assignments...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}