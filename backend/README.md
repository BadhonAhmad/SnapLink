# SnapLink Backend

URL Shortener Backend API built with Node.js and Express.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Environment**: dotenv

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health` - Check API status

## Project Structure
```
backend/
├── src/
│   ├── routes/         # API routes
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── database/       # Database configuration
│   ├── utils/          # Helper functions
│   ├── app.js          # Express configuration
│   └── server.js       # Server entry point
├── .env                # Environment variables
└── package.json
```
