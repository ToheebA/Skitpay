const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const authenticateRole = require('../middleware/role_authentication');
const optionalAuthMiddleware = require('../middleware/optionalAuth');



const {
    getAllSkits,
    getAllCreators,
    getSkit,
    likeSkit,
    activateSubscription,
    cancelSubscription,
    getSubscriptions
} = require('../controllers/fanController');

router.get('/skits', getAllSkits);
router.get('/creators', getAllCreators);
router.get('/subscriptions', authenticateUser, getSubscriptions)
router.get('/skits/:id', optionalAuthMiddleware, getSkit);
router.post('/skits/:id/like', authenticateUser, likeSkit);
router.post(
    '/subscriptions/:creatorProfileId', 
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