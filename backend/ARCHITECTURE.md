# SnapLink Backend - Architecture Overview

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # Handle HTTP requests and responses
│   │   ├── auth.controller.js
│   │   └── url.controller.js
│   ├── services/             # Business logic layer
│   │   ├── auth.service.js
│   │   └── url.service.js
│   ├── middleware/           # Express middleware
│   │   └── auth.middleware.js
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.js
│   │   ├── url.routes.js
│   │   ├── redirect.routes.js
│   │   └── health.routes.js
│   ├── database/            # Database configuration
│   │   └── db.js
│   └── utils/               # Utility functions
│       ├── constants.js
│       ├── logger.js
│       ├── responseHelper.js
│       ├── validation.js
│       └── shortCodeGenerator.js
├── app.js                   # Express app configuration
├── server.js               # Server entry point
└── package.json
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Controllers**: Handle HTTP requests, validate input, delegate to services
- **Services**: Contain business logic, database operations, core functionality
- **Utils**: Reusable helper functions and utilities

### 2. **Layered Architecture**
```
Request Flow:
Client → Routes → Middleware → Controllers → Services → Database
Response Flow:
Database → Services → Controllers → Middleware → Client
```

### 3. **Clean Code Practices**
- ✅ Meaningful variable and function names
- ✅ Comprehensive JSDoc comments
- ✅ Consistent error handling
- ✅ Promise-based async/await patterns
- ✅ Input validation and sanitization
- ✅ Centralized configuration

## 📚 Key Components

### Controllers
**Purpose**: Handle HTTP requests and responses
- Validate request data
- Call appropriate services
- Format and send responses
- Handle errors gracefully

**Example**:
```javascript
const authController = {
  register: async (req, res) => {
    // Validate input
    // Call auth service
    // Send response
  }
};
```

### Services
**Purpose**: Contain business logic
- Database operations
- Complex computations
- Third-party integrations
- Core application logic

**Example**:
```javascript
const authService = {
  registerUser: async (email, password, name) => {
    // Check if user exists
    // Hash password
    // Create user in DB
    // Generate token
    return userData;
  }
};
```

### Utils
**Purpose**: Reusable helper functions

#### constants.js
- Application-wide configuration
- Environment variables
- Magic numbers centralization

#### logger.js
- Structured logging
- Development and production modes
- Error tracking

#### responseHelper.js
- Standardized API responses
- Success and error responses
- Consistent response format

#### validation.js
- Input validation
- Email, password, URL validation
- Required fields checking

#### shortCodeGenerator.js
- Generate unique short codes
- Collision detection
- Configurable length and characters

## 🔐 Security Best Practices

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure authentication with configurable expiry
3. **Input Validation**: All user inputs validated and sanitized
4. **SQL Injection Prevention**: Parameterized queries
5. **Error Messages**: Generic messages to prevent information leakage

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### URLs Table
```sql
CREATE TABLE urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "limitReached": false  // Optional field
}
```

## 🛠️ Configuration

Environment variables (`.env` file):
```env
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BASE_URL=http://localhost:3000
NODE_ENV=development
```

## 📝 Code Style Guidelines

1. **Naming Conventions**:
   - camelCase for variables and functions
   - PascalCase for classes
   - UPPER_SNAKE_CASE for constants

2. **Comments**:
   - JSDoc comments for all functions
   - Inline comments for complex logic
   - Section headers for file organization

3. **Error Handling**:
   - Always use try-catch in async functions
   - Custom error objects with statusCode
   - Centralized error handling

4. **Async/Await**:
   - Prefer async/await over callbacks
   - Promisify callback-based functions
   - Handle promise rejections

## 🧪 Testing Considerations

Future testing structure:
```
tests/
├── unit/
│   ├── services/
│   └── utils/
└── integration/
    └── controllers/
```

## 📈 Future Improvements

- [ ] Add request rate limiting
- [ ] Implement caching (Redis)
- [ ] Add comprehensive logging system (Winston/Bunyan)
- [ ] Database migrations tool
- [ ] API versioning
- [ ] Unit and integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Performance monitoring
- [ ] Custom URL aliases
- [ ] Analytics dashboard data

## 🤝 Contributing

When adding new features:
1. Create service functions for business logic
2. Keep controllers thin (validation + service calls)
3. Add proper error handling
4. Document with JSDoc comments
5. Follow existing code patterns
6. Use centralized utilities

## 📄 License

MIT
