const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const authenticateRole = require('../middleware/role_authentication');

const {
    createProfile,
    getProfile,
    updateProfile,
    uploadSkit,
    getSkits,
    deleteSkit,
} = require('../controllers/creatorController');

router.use(authenticateUser);
router.use(authenticateRole('creator'));

router.route('/profile').post(createProfile).get(getProfile).patch(updateProfile);
router.route('/skits').post(uploadSkit).get(getSkits);
router.delete('/skits/:id', deleteSkit);

module.exports = router;