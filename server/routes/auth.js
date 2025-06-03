const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// Make sure this line is here (and that `profile` is spelled correctly):
router.get('/profile', authenticate, profile);

module.exports = router;

