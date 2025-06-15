# 🎓 EduTrack – Personal Academic Dashboard

**EduTrack** is a full-stack academic management platform built with modern web technologies. It empowers students to track courses, manage assignments, view grade analytics, and stay on top of their academic goals – all in one responsive dashboard.

<!-- ## 📸 Screenshots

*Screenshots coming soon...* -->

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
- **Database**: MongoDB Atlas (or local SQLite for dev)

## 🏗️ Project Architecture

```
├── app/
│   ├── api/               # Next.js API endpoints
│   ├── dashboard/         # Dashboard UI routes
│   └── auth/              # Auth pages (login/register)
├── components/
│   ├── dashboard/         # Dashboard widgets
│   ├── auth/              # Auth components
│   ├── ui/                # UI elements (shadcn)
│   └── aceternity/        # UI utilities
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── api.ts             # API client helpers
│   └── types.ts           # TypeScript types
├── prisma/
│   ├── schema.prisma      # DB schema
│   └── seed.ts            # DB seeder
└── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas or SQLite (for local development)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
# MongoDB or SQLite
DATABASE_URL="your-db-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
```

### 3. Initialize the Database
```bash
npx prisma generate
npm run db:push
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

## 🛠️ Adding New Features

1. Update Prisma schema in `prisma/schema.prisma`
2. Create relevant API route under `app/api/`
3. Build UI components in `components/`
4. Connect via frontend page in `app/`
5. Add/update types in `lib/types.ts`

## 🌐 Deployment

### Deploy on Vercel
1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add required environment variables
4. Deploy with 1-click

### Other Options
- **Netlify**: Supports Next.js 14+
- **Render / Railway / Heroku**: Add custom MongoDB support

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

Built with ❤️ by **Sejal Wadibhasme**

Special thanks to the open-source community behind:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [NextAuth.js](https://next-auth.js.org/)

---

<!-- *Need this in a downloadable format or a matching deployment guide? Feel free to ask!* -->