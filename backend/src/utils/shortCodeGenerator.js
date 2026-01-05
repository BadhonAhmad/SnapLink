/**
 * Short Code Generator Utility
 * Generates unique short codes for URL shortening
 */

// Configuration
const SHORT_CODE_LENGTH = 6;
const ALLOWED_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const MAX_GENERATION_ATTEMPTS = 10;

/**
 * Generate a random short code
 * @param {number} length - Length of the short code
 * @returns {string} Random short code
 */
const generateRandomShortCode = (length = SHORT_CODE_LENGTH) => {
  let shortCode = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALLOWED_CHARACTERS.length);
    shortCode += ALLOWED_CHARACTERS[randomIndex];
  }
  
  return shortCode;
};

/**
 * Check if a short code already exists in database
 * @param {Object} db - Database instance
 * @param {string} shortCode - Short code to check
 * @returns {Promise<boolean>} True if code is unique (doesn't exist)
 */
const isShortCodeUnique = (db, shortCode) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM urls WHERE short_code = ?', [shortCode], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(!row); // Return true if no row found (code is unique)
      }
    });
  });
};

/**
 * Generate a unique short code with collision detection
 * @param {Object} db - Database instance
 * @param {number} maxAttempts - Maximum number of generation attempts
 * @returns {Promise<string>} Unique short code
 * @throws {Error} If unable to generate unique code after max attempts
 */
const generateUniqueShortCode = async (db, maxAttempts = MAX_GENERATION_ATTEMPTS) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const shortCode = generateRandomShortCode();
    const isUnique = await isShortCodeUnique(db, shortCode);
    
    if (isUnique) {
      return shortCode;
    }
    
    attempts++;
  }

  // If we've exhausted all attempts, throw an error
  throw new Error(
    `Failed to generate unique short code after ${maxAttempts} attempts. Please try again.`
  );
};

/**
 * Validate short code format
 * @param {string} shortCode - Short code to validate
 * @returns {boolean} True if valid
 */
const isValidShortCode = (shortCode) => {
  if (!shortCode || typeof shortCode !== 'string') {
    return false;
  }

  if (shortCode.length !== SHORT_CODE_LENGTH) {
    return false;
  }

  // Check if all characters are allowed
  for (const char of shortCode) {
    if (!ALLOWED_CHARACTERS.includes(char)) {
      return false;
    }
  }

  return true;
};

module.exports = {
  generateRandomShortCode,
  generateUniqueShortCode,
  isShortCodeUnique,
  isValidShortCode,
  SHORT_CODE_LENGTH,
  ALLOWED_CHARACTERS
};
