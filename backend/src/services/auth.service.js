/**
 * Auth Service
 * Handles all authentication-related business logic
 * Separates business logic from controller layer for better maintainability
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

// Configuration constants
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = 10;

/**
 * Promisified database query helper
 * Converts callback-based DB operations to promises for async/await
 */
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
};

const dbRun = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (error) {
      if (error) reject(error);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

/**
 * Generate JWT token for authenticated user
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT token
 */
const generateAuthToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Hash password using bcrypt
 * @param {string} plainPassword - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const authService = {
  /**
   * Register a new user
   * @param {string} email - User email address
   * @param {string} password - User password
   * @param {string|null} name - Optional user name
   * @returns {Promise<Object>} User data and authentication token
   * @throws {Error} If email already exists or registration fails
   */
  registerUser: async (email, password, name = null) => {
    // Check if user already exists
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user in database
    const insertQuery = 'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, datetime("now"))';
    const result = await dbRun(insertQuery, [email, hashedPassword, name]);

    // Generate authentication token
    const token = generateAuthToken({ 
      userId: result.lastID, 
      email 
    });

    return {
      token,
      user: {
        id: result.lastID,
        email,
        name
      }
    };
  },

  /**
   * Authenticate user and generate login token
   * @param {string} email - User email address
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and authentication token
   * @throws {Error} If credentials are invalid
   */
  loginUser: async (email, password) => {
    // Find user by email
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate authentication token
    const token = generateAuthToken({ 
      userId: user.id, 
      email: user.email 
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  },

  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User profile data
   * @throws {Error} If user not found
   */
  getUserProfile: async (userId) => {
    const user = await dbGet(
      'SELECT id, email, name, created_at FROM users WHERE id = ?', 
      [userId]
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  /**
   * Verify and decode JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or expired
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      const err = new Error('Invalid or expired token');
      err.statusCode = 401;
      throw err;
    }
  }
};

module.exports = authService;
