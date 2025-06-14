import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get dashboard statistics
    const [
      totalCourses,
      totalAssignments,
      completedAssignments,
      grades,
      upcomingAssignments
    ] = await Promise.all([
      // Total courses
      prisma.course.count({
        where: { userId: session.user.id }
      }),
      
      // Total assignments
      prisma.assignment.count({
        where: { userId: session.user.id }
      }),
      
      // Completed assignments
      prisma.assignment.count({
        where: { 
          userId: session.user.id,
          completed: true 
        }
      }),
      
      // All grades for average calculation
      prisma.grade.findMany({
        where: { userId: session.user.id },
        select: { percentage: true }
      }),
      
      // Upcoming assignments (due within 7 days)
      prisma.assignment.count({
        where: {
          userId: session.user.id,
          completed: false,
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate average grade
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length
      : 0;

    const stats = {
      totalCourses,
      totalAssignments,
      completedAssignments,
      averageGrade: Math.round(averageGrade * 10) / 10, // Round to 1 decimal
      upcomingDeadlines: upcomingAssignments,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}