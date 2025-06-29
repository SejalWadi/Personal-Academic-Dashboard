export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  studentId?: string;
  major?: string;
  year?: string;
  gpa?: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  color: string;
  semester: string;
  year: string;
  instructor?: string;
  schedule?: string;
  assignments?: Assignment[];
  grades?: Grade[];
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: string;
  dueDate: Date;
  points: number;
  completed: boolean;
  priority: string;
  courseId: string;
  course?: Course;
  grade?: Grade;
}

export interface Grade {
  id: string;
  score: number;
  points: number;
  percentage: number;
  letterGrade?: string;
  feedback?: string;
  assignmentId: string;
  courseId: string;
  course?: Course;
  assignment?: Assignment;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetDate?: Date;
  completed: boolean;
  priority: string;
  progress: number;
}

export interface DashboardStats {
  totalCourses: number;
  totalAssignments: number;
  completedAssignments: number;
  averageGrade: number;
  upcomingDeadlines: number;
}