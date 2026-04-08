const express = require('express');
const router = express.Router();

const { login, register, verifyEmail } = require('../controllers/authController');

router.post('/register', register);
router.get('/verify-email', verifyEmail)
router.post('/login', login);

module.exports = router;