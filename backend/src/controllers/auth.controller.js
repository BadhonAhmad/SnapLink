const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if user already exists
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (user) {
          return res.status(400).json({
            success: false,
            message: 'User already exists'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const query = 'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, datetime("now"))';
        
        db.run(query, [email, hashedPassword, name || null], function(err) {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error creating user'
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
          );

          res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
              token,
              user: {
                id: this.lastID,
                email,
                name: name || null
              }
            }
          });
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get current user
  getCurrentUser: (req, res) => {
    try {
      const userId = req.user.userId;

      db.get('SELECT id, email, name, created_at FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.json({
          success: true,
          data: { user }
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = authController;
