"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/dashboard/header";
import AddEventModal from "@/components/modals/add-event-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Assignment } from "@/lib/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  date: Date;
  time?: string;
  duration: number;
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    
    loadData();
  }, [status, router, currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load assignments
      const assignmentsResponse = await fetch("/api/assignments");
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.assignments || []);
      }

      // Load events for current month
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const eventsResponse = await fetch(`/api/events?month=${month}&year=${year}`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents((eventsData.events || []).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        })));
      }
    } catch (error) {
      console.error("Failed to load calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getItemsForDate = (date: Date) => {
    const dayAssignments = assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
    const dayEvents = events.filter(event => 
      isSameDay(event.date, date)
    );
    
    return [...dayAssignments, ...dayEvents];
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

  const getSelectedDateItems = () => {
    if (!selectedDate) return [];
    return getItemsForDate(selectedDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "event": return "#3B82F6";
      case "study": return "#10B981";
      case "meeting": return "#F59E0B";
      case "exam": return "#EF4444";
      case "deadline": return "#8B5CF6";
      default: return "#6B7280";
    }
  };

  // Helper function to get the date from either assignment or event
  const getItemDate = (item: Assignment | Event): Date => {
    if ('dueDate' in item) {
      return new Date(item.dueDate);
    } else {
      return new Date(item.date);
    }
  };

  // Helper function to check if item is an assignment
  const isAssignment = (item: Assignment | Event): item is Assignment => {
    return 'dueDate' in item;
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
            <h1 className="text-3xl font-bold">Academic Calendar</h1>
            <p className="text-muted-foreground">
              View and manage your assignment deadlines and important dates
            </p>
          </div>
          <AddEventModal 
            selectedDate={selectedDate || undefined}
            onEventAdded={loadData}
          />
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
                    const dayItems = getItemsForDate(day);
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
                          {dayItems.slice(0, 2).map((item: any) => (
                            <div
                              key={item.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ 
                                backgroundColor: isAssignment(item) 
                                  ? (item.course?.color + '20') 
                                  : (getEventTypeColor(item.type) + '20'),
                                color: isAssignment(item) 
                                  ? item.course?.color 
                                  : getEventTypeColor(item.type)
                              }}
                            >
                              {item.title}
                            </div>
                          ))}
                          {dayItems.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayItems.length - 2} more
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
                    {getSelectedDateItems().length} item(s) on this date
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getSelectedDateItems().length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground text-sm mb-3">
                        No items on this date
                      </p>
                      <AddEventModal 
                        selectedDate={selectedDate}
                        onEventAdded={loadData}
                        trigger={
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    getSelectedDateItems().map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {isAssignment(item) 
                                ? `${item.course?.name} • ${item.points} points`
                                : `${item.type} • ${item.duration}min`
                              }
                            </p>
                          </div>
                          {isAssignment(item) && item.priority && (
                            <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                              {item.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...assignments, ...events]
                  .filter(item => {
                    const itemDate = getItemDate(item);
                    return itemDate >= new Date();
                  })
                  .sort((a, b) => {
                    const dateA = getItemDate(a);
                    const dateB = getItemDate(b);
                    return dateA.getTime() - dateB.getTime();
                  })
                  .slice(0, 5)
                  .map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {isAssignment(item) ? item.course?.code : item.type} • {format(getItemDate(item), 'MMM d')}
                        </p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: isAssignment(item) 
                            ? item.course?.color 
                            : getEventTypeColor(item.type) 
                        }}
                      />
                    </div>
                  ))}
                {[...assignments, ...events].filter(item => {
                  const itemDate = getItemDate(item);
                  return itemDate >= new Date();
                }).length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No upcoming items
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}