const express = require('express');
const router = express.Router();
const { generateCoverLetter } = require('../controllers/aiController');
const authenticate = require('../middleware/auth');

// All AI routes require authentication
router.post('/cover-letter', authenticate, generateCoverLetter);

module.exports = router;

