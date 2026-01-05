/**
 * URL Service
 * Handles all URL shortening business logic
 * Manages URL creation, retrieval, deletion, and click tracking
 */

const db = require('../database/db');
const { generateUniqueShortCode } = require('../utils/shortCodeGenerator');

// Configuration constants
const MAX_URLS_PER_USER = 100;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Promisified database query helpers
 * Converts callback-based DB operations to promises
 */
const dbGet = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
};

const dbAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
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
 * Format URL data for response
 * @param {Object} urlData - Raw URL data from database
 * @returns {Object} Formatted URL object
 */
const formatUrlResponse = (urlData) => {
  return {
    id: urlData.id,
    originalUrl: urlData.original_url,
    shortCode: urlData.short_code,
    shortUrl: `${BASE_URL}/${urlData.short_code}`,
    clicks: urlData.clicks,
    createdAt: urlData.created_at
  };
};

const urlService = {
  /**
   * Create a new shortened URL
   * @param {string} originalUrl - The original long URL to shorten
   * @param {number} userId - ID of the user creating the URL
   * @returns {Promise<Object>} Created URL data
   * @throws {Error} If URL limit reached or creation fails
   */
  createShortUrl: async (originalUrl, userId) => {
    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      const err = new Error('Invalid URL format. Please provide a valid URL.');
      err.statusCode = 400;
      throw err;
    }

    // Check user's current URL count
    const countResult = await dbGet(
      'SELECT COUNT(*) as count FROM urls WHERE user_id = ?',
      [userId]
    );

    if (countResult.count >= MAX_URLS_PER_USER) {
      const error = new Error(
        `You have reached the maximum limit of ${MAX_URLS_PER_USER} URLs. Please delete some URLs or upgrade your account.`
      );
      error.statusCode = 403;
      error.limitReached = true;
      throw error;
    }

    // Generate unique short code
    const shortCode = await generateUniqueShortCode(db);

    // Insert new URL into database
    const insertQuery = `
      INSERT INTO urls (original_url, short_code, user_id, clicks, created_at) 
      VALUES (?, ?, ?, 0, datetime('now'))
    `;
    
    const result = await dbRun(insertQuery, [originalUrl, shortCode, userId]);

    return {
      id: result.lastID,
      originalUrl,
      shortCode,
      shortUrl: `${BASE_URL}/${shortCode}`,
      clicks: 0
    };
  },

  /**
   * Get all URLs for a specific user
   * @param {number} userId - ID of the user
   * @returns {Promise<Object>} User's URLs and metadata
   */
  getUserUrls: async (userId) => {
    const query = `
      SELECT id, original_url, short_code, clicks, created_at 
      FROM urls 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;

    const urlRecords = await dbAll(query, [userId]);
    
    // Format each URL for response
    const formattedUrls = urlRecords.map(formatUrlResponse);

    return {
      urls: formattedUrls,
      count: formattedUrls.length,
      limit: MAX_URLS_PER_USER
    };
  },

  /**
   * Delete a URL by ID
   * @param {number} urlId - ID of the URL to delete
   * @param {number} userId - ID of the user requesting deletion (for authorization)
   * @returns {Promise<void>}
   * @throws {Error} If URL not found or user unauthorized
   */
  deleteUrl: async (urlId, userId) => {
    // Verify URL belongs to user
    const url = await dbGet(
      'SELECT id FROM urls WHERE id = ? AND user_id = ?',
      [urlId, userId]
    );

    if (!url) {
      const error = new Error('URL not found or you are not authorized to delete it');
      error.statusCode = 404;
      throw error;
    }

    // Delete the URL
    await dbRun('DELETE FROM urls WHERE id = ?', [urlId]);
  },

  /**
   * Get original URL by short code and increment click count
   * @param {string} shortCode - The short code to look up
   * @returns {Promise<string>} Original URL
   * @throws {Error} If short code not found
   */
  getOriginalUrlByShortCode: async (shortCode) => {
    const urlRecord = await dbGet(
      'SELECT original_url FROM urls WHERE short_code = ?',
      [shortCode]
    );

    if (!urlRecord) {
      const error = new Error('Short URL not found. Please check the link and try again.');
      error.statusCode = 404;
      throw error;
    }

    // Increment click count asynchronously (fire and forget)
    dbRun('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?', [shortCode])
      .catch(err => console.error('Error updating click count:', err));

    return urlRecord.original_url;
  },

  /**
   * Get URL statistics for a specific short code
   * @param {string} shortCode - The short code to get stats for
   * @param {number} userId - ID of the user (for authorization)
   * @returns {Promise<Object>} URL statistics
   * @throws {Error} If URL not found or user unauthorized
   */
  getUrlStats: async (shortCode, userId) => {
    const urlRecord = await dbGet(
      'SELECT * FROM urls WHERE short_code = ? AND user_id = ?',
      [shortCode, userId]
    );

    if (!urlRecord) {
      const error = new Error('URL not found or unauthorized');
      error.statusCode = 404;
      throw error;
    }

    return formatUrlResponse(urlRecord);
  }
};

module.exports = urlService;
