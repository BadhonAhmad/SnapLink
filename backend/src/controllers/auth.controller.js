/**
 * Auth Controller
 * Handles HTTP requests for authentication
 * Delegates business logic to auth service
 */

const authService = require('../services/auth.service');
const { sendSuccess, handleServiceError } = require('../utils/responseHelper');
const { isValidEmail, validatePassword, sanitizeString } = require('../utils/validation');

const authController = {
  /**
   * Register a new user
   * POST /api/auth/register
   * Body: { email, password, name? }
   */
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Validate required fields
      if (!email || !password) {
        return handleServiceError(
          res, 
          { message: 'Email and password are required', statusCode: 400 }
        );
      }

      // Validate email format
      if (!isValidEmail(email)) {
        return handleServiceError(
          res,
          { message: 'Please provide a valid email address', statusCode: 400 }
        );
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return handleServiceError(
          res,
          { message: passwordValidation.message, statusCode: 400 }
        );
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeString(email).toLowerCase();
      const sanitizedName = name ? sanitizeString(name) : null;

      // Call service to register user
      const userData = await authService.registerUser(
        sanitizedEmail, 
        password, 
        sanitizedName
      );

      return sendSuccess(
        res,
        userData,
        'User registered successfully',
        201
      );
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  /**
   * Login existing user
   * POST /api/auth/login
   * Body: { email, password }
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return handleServiceError(
          res,
          { message: 'Email and password are required', statusCode: 400 }
        );
      }

      // Validate email format
      if (!isValidEmail(email)) {
        return handleServiceError(
          res,
          { message: 'Please provide a valid email address', statusCode: 400 }
        );
      }

      // Sanitize email
      const sanitizedEmail = sanitizeString(email).toLowerCase();

      // Call service to authenticate user
      const userData = await authService.loginUser(sanitizedEmail, password);

      return sendSuccess(res, userData, 'Login successful');
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  /**
   * Get current authenticated user profile
   * GET /api/auth/me
   * Requires authentication
   */
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.userId;

      // Call service to get user profile
      const userProfile = await authService.getUserProfile(userId);

      return sendSuccess(res, { user: userProfile });
    } catch (error) {
      return handleServiceError(res, error);
    }
  }
};

module.exports = authController;
