# SnapLink - URL Shortener

A modern URL shortening web application with user authentication, analytics, and usage tracking.

## 🚀 Project Overview

**SnapLink** is a full-stack URL shortener application that allows users to create short, memorable links from long URLs. It includes user authentication, click tracking, analytics dashboard, and usage limits.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Environment Management**: dotenv
- **Middleware**: CORS, express.json

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: React 18

## 📂 Project Structure

```
SnapLink/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── database/       # Database configuration
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── .env                # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
├── frontend/               # Next.js TypeScript app
│   ├── app/
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   ├── dashboard/     # User dashboard
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/        # Reusable React components
│   ├── services/          # API service functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper utilities
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── README.md
│
└── PROJECT_OVERVIEW.md    # This file
```

## 🎯 Features (Planned)

### Phase 0 - Project Setup ✅
- [x] Backend project initialization
- [x] Frontend project initialization
- [x] Folder structure creation
- [x] Basic health check endpoint

### Phase 1 - Core Functionality (Next)
- [ ] User authentication (register/login)
- [ ] URL shortening logic
- [ ] URL redirection
- [ ] SQLite database schema
- [ ] Basic CRUD operations

### Phase 2 - Advanced Features
- [ ] Click tracking and analytics
- [ ] User dashboard with statistics
- [ ] Custom short codes
- [ ] Link expiration
- [ ] Usage limits per user

### Phase 3 - Polish
- [ ] Error handling
- [ ] Input validation
- [ ] Rate limiting
- [ ] Security enhancements
- [ ] Performance optimization

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📋 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./src/database/snaplink.db
```

## 🔗 API Endpoints

### Current Endpoints
- **GET** `/health` - Health check endpoint

### Planned Endpoints
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/urls` - Create short URL
- **GET** `/api/urls` - Get user's URLs
- **GET** `/api/urls/:id` - Get URL details
- **DELETE** `/api/urls/:id` - Delete URL
- **GET** `/:shortCode` - Redirect to original URL

## 📝 Development Status

**Current Phase**: Phase 0 - Project Setup ✅

**Next Steps**:
1. Implement user authentication
2. Create database schema
3. Implement URL shortening logic
4. Build authentication UI

## 👨‍💻 Development Guidelines

### Code Style
- Use meaningful variable and function names
- Follow consistent indentation (2 spaces)
- Add comments for complex logic
- Use TypeScript types in frontend

### Git Workflow
- Create feature branches
- Write descriptive commit messages
- Test before committing

### Security
- Never commit .env files
- Use environment variables for sensitive data
- Implement input validation
- Use parameterized queries

## 📄 License

ISC

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

---

**Last Updated**: January 4, 2026
**Status**: In Development
