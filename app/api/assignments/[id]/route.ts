import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateAssignmentSchema = z.object({
  completed: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  points: z.number().min(1).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignmentId = params.id;

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignmentId = params.id;

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

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

    // Delete the assignment (this will also delete related grades due to cascade)
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}