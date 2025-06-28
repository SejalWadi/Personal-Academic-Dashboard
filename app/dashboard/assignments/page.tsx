"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import AddAssignmentModal from "@/components/modals/add-assignment-modal";
import EditAssignmentModal from "@/components/modals/edit-assignment-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Assignment, Course } from "@/lib/types";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Plus, Filter, Calendar, BookOpen } from "lucide-react";

export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
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
      
      // Load assignments and courses in parallel
      const [assignmentsResponse, coursesResponse] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/courses")
      ]);

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

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === "pending") return !assignment.completed;
    if (filter === "completed") return assignment.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
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

  const getStatusIcon = (assignment: Assignment) => {
    if (assignment.completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;
    
    return isOverdue ? (
      <AlertCircle className="h-5 w-5 text-red-600" />
    ) : (
      <Clock className="h-5 w-5 text-orange-600" />
    );
  };

  const toggleComplete = async (assignmentId: string) => {
    try {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (!assignment) return;

      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !assignment.completed
        }),
      });

      if (response.ok) {
        setAssignments(prev => 
          prev.map(assignment => 
            assignment.id === assignmentId 
              ? { ...assignment, completed: !assignment.completed }
              : assignment
          )
        );
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              Track and manage all your academic assignments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
            </div>
            <AddAssignmentModal onAssignmentAdded={loadData} />
          </div>
        </div>

        {/* Assignment Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {assignments.filter(a => !a.completed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.completed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No assignments found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === "all" 
                      ? "You don't have any assignments yet."
                      : `No ${filter} assignments found.`
                    }
                  </p>
                  {filter === "all" && (
                    <AddAssignmentModal 
                      onAssignmentAdded={loadData}
                      trigger={
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Assignment
                        </Button>
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {getStatusIcon(assignment)}
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <Badge 
                            variant="outline" 
                            style={{ 
                              borderColor: getTypeColor(assignment.type),
                              color: getTypeColor(assignment.type)
                            }}
                          >
                            {assignment.type}
                          </Badge>
                          <Badge variant={getPriorityColor(assignment.priority)}>
                            {assignment.priority} priority
                          </Badge>
                          {assignment.completed && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        {assignment.description && (
                          <p className="text-muted-foreground text-sm">
                            {assignment.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{assignment.course?.name} ({assignment.course?.code})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}</span>
                          </div>
                          <span>{assignment.points} points</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={assignment.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleComplete(assignment.id)}
                      >
                        {assignment.completed ? "Completed" : "Mark Complete"}
                      </Button>
                      <EditAssignmentModal 
                        assignment={assignment}
                        courses={courses}
                        onAssignmentUpdated={loadData}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}