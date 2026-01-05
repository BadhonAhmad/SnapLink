/**
 * URL Controller
 * Handles HTTP requests for URL shortening operations
 * Delegates business logic to URL service
 */

const urlService = require('../services/url.service');
const { sendSuccess, handleServiceError } = require('../utils/responseHelper');
const { isValidUrl, sanitizeString } = require('../utils/validation');

const urlController = {
  /**
   * Create a new shortened URL
   * POST /api/urls
   * Body: { originalUrl }
   * Requires authentication
   */
  createUrl: async (req, res) => {
    try {
      const { originalUrl } = req.body;
      const userId = req.user.userId;

      // Validate required field
      if (!originalUrl) {
        return handleServiceError(
          res,
          { message: 'Original URL is required', statusCode: 400 }
        );
      }

      // Validate URL format
      if (!isValidUrl(originalUrl)) {
        return handleServiceError(
          res,
          { message: 'Please provide a valid URL (must include http:// or https://)', statusCode: 400 }
        );
      }

      // Sanitize URL
      const sanitizedUrl = sanitizeString(originalUrl);

      // Call service to create short URL
      const shortUrlData = await urlService.createShortUrl(sanitizedUrl, userId);

      return sendSuccess(
        res,
        shortUrlData,
        'Short URL created successfully',
        201
      );
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  /**
   * Get all URLs for authenticated user
   * GET /api/urls
   * Requires authentication
   */
  getUserUrls: async (req, res) => {
    try {
      const userId = req.user.userId;

      // Call service to get user's URLs
      const urlData = await urlService.getUserUrls(userId);

      return sendSuccess(res, urlData);
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  /**
   * Delete a URL by ID
   * DELETE /api/urls/:id
   * Requires authentication
   */
  deleteUrl: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Validate ID parameter
      const urlId = parseInt(id, 10);
      if (isNaN(urlId)) {
        return handleServiceError(
          res,
          { message: 'Invalid URL ID', statusCode: 400 }
        );
      }

      // Call service to delete URL
      await urlService.deleteUrl(urlId, userId);

      return sendSuccess(res, null, 'URL deleted successfully');
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  /**
   * Redirect to original URL by short code
   * GET /:shortCode
   * Public endpoint - no authentication required
   */
  redirectUrl: async (req, res) => {
    try {
      const { shortCode } = req.params;

      // Validate short code parameter
      if (!shortCode || shortCode.trim() === '') {
        return handleServiceError(
          res,
          { message: 'Short code is required', statusCode: 400 }
        );
      }

      // Call service to get original URL and track click
      const originalUrl = await urlService.getOriginalUrlByShortCode(shortCode);

      // Redirect to original URL
      return res.redirect(originalUrl);
    } catch (error) {
      return handleServiceError(res, error);
    }
  }
};

module.exports = urlController;
