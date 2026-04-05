const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../controllers/paymentController');
const authenticateUser = require('../middleware/authentication');

router.post('/initialize/:creatorProfileId', authenticateUser, initializePayment);
router.get('/verify/:reference', authenticateUser, verifyPayment);

module.exports = router;