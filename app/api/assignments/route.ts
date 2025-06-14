import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const assignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required"),
  description: z.string().optional(),
  type: z.enum(["assignment", "quiz", "exam", "project"]),
  dueDate: z.string().transform((str) => new Date(str)),
  points: z.number().min(1).default(100),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  courseId: z.string().min(1, "Course ID is required"),
});

const updateAssignmentSchema = z.object({
  completed: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  points: z.number().min(1).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'all', 'pending', 'completed'
    const courseId = searchParams.get('courseId');

    let whereClause: any = { userId: session.user.id };

    if (filter === 'pending') {
      whereClause.completed = false;
    } else if (filter === 'completed') {
      whereClause.completed = true;
    }

    if (courseId) {
      whereClause.courseId = courseId;
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        course: true,
        grade: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
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
    const validatedData = assignmentSchema.parse(body);

    // Verify the course belongs to the user
    const course = await prisma.course.findFirst({
      where: {
        id: validatedData.courseId,
        userId: session.user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or unauthorized" },
        { status: 404 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        course: true,
        grade: true,
      },
    });

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('id');

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateAssignmentSchema.parse(body);

    // Verify the assignment belongs to the user
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        userId: session.user.id,
      },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: "Assignment not found or unauthorized" },
        { status: 404 }
      );
    }

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: validatedData,
      include: {
        course: true,
        grade: true,
      },
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error updating assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}