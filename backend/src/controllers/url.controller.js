const db = require('../database/db');
const crypto = require('crypto');

const MAX_URLS_PER_USER = 100;
const SHORT_CODE_LENGTH = 6;

// Generate unique short code
const generateShortCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  
  for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }
  
  return shortCode;
};

// Check if short code exists
const isShortCodeUnique = (shortCode) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
      if (err) reject(err);
      resolve(!row);
    });
  });
};

// Generate unique short code
const generateUniqueShortCode = async () => {
  let shortCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    shortCode = generateShortCode();
    isUnique = await isShortCodeUnique(shortCode);
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique short code');
  }

  return shortCode;
};

const urlController = {
  // Create short URL
  createUrl: async (req, res) => {
    try {
      const { originalUrl } = req.body;
      const userId = req.user.userId;

      // Validate URL
      if (!originalUrl) {
        return res.status(400).json({
          success: false,
          message: 'Original URL is required'
        });
      }

      // Validate URL format
      try {
        new URL(originalUrl);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }

      // Check user's URL count
      db.get(
        'SELECT COUNT(*) as count FROM urls WHERE user_id = ?',
        [userId],
        async (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          if (result.count >= MAX_URLS_PER_USER) {
            return res.status(403).json({
              success: false,
              message: `You have reached the maximum limit of ${MAX_URLS_PER_USER} URLs. Please upgrade your account.`,
              limitReached: true
            });
          }

          try {
            // Generate unique short code
            const shortCode = await generateUniqueShortCode();

            // Insert URL
            const query = `
              INSERT INTO urls (original_url, short_code, user_id, clicks, created_at) 
              VALUES (?, ?, ?, 0, datetime('now'))
            `;

            db.run(query, [originalUrl, shortCode, userId], function(err) {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Error creating short URL'
                });
              }

              res.status(201).json({
                success: true,
                message: 'Short URL created successfully',
                data: {
                  id: this.lastID,
                  originalUrl,
                  shortCode,
                  shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`,
                  clicks: 0
                }
              });
            });
          } catch (error) {
            res.status(500).json({
              success: false,
              message: error.message
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get user's URLs
  getUserUrls: (req, res) => {
    try {
      const userId = req.user.userId;

      const query = `
        SELECT id, original_url, short_code, clicks, created_at 
        FROM urls 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `;

      db.all(query, [userId], (err, rows) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        const urls = rows.map(row => ({
          id: row.id,
          originalUrl: row.original_url,
          shortCode: row.short_code,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${row.short_code}`,
          clicks: row.clicks,
          createdAt: row.created_at
        }));

        res.json({
          success: true,
          data: {
            urls,
            count: urls.length,
            limit: MAX_URLS_PER_USER
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

  // Delete URL
  deleteUrl: (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      // Check if URL belongs to user
      db.get(
        'SELECT id FROM urls WHERE id = ? AND user_id = ?',
        [id, userId],
        (err, row) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          if (!row) {
            return res.status(404).json({
              success: false,
              message: 'URL not found or unauthorized'
            });
          }

          // Delete URL
          db.run('DELETE FROM urls WHERE id = ?', [id], (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Error deleting URL'
              });
            }

            res.json({
              success: true,
              message: 'URL deleted successfully'
            });
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  // Get URL by short code and redirect
  redirectUrl: (req, res) => {
    try {
      const { shortCode } = req.params;

      db.get(
        'SELECT original_url FROM urls WHERE short_code = ?',
        [shortCode],
        (err, row) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Database error'
            });
          }

          if (!row) {
            return res.status(404).json({
              success: false,
              message: 'Short URL not found'
            });
          }

          // Increment click count
          db.run(
            'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?',
            [shortCode]
          );

          // Redirect to original URL
          res.redirect(row.original_url);
        }
      );
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
};

module.exports = urlController;
