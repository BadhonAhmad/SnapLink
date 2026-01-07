# SnapLink - URL Shortener

A modern, full-stack URL shortening web application with user authentication, analytics, and usage tracking. Built with Node.js, Express, Next.js, and SQLite.

## 🎥 Demo Video

Watch the project demo: [SnapLink Demo on YouTube](https://youtu.be/mdbHcTmcLIY)

## 📋 Table of Contents
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git

### Clone the Repository

```bash
git clone https://github.com/BadhonAhmad/SnapLink.git
cd SnapLink
```

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
DATABASE_PATH=./database.sqlite
```

4. Start the backend server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

---

## 📂 Project Structure

```
SnapLink/
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   └── url.controller.js
│   │   ├── services/            # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── url.service.js
│   │   │   └── index.js
│   │   ├── routes/              # API route definitions
│   │   │   ├── auth.routes.js
│   │   │   ├── url.routes.js
│   │   │   ├── redirect.routes.js
│   │   │   └── health.routes.js
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.middleware.js
│   │   ├── database/            # Database configuration
│   │   │   └── db.js
│   │   ├── utils/               # Helper functions
│   │   │   ├── constants.js
│   │   │   ├── logger.js
│   │   │   ├── responseHelper.js
│   │   │   ├── shortCodeGenerator.js
│   │   │   ├── validation.js
│   │   │   └── index.js
│   │   ├── app.js               # Express app configuration
│   │   └── server.js            # Server entry point
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── ARCHITECTURE.md          # Backend architecture documentation
│   └── README.md
│
├── frontend/                    # Next.js TypeScript app
│   ├── app/
│   │   ├── [shortCode]/         # Dynamic route for URL redirect
│   │   │   └── page.tsx
│   │   ├── dashboard/           # User dashboard
│   │   │   └── page.tsx
│   │   ├── login/               # Login page
│   │   │   └── page.tsx
│   │   ├── register/            # Registration page
│   │   │   └── page.tsx
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable React components
│   │   ├── Alert.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── StatsCard.tsx
│   │   └── index.ts
│   ├── services/                # API service functions
│   │   ├── authService.ts
│   │   └── urlService.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── useAuth.ts
│   ├── utils/                   # Helper utilities
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── postcss.config.js
│   ├── next-env.d.ts
│   └── README.md
│
└── README.md                    # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication
Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Endpoints

#### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "SnapLink API is running",
  "timestamp": "2026-01-06T10:30:00.000Z",
  "environment": "development"
}
```

---

#### Authentication Endpoints

##### 1. Register User

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-06T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Email: Valid email format required
- Password: Minimum 8 characters, must contain uppercase, lowercase, number, and special character
- Name: Optional

---

##### 2. Login User

**POST** `/api/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

##### 3. Get Current User

**GET** `/api/auth/me`

Get authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-06T10:30:00.000Z"
    }
  }
}
```

---

#### URL Endpoints

##### 4. Create Short URL

**POST** `/api/urls`

Create a new shortened URL.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "originalUrl": "https://www.example.com/very/long/url/path"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "id": 1,
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:5000/abc123",
    "clicks": 0,
    "createdAt": "2026-01-06T10:30:00.000Z",
    "userId": 1
  }
}
```

**Validation:**
- Original URL must include `http://` or `https://`
- User must be authenticated

---

##### 5. Get User URLs

**GET** `/api/urls`

Get all shortened URLs for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "urls": [
      {
        "id": 1,
        "originalUrl": "https://www.example.com/path1",
        "shortCode": "abc123",
        "shortUrl": "http://localhost:5000/abc123",
        "clicks": 42,
        "createdAt": "2026-01-06T10:30:00.000Z"
      },
      {
        "id": 2,
        "originalUrl": "https://www.example.com/path2",
        "shortCode": "xyz789",
        "shortUrl": "http://localhost:5000/xyz789",
        "clicks": 15,
        "createdAt": "2026-01-06T11:00:00.000Z"
      }
    ],
    "count": 2,
    "stats": {
      "totalUrls": 2,
      "totalClicks": 57
    }
  }
}
```

---

##### 6. Delete URL

**DELETE** `/api/urls/:id`

Delete a shortened URL by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path parameter): The URL ID to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "URL deleted successfully",
  "data": null
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "URL not found or you don't have permission to delete it"
}
```

---

##### 7. Redirect Short URL

**GET** `/:shortCode`

Redirect to the original URL using the short code.

**Parameters:**
- `shortCode` (path parameter): The short code of the URL

**Response:**
- Redirects to the original URL (302 Found)
- Increments click counter

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Short URL not found"
}
```

**Example:**
```
http://localhost:5000/abc123 → https://www.example.com/very/long/url/path
```

---

### Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🏗️ Design Decisions

### Architecture

#### Layered Architecture
The backend follows a clean, layered architecture pattern:

1. **Routes Layer**: Defines API endpoints and applies middleware
2. **Middleware Layer**: Handles authentication, validation, and request processing
3. **Controllers Layer**: Handles HTTP requests/responses and input validation
4. **Services Layer**: Contains business logic and database operations
5. **Utils Layer**: Provides reusable helper functions and utilities

**Benefits:**
- Clear separation of concerns
- Improved testability
- Easier maintenance and scalability
- Consistent error handling

#### Request Flow
```
Client → Routes → Middleware → Controllers → Services → Database
                                                    ↓
Client ← Response Helpers ← Controllers ← Services
```

---

### Technology Choices

#### Backend: Node.js + Express
**Rationale:**
- Lightweight and fast for API services
- Large ecosystem of packages
- Easy to learn and develop quickly
- Perfect for I/O-heavy operations like URL redirection

#### Database: SQLite
**Rationale:**
- Zero configuration required
- File-based, easy deployment
- Sufficient for small to medium traffic
- ACID compliant
- Can migrate to PostgreSQL/MySQL if needed

**Trade-offs:**
- Limited concurrent writes (acceptable for this use case)
- Not ideal for distributed systems
- Good enough for MVP and single-server deployments

#### Frontend: Next.js 14 + TypeScript
**Rationale:**
- Server-side rendering for better SEO
- App Router for modern routing patterns
- TypeScript for type safety
- React for component reusability
- Excellent developer experience

---

### Security Measures

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Strong password requirements enforced
   - Never stored in plain text

2. **Authentication**
   - JWT-based authentication
   - Tokens expire after a set period
   - Protected routes require valid tokens

3. **Input Validation**
   - All user inputs sanitized
   - URL validation before shortening
   - Email format validation
   - SQL injection prevention through parameterized queries

4. **CORS Configuration**
   - Controlled cross-origin access
   - Configurable allowed origins

---

### Code Quality Practices

1. **Comprehensive Comments**
   - JSDoc comments for all functions
   - Clear parameter and return type documentation
   - Usage examples where helpful

2. **Error Handling**
   - Centralized error handling
   - Consistent error response format
   - Meaningful error messages

3. **Logging**
   - Request/response logging
   - Error logging for debugging
   - Environment-based log levels

4. **Validation**
   - Input validation at controller level
   - Business logic validation in services
   - Type checking with TypeScript (frontend)

---

### Scalability Considerations

#### Current Implementation
- Single server deployment
- File-based SQLite database
- Synchronous URL generation

#### Future Improvements
1. **Database Migration**
   - Move to PostgreSQL for better concurrency
   - Implement connection pooling
   - Add database replication

2. **Caching Layer**
   - Redis for frequently accessed URLs
   - Reduce database load
   - Faster redirects

3. **Rate Limiting**
   - Prevent abuse
   - Per-user and per-IP limits

4. **Analytics Enhancement**
   - Track geolocation
   - Device and browser information
   - Referrer tracking

5. **Custom Short Codes**
   - Allow users to choose custom codes
   - Validate uniqueness

6. **Link Expiration**
   - Time-based URL expiration
   - Automatic cleanup of expired links

---

### Short Code Generation

**Strategy:** Random alphanumeric generation
- Character set: `a-z`, `A-Z`, `0-9` (62 characters)
- Default length: 6 characters
- Total possibilities: 62^6 = ~56.8 billion combinations
- Collision handling: Regenerate on conflict

**Why this approach:**
- Simple and fast
- Sufficient uniqueness for most use cases
- No sequential patterns (better for privacy)
- URL-safe characters only

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv
- **Middleware**: CORS, express.json

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: React 18

---

## 🎯 Features

- ✅ User authentication (register/login)
- ✅ JWT-based session management
- ✅ URL shortening with random code generation
- ✅ URL redirection with click tracking
- ✅ User dashboard with statistics
- ✅ CRUD operations for URLs
- ✅ Responsive design
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ Security best practices

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Developed as a full-stack URL shortener project.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.
