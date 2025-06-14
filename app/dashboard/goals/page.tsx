"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/lib/types";
import { formatDistanceToNow, format } from "date-fns";
import { Plus, Target, Calendar, CheckCircle, Clock, Flag, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadGoals();
  }, [status, router]);

  const loadGoals = async () => {
    // Mock data for demonstration
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Maintain 3.8 GPA",
        description: "Keep GPA above 3.8 for Dean's List eligibility and scholarship requirements",
        category: "academic",
        targetDate: new Date('2024-12-15'),
        completed: false,
        priority: "high",
        progress: 75,
      },
      {
        id: "2",
        title: "Complete Internship Applications",
        description: "Apply to at least 5 tech companies for summer internship positions",
        category: "career",
        targetDate: new Date('2024-02-01'),
        completed: false,
        priority: "high",
        progress: 60,
      },
      {
        id: "3",
        title: "Learn React Native",
        description: "Complete online course and build a mobile app project",
        category: "personal",
        targetDate: new Date('2024-03-30'),
        completed: false,
        priority: "medium",
        progress: 30,
      },
      {
        id: "4",
        title: "Join Programming Club",
        description: "Become an active member and participate in coding competitions",
        category: "personal",
        targetDate: new Date('2024-01-15'),
        completed: true,
        priority: "medium",
        progress: 100,
      },
      {
        id: "5",
        title: "Complete Capstone Project",
        description: "Finish senior capstone project with high quality deliverables",
        category: "academic",
        targetDate: new Date('2024-05-01'),
        completed: false,
        priority: "high",
        progress: 25,
      },
      {
        id: "6",
        title: "Improve Public Speaking",
        description: "Join Toastmasters and give at least 3 presentations this semester",
        category: "personal",
        targetDate: new Date('2024-04-15'),
        completed: false,
        priority: "low",
        progress: 45,
      },
    ];

    setGoals(mockGoals);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === "active") return !goal.completed;
    if (filter === "completed") return goal.completed;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic": return "#3B82F6";
      case "career": return "#10B981";
      case "personal": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "academic": return <Target className="h-4 w-4" />;
      case "career": return <TrendingUp className="h-4 w-4" />;
      case "personal": return <Flag className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const toggleComplete = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
          : goal
      )
    );
  };

  const getGoalStats = () => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const active = goals.filter(g => !g.completed).length;
    const highPriority = goals.filter(g => !g.completed && g.priority === "high").length;
    
    return { total, completed, active, highPriority };
  };

  const stats = getGoalStats();

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
            <h1 className="text-3xl font-bold">Academic Goals</h1>
            <p className="text-muted-foreground">
              Set, track, and achieve your academic and career objectives
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
                variant={filter === "active" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
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
              Add Goal
            </Button>
          </div>
        </div>

        {/* Goal Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No goals found</h3>
                  <p className="text-muted-foreground">
                    {filter === "all" 
                      ? "You don't have any goals yet."
                      : `No ${filter} goals found.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full" 
                           style={{ backgroundColor: getCategoryColor(goal.category) + '20' }}>
                        <div style={{ color: getCategoryColor(goal.category) }}>
                          {getCategoryIcon(goal.category)}
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                          <Badge variant="outline" style={{ 
                            borderColor: getCategoryColor(goal.category),
                            color: getCategoryColor(goal.category)
                          }}>
                            {goal.category}
                          </Badge>
                          <Badge variant={getPriorityColor(goal.priority)}>
                            {goal.priority} priority
                          </Badge>
                          {goal.completed && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        
                        {goal.description && (
                          <p className="text-muted-foreground text-sm">
                            {goal.description}
                          </p>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                        
                        {goal.targetDate && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                              {!goal.completed && (
                                <span className="ml-1">
                                  ({formatDistanceToNow(new Date(goal.targetDate), { addSuffix: true })})
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={goal.completed ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleComplete(goal.id)}
                      >
                        {goal.completed ? "Completed" : "Mark Complete"}
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