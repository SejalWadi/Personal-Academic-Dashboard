import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo Student',
      password: hashedPassword,
      studentId: 'STU001',
      major: 'Computer Science',
      year: 'Junior',
      gpa: 3.7,
    },
  });

  // Create demo courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: 'Web Development',
        code: 'CS 350',
        credits: 3,
        color: '#3B82F6',
        semester: 'Fall',
        year: '2024',
        instructor: 'Dr. Smith',
        schedule: 'MWF 10:00-11:00 AM',
        userId: user.id,
      },
    }),
    prisma.course.create({
      data: {
        name: 'Database Systems',
        code: 'CS 340',
        credits: 3,
        color: '#10B981',
        semester: 'Fall',
        year: '2024',
        instructor: 'Prof. Johnson',
        schedule: 'TTh 2:00-3:30 PM',
        userId: user.id,
      },
    }),
    prisma.course.create({
      data: {
        name: 'Data Structures',
        code: 'CS 260',
        credits: 4,
        color: '#F59E0B',
        semester: 'Fall',
        year: '2024',
        instructor: 'Dr. Williams',
        schedule: 'MWF 1:00-2:00 PM',
        userId: user.id,
      },
    }),
  ]);

  // Create demo assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'React Components Lab',
        description: 'Build a set of reusable React components',
        type: 'assignment',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        points: 100,
        priority: 'high',
        userId: user.id,
        courseId: courses[0].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Database Design Quiz',
        description: 'Quiz on normalization and ER diagrams',
        type: 'quiz',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        points: 50,
        priority: 'medium',
        userId: user.id,
        courseId: courses[1].id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: 'Algorithm Analysis',
        description: 'Analyze time complexity of sorting algorithms',
        type: 'assignment',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        points: 100,
        priority: 'high',
        completed: true,
        userId: user.id,
        courseId: courses[2].id,
      },
    }),
  ]);

  // Create demo grades
  await prisma.grade.create({
    data: {
      score: 95,
      points: 100,
      percentage: 95,
      letterGrade: 'A',
      feedback: 'Excellent work on the algorithm implementation',
      userId: user.id,
      courseId: courses[2].id,
      assignmentId: assignments[2].id,
    },
  });

  // Create demo goals
  await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Maintain 3.8 GPA',
        description: 'Keep GPA above 3.8 for Dean\'s List',
        category: 'academic',
        targetDate: new Date('2024-12-15'),
        priority: 'high',
        progress: 75,
        userId: user.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Complete Internship Application',
        description: 'Apply to at least 5 tech companies for summer internship',
        category: 'career',
        targetDate: new Date('2024-02-01'),
        priority: 'high',
        progress: 40,
        userId: user.id,
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });