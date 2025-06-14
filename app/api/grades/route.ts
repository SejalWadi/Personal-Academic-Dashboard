import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const gradeSchema = z.object({
  score: z.number().min(0),
  points: z.number().min(1).default(100),
  letterGrade: z.string().optional(),
  feedback: z.string().optional(),
  assignmentId: z.string().min(1, "Assignment ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    let whereClause: any = { userId: session.user.id };
    
    if (courseId) {
      whereClause.courseId = courseId;
    }

    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        course: true,
        assignment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ grades });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = gradeSchema.parse(body);

    // Calculate percentage
    const percentage = (validatedData.score / validatedData.points) * 100;

    // Verify the assignment and course belong to the user
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: validatedData.assignmentId,
        userId: session.user.id,
        courseId: validatedData.courseId,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found or unauthorized" },
        { status: 404 }
      );
    }

    const grade = await prisma.grade.create({
      data: {
        ...validatedData,
        percentage,
        userId: session.user.id,
      },
      include: {
        course: true,
        assignment: true,
      },
    });

    return NextResponse.json({ grade }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating grade:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}