/**
 * Database Module
 * Initializes SQLite database and creates tables
 * Provides centralized database connection for the application
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

// Database file path
const dbPath = path.join(__dirname, '../../snaplink.db');

// Initialize database connection
const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    logger.error('Failed to connect to database', error);
    process.exit(1);
  }
  logger.info('Database connection established', { dbPath });
});

/**
 * Initialize database tables
 * Creates users and urls tables if they don't exist
 */
const initializeTables = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (error) => {
      if (error) {
        logger.error('Failed to create users table', error);
      } else {
        logger.debug('Users table ready');
      }
    });

    // Create URLs table with user association
    db.run(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_url TEXT NOT NULL,
        short_code TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        clicks INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `, (error) => {
      if (error) {
        logger.error('Failed to create urls table', error);
      } else {
        logger.debug('URLs table ready');
      }
    });

    // Create indexes for faster lookups
    db.run(`CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code)`, (error) => {
      if (error) {
        logger.error('Failed to create short_code index', error);
      } else {
        logger.debug('Short code index ready');
      }
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_user_id ON urls(user_id)`, (error) => {
      if (error) {
        logger.error('Failed to create user_id index', error);
      } else {
        logger.debug('User ID index ready');
      }
    });

    logger.info('Database tables initialized successfully');
  });
};

// Initialize tables on module load
initializeTables();

/**
 * Graceful database shutdown
 * Closes database connection properly
 */
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        logger.error('Error closing database', error);
        reject(error);
      } else {
        logger.info('Database connection closed');
        resolve();
      }
    });
  });
};

// Handle application shutdown gracefully
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

module.exports = db;
