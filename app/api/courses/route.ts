import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  credits: z.number().min(1).max(6),
  color: z.string().default("#3B82F6"),
  semester: z.string().min(1, "Semester is required"),
  year: z.string().min(1, "Year is required"),
  instructor: z.string().optional(),
  schedule: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    console.log("Courses API: Starting request");
    
    const session = await getServerSession(authOptions);
    console.log("Courses API: Session check", { hasSession: !!session, userId: session?.user?.id });
    
    if (!session?.user?.id) {
      console.log("Courses API: Unauthorized - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test database connection
    try {
      await prisma.$connect();
      console.log("Courses API: Database connected");
    } catch (dbError) {
      console.error("Courses API: Database connection failed:", dbError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const courses = await prisma.course.findMany({
      where: { userId: session.user.id },
      include: {
        assignments: {
          include: {
            grade: true,
          },
        },
        grades: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log("Courses API: Found courses", { count: courses.length });

    // Return courses directly as an array, not wrapped in an object
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Courses API: Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Courses API: Creating course");
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = courseSchema.parse(body);

    const course = await prisma.course.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        assignments: true,
        grades: true,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}