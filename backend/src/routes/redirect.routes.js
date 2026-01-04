const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

// Public route - redirect short URL (at root level)
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;
