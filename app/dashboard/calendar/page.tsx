"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/lib/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
        type: "quiz",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        points: 50,
        completed: false,
        priority: "medium",
        course: { id: "2", name: "Database Systems", code: "CS 340", credits: 3, color: "#10B981", semester: "Fall", year: "2024" },
      },
      {
        id: "3",
        title: "Algorithm Analysis",
        type: "assignment",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        points: 100,
        completed: false,
        priority: "high",
        course: { id: "3", name: "Data Structures", code: "CS 260", credits: 4, color: "#F59E0B", semester: "Fall", year: "2024" },
      },
      {
        id: "4",
        title: "Team Project Proposal",
        type: "project",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        points: 200,
        completed: false,
        priority: "high",
        course: { id: "4", name: "Software Engineering", code: "CS 380", credits: 3, color: "#8B5CF6", semester: "Fall", year: "2024" },
      },
      {
        id: "5",
        title: "Midterm Exam",
        type: "exam",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        points: 150,
        completed: false,
        priority: "high",
        course: { id: "5", name: "Computer Networks", code: "CS 420", credits: 3, color: "#EF4444", semester: "Fall", year: "2024" },
      },
    ];

    setAssignments(mockAssignments);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getSelectedDateAssignments = () => {
    if (!selectedDate) return [];
    return getAssignmentsForDate(selectedDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
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
            <h1 className="text-3xl font-bold">Academic Calendar</h1>
            <p className="text-muted-foreground">
              View and manage your assignment deadlines and important dates
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const dayAssignments = getAssignmentsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors
                          ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                          ${isToday(day) ? 'ring-2 ring-primary' : ''}
                          ${!isCurrentMonth ? 'opacity-50' : ''}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayAssignments.slice(0, 2).map(assignment => (
                            <div
                              key={assignment.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ 
                                backgroundColor: assignment.course?.color + '20',
                                color: assignment.course?.color 
                              }}
                            >
                              {assignment.title}
                            </div>
                          ))}
                          {dayAssignments.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayAssignments.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Details */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </CardTitle>
                  <CardDescription>
                    {getSelectedDateAssignments().length} assignment(s) due
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getSelectedDateAssignments().length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No assignments due on this date
                    </p>
                  ) : (
                    getSelectedDateAssignments().map(assignment => (
                      <div key={assignment.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{assignment.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {assignment.course?.name} • {assignment.points} points
                            </p>
                          </div>
                          <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                            {assignment.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {assignments
                  .filter(a => !a.completed && new Date(a.dueDate) >= new Date())
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 5)
                  .map(assignment => (
                    <div key={assignment.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{assignment.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {assignment.course?.code} • {format(new Date(assignment.dueDate), 'MMM d')}
                        </p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: assignment.course?.color }}
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}