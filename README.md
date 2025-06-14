# EduTrack - Personal Academic Dashboard

A comprehensive full-stack Next.js application for managing academic life, built with modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env.local` file in the root directory:
```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 3. Set up Database
```bash
# Generate Prisma client
npx prisma generate

# Create and migrate database
npm run db:push

# Seed database with demo data
npm run db:seed
```

### 4. Run the Application
```bash
# Start development server (runs both frontend and backend)
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🔐 Demo Login
- **Email**: `demo@example.com`
- **Password**: `demo123`

## 📁 Project Architecture

This is a **full-stack Next.js application** where:
- **Frontend**: React components with Tailwind CSS and shadcn/ui
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (easily switchable to PostgreSQL/MySQL)
- **Authentication**: NextAuth.js with credentials provider

### Frontend & Backend Integration
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (React)       │───▶│   (Next.js)     │───▶│   (SQLite)      │
│                 │    │                 │    │                 │
│ - Components    │    │ - /api/courses  │    │ - Users         │
│ - Pages         │    │ - /api/assignments│  │ - Courses       │
│ - Hooks         │    │ - /api/auth     │    │ - Assignments   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with demo data
```

## 📊 Features

### ✅ Implemented Features
- **User Authentication**: Registration, login, session management
- **Course Management**: Add, view, and track courses
- **Assignment Tracking**: Create, manage, and complete assignments
- **Dashboard Analytics**: Real-time statistics and progress tracking
- **Calendar View**: Visual assignment deadlines
- **Grade Management**: Track and analyze academic performance
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🔄 API Endpoints
- `GET/POST /api/courses` - Course management
- `GET/POST/PATCH /api/assignments` - Assignment operations
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET/POST /api/grades` - Grade management
- `POST /api/register` - User registration
- `/api/auth/[...nextauth]` - Authentication endpoints

## 🏗 File Structure

```
├── app/
│   ├── api/                 # Backend API routes
│   │   ├── auth/           # Authentication
│   │   ├── courses/        # Course management
│   │   ├── assignments/    # Assignment management
│   │   ├── grades/         # Grade management
│   │   └── dashboard/      # Dashboard stats
│   ├── dashboard/          # Dashboard pages
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   ├── auth/             # Authentication components
│   └── aceternity/       # Aceternity UI components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database client
│   ├── api.ts            # API utility functions
│   └── types.ts          # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
└── package.json
```

## 🔧 Development Workflow

### Adding New Features
1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Create new routes in `app/api/`
3. **Frontend Components**: Add components in `components/`
4. **Pages**: Create pages in `app/`
5. **Types**: Update `lib/types.ts`

### Switching from Mock to Real Data
Replace mock data calls in components:
```typescript
// Before (Mock Data)
const loadAssignments = async () => {
  const mockAssignments = [...];
  setAssignments(mockAssignments);
};

// After (Real API)
const loadAssignments = async () => {
  try {
    const { assignments } = await assignmentApi.getAll(filter);
    setAssignments(assignments);
  } catch (error) {
    console.error('Failed to load assignments:', error);
  }
};
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings
- **Railway**: Add PostgreSQL database
- **Heroku**: Use PostgreSQL add-on

## 🔒 Security Features
- Password hashing with bcryptjs
- Session-based authentication
- Input validation with Zod
- User authorization checks
- CSRF protection

## 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🎨 UI/UX Features
- Modern design with shadcn/ui
- Smooth animations with Framer Motion
- Interactive charts with Recharts
- Beautiful gradients and effects
- Dark/light mode support (configurable)

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
MIT License - feel free to use this project for learning and development.