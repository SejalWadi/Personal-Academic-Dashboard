# 🎓 EduTrack – Personal Academic Dashboard

**EduTrack** is a full-stack academic management platform built with modern web technologies. It empowers students to track courses, manage assignments, view grade analytics, and stay on top of their academic goals – all in one responsive dashboard.

## ✨ Features

### 📚 Academic Management
- **Course Tracker**: Add, edit, and view academic courses
- **Assignment Dashboard**: Track, manage, and complete upcoming assignments
- **Grade Tracker**: Input grades and compare with class averages
- **Calendar View**: Visualize assignment deadlines by date

### 🔐 User Authentication
- Secure login and registration with NextAuth.js
- JWT-based sessions and password hashing via bcryptjs

### 📊 Real-Time Analytics
- Dynamic dashboards showing performance metrics
- Progress bars for assignment completion
- Grade trends with Recharts

### 🎨 Responsive & Modern UI
- Tailwind CSS + Shadcn/UI for clean, responsive layouts
- Smooth animations via Framer Motion
- Supports dark and light themes

## ⚙️ Tech Stack

### Frontend
- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS, shadcn/ui, Aceternity UI
- **State Management**: React Hooks, useSession from NextAuth
- **Charts**: Recharts

### Backend
- **Framework**: Next.js API routes
- **ORM**: Prisma ORM
- **Authentication**: NextAuth.js (credentials provider)
- **Database**: PostgreSQL (production) / SQLite (development)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (for production) or SQLite (for development)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
# Database - Use PostgreSQL for production
DATABASE_URL="postgresql://username:password@localhost:5432/edutrack"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

### 3. Initialize the Database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start the Dev Server
```bash
npm run dev
```

Your app is running at: **http://localhost:3000**

## 🧪 Demo Login
- **Email**: demo@example.com
- **Password**: demo123

## 🌐 Deployment on Vercel

### 1. Database Setup
You'll need a PostgreSQL database. Recommended providers:
- **Neon** (free tier available): https://neon.tech
- **Supabase** (free tier available): https://supabase.com
- **PlanetScale** (free tier available): https://planetscale.com
- **Railway** (free tier available): https://railway.app

### 2. Environment Variables in Vercel
Add these environment variables in your Vercel dashboard:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

**Important**: Generate a strong secret for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Deploy
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the environment variables
4. Deploy

The build process will automatically:
- Generate Prisma client
- Push database schema
- Build the application

### 4. Seed the Database (Optional)
After deployment, you can seed the database by running:
```bash
npm run db:seed
```

## 🔄 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Fetch all courses |
| POST | `/api/courses` | Create a course |
| GET | `/api/assignments` | List assignments |
| POST | `/api/assignments` | Create new assignment |
| PATCH | `/api/assignments/:id` | Update assignment |
| GET | `/api/grades` | Get user & class grades |
| POST | `/api/grades` | Add a new grade |
| POST | `/api/register` | Register a new user |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth session API |

## 🧑‍💻 Development Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed demo data
```

## 🔐 Security Highlights

- 🔒 Password hashing with bcrypt
- ✅ Form validation using Zod
- 🔑 JWT session management with NextAuth
- 🚫 CSRF & session tampering protection

## 🛠️ Troubleshooting

### Database Connection Issues
If you're getting database connection errors:

1. **Check your DATABASE_URL**: Ensure it's correctly formatted
2. **Verify database accessibility**: Make sure your database allows connections from Vercel
3. **Check environment variables**: Ensure they're set correctly in Vercel dashboard

### Build Issues
If the build fails:

1. **Check Prisma schema**: Ensure it's valid
2. **Verify environment variables**: Make sure DATABASE_URL is set during build
3. **Check logs**: Review Vercel build logs for specific errors

## 🗺️ Roadmap

- [ ] 📅 Assignment Reminders
- [ ] 📱 Mobile PWA Support
- [ ] 📈 Weekly Study Stats & Trends
- [ ] 🧠 AI Assistant for Study Suggestions
- [ ] 📬 Email Notifications for Due Dates
- [ ] 🔎 Search & Filter Across Courses

## 🤝 Contributing

1. Fork the repo
2. Create a new feature branch
3. Commit & push your changes
4. Submit a Pull Request

Please ensure tests pass and follow ESLint + Prettier formatting guidelines.

## 📄 License

MIT License — Free to use for personal, educational, and commercial use.

## 🙌 Credits

Built with ❤️ by **Your Name**

Special thanks to the open-source community behind:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [NextAuth.js](https://next-auth.js.org/)

---