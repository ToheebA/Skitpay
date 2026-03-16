const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const authenticateRole = require('../middleware/role_authentication');


const {
    getAllSkits,
    getSkit,
    likeSkit,
    activateSubscription,
    cancelSubscription
} = require('../controllers/fanController');

router.get('/skits', getAllSkits);
router.get('/skits/:id', getSkit);
router.post('/skits/:id/like', authenticateUser, likeSkit);
router.post(
    '/subscriptions', 
    authenticateUser, 
    authenticateRole('fan', 'brand'), 
    activateSubscription
);
router.delete(
    '/subscriptions/:id', 
    authenticateUser, 
    authenticateRole('fan', 'brand'), 
    cancelSubscription
);

module.exports = router;