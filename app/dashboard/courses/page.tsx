import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Users, 
  Clock, 
  BookOpen 
} from 'lucide-react';

// Define the Course interface
interface Assignment {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface Course {
  id: string;
  name: string;
  code?: string;
  credits?: number;
  color?: string;
  instructor?: string;
  schedule?: string;
  assignments?: Assignment[];
}

// Header component (you may need to import this or create it)
const Header = () => (
  <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 items-center">
      <div className="mr-4 hidden md:flex">
        <a className="mr-6 flex items-center space-x-2" href="/">
          <span className="hidden font-bold sm:inline-block">
            Course Manager
          </span>
        </a>
      </div>
    </div>
  </header>
);

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock status for demonstration - replace with your actual auth status
  const [status] = useState<"loading" | "authenticated" | "unauthenticated">("authenticated");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching courses...");
      const res = await fetch("/api/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Courses data received:", data);

      // Handle different response formats
      let coursesArray: Course[] = [];
      
      if (data.success && Array.isArray(data.courses)) {
        coursesArray = data.courses;
      } else if (Array.isArray(data)) {
        coursesArray = data;
      } else if (data.courses && Array.isArray(data.courses)) {
        coursesArray = data.courses;
      } else {
        console.warn("Unexpected data format:", data);
        coursesArray = [];
      }

      console.log("Setting courses:", coursesArray);
      setCourses(coursesArray);
      
    } catch (err: any) {
      console.error("Error loading courses:", err);
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (course: Course): number => {
    if (!course.assignments || course.assignments.length === 0) return 0;
    const completed = course.assignments.filter((a) => a.completed).length;
    return (completed / course.assignments.length) * 100;
  };

  const getUpcomingAssignments = (course: Course): number => {
    return course.assignments?.filter((a) => !a.completed).length || 0;
  };

  // Loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="p-6">
          <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center space-y-4 pt-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="text-center">
                  <h3 className="text-lg font-medium">Error Loading Courses</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
                <Button onClick={loadCourses} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
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

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses && courses.length > 0 ? (
            courses.map((course) => {
              const progress = calculateProgress(course);
              const upcomingAssignments = getUpcomingAssignments(course);

              return (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{course.name || 'Untitled Course'}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: course.color || '#3B82F6',
                              color: course.color || '#3B82F6',
                            }}
                          >
                            {course.code || 'N/A'}
                          </Badge>
                          <span>{course.credits || 0} credits</span>
                        </CardDescription>
                      </div>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color || '#3B82F6' }}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {(course.instructor || course.schedule) && (
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {course.instructor && (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {course.instructor}
                            </span>
                          </div>
                        )}
                        {course.schedule && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {course.schedule.split(" ")[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

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
            })
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Get started by adding your first course
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Course
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {courses && courses.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + (course.credits || 0), 0)}
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
                    ? Math.round(
                        courses.reduce((sum, course) => sum + calculateProgress(course), 0) /
                          courses.length
                      )
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
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
                <p className="text-xs text-muted-foreground">Due soon</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursesPage;