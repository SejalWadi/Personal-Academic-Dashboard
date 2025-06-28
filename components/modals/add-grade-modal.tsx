"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Award } from "lucide-react";
import { Assignment, Course } from "@/lib/types";

interface AddGradeModalProps {
  assignments: Assignment[];
  courses: Course[];
  onGradeAdded?: () => void;
  trigger?: React.ReactNode;
}

export default function AddGradeModal({ assignments, courses, onGradeAdded, trigger }: AddGradeModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    assignmentId: "",
    courseId: "",
    score: "",
    points: "",
    letterGrade: "",
    feedback: "",
  });

  const handleAssignmentChange = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      setFormData({
        ...formData,
        assignmentId,
        courseId: assignment.courseId,
        points: assignment.points.toString(),
      });
    }
  };

  const calculatePercentage = () => {
    const score = parseFloat(formData.score);
    const points = parseFloat(formData.points);
    if (score && points && points > 0) {
      return Math.round((score / points) * 100);
    }
    return 0;
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const score = parseFloat(formData.score);
      const points = parseFloat(formData.points);

      if (!score || !points || score < 0 || points <= 0) {
        throw new Error("Please enter valid score and points");
      }

      if (score > points) {
        throw new Error("Score cannot be greater than total points");
      }

      const percentage = (score / points) * 100;
      const letterGrade = formData.letterGrade || getLetterGrade(percentage);

      const gradeData = {
        assignmentId: formData.assignmentId,
        courseId: formData.courseId,
        score,
        points,
        letterGrade,
        feedback: formData.feedback || undefined,
      };

      const response = await fetch("/api/grades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add grade");
      }

      // Reset form
      setFormData({
        assignmentId: "",
        courseId: "",
        score: "",
        points: "",
        letterGrade: "",
        feedback: "",
      });

      setOpen(false);
      onGradeAdded?.();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to add grade");
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Grade
    </Button>
  );

  const percentage = calculatePercentage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Add Grade</span>
          </DialogTitle>
          <DialogDescription>
            Add a grade for a completed assignment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignmentId">Assignment *</Label>
            <Select
              value={formData.assignmentId}
              onValueChange={handleAssignmentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    <div className="flex flex-col">
                      <span>{assignment.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {assignment.course?.name} • {assignment.points} points
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score Earned *</Label>
              <Input
                id="score"
                type="number"
                step="0.1"
                min="0"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="85"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Total Points *</Label>
              <Input
                id="points"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                placeholder="100"
                required
              />
            </div>
          </div>

          {percentage > 0 && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Calculated Grade:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">{percentage}%</span>
                  <span className="text-sm font-medium">({getLetterGrade(percentage)})</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="letterGrade">Letter Grade (Optional)</Label>
            <Select
              value={formData.letterGrade}
              onValueChange={(value) => setFormData({ ...formData, letterGrade: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={percentage > 0 ? `Auto: ${getLetterGrade(percentage)}` : "Select grade"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="C+">C+</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="C-">C-</SelectItem>
                <SelectItem value="D+">D+</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="D-">D-</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              placeholder="Great work on the algorithm implementation..."
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.assignmentId || !formData.score || !formData.points}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Grade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}