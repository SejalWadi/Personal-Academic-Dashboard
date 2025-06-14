"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Course } from "@/lib/types";

interface CourseProgressProps {
  courses: Course[];
}

export default function CourseProgress({ courses }: CourseProgressProps) {
  const calculateProgress = (course: Course) => {
    if (!course.assignments) return 0;
    const completed = course.assignments.filter(a => a.completed).length;
    return course.assignments.length > 0 ? (completed / course.assignments.length) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {courses.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No courses found
          </p>
        ) : (
          courses.map((course) => {
            const progress = calculateProgress(course);
            return (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.code} • {course.credits} credits
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{progress.toFixed(0)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {course.assignments?.filter(a => a.completed).length || 0}/{course.assignments?.length || 0} assignments
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}