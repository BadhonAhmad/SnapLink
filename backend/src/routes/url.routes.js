const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes - require authentication
router.post('/', authMiddleware, urlController.createUrl);
router.get('/', authMiddleware, urlController.getUserUrls);
router.delete('/:id', authMiddleware, urlController.deleteUrl);

module.exports = router;
