"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/lib/types";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Plus, Filter, Calendar, BookOpen } from "lucide-react";

export default function AssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadAssignments();
  }, [status, router]);

  const loadAssignments = async () => {
    // Mock data for demonstration
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "React Components Lab",
        description: "Build a set of reusable React components with proper TypeScript types and documentation",
        type: "assignment",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        points: 100,
        completed: false,
        priority: "high",
        course: { id: "1", name: "Web Development", code: "CS 350", credits: 3, color: "#3B82F6", semester: "Fall", year: "2024" },
      },
      {
        id: "2",
        title: "Database Design Quiz",
        description: "Quiz covering normalization, ER diagrams, and relational database design principles",
        type: "quiz",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        points: 50,
        completed: false,
        priority: "medium",
        course: { id: "2", name: "Database Systems", code: "CS 340", credits: 3, color: "#10B981", semester: "Fall", year: "2024" },
      },
      {
        id: "3",
        title: "Algorithm Analysis Report",
        description: "Analyze time and space complexity of various sorting algorithms with empirical testing",
        type: "assignment",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        points: 100,
        completed: true,
        priority: "high",
        course: { id: "3", name: "Data Structures", code: "CS 260", credits: 4, color: "#F59E0B", semester: "Fall", year: "2024" },
      },
      {
        id: "4",
        title: "Team Project Proposal",
        description: "Submit a comprehensive project proposal for the semester-long software engineering project",
        type: "project",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        points: 200,
        completed: false,
        priority: "high",
        course: { id: "4", name: "Software Engineering", code: "CS 380", credits: 3, color: "#8B5CF6", semester: "Fall", year: "2024" },
      },
      {
        id: "5",
        title: "Network Protocol Implementation",
        description: "Implement a simple network protocol using socket programming in Python",
        type: "assignment",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        points: 120,
        completed: false,
        priority: "medium",
        course: { id: "5", name: "Computer Networks", code: "CS 420", credits: 3, color: "#EF4444", semester: "Fall", year: "2024" },
      },
      {
        id: "6",
        title: "Binary Tree Visualization",
        description: "Create an interactive visualization of binary tree operations using JavaScript",
        type: "project",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        points: 150,
        completed: false,
        priority: "medium",
        course: { id: "3", name: "Data Structures", code: "CS 260", credits: 4, color: "#F59E0B", semester: "Fall", year: "2024" },
      },
    ];

    setAssignments(mockAssignments);
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

  const toggleComplete = (assignmentId: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
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
                  <p className="text-muted-foreground">
                    {filter === "all" 
                      ? "You don't have any assignments yet."
                      : `No ${filter} assignments found.`
                    }
                  </p>
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
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
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