import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("DATABASE_URL preview:", process.env.DATABASE_URL?.substring(0, 20) + "...");
    
    // Test connection
    await prisma.$connect();
    console.log("Database connected successfully");
    
    // Test query
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    // Test if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@example.com" }
    });
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      demoUserExists: !!demoUser,
      demoUser: demoUser ? { id: demoUser.id, email: demoUser.email, name: demoUser.name } : null
    });
    
  } catch (error) {
    console.error("Database test failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : null
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}