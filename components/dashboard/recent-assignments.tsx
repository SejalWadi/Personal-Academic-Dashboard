"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Assignment } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface RecentAssignmentsProps {
  assignments: Assignment[];
  onToggleComplete?: (assignmentId: string) => void;
}

export default function RecentAssignments({ assignments, onToggleComplete }: RecentAssignmentsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (assignment: Assignment) => {
    if (assignment.completed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const isOverdue = dueDate < now;
    
    return isOverdue ? (
      <AlertCircle className="h-4 w-4 text-red-600" />
    ) : (
      <Clock className="h-4 w-4 text-orange-600" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assignments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assignments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No assignments found
          </p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(assignment)}
                <div>
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {assignment.course?.name} • Due {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(assignment.priority)}>
                  {assignment.priority}
                </Badge>
                {onToggleComplete && (
                  <Button 
                    size="sm" 
                    variant={assignment.completed ? "default" : "outline"}
                    onClick={() => onToggleComplete(assignment.id)}
                  >
                    {assignment.completed ? "Completed" : "Mark Complete"}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}