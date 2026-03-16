const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const authenticateRole = require('../middleware/role_authentication');

const {
    createProfile,
    getProfile,
    updateProfile,
    deactivateProfile,
    uploadSkit,
    getSkits,
    updateSkit,
    deleteSkit,
} = require('../controllers/creatorController');

router.use(authenticateUser);
router.use(authenticateRole('creator'));

router.route('/profile')
    .post(createProfile)
    .get(getProfile)
    .patch(updateProfile)
    .delete(deactivateProfile);
router.route('/skits')
    .post(uploadSkit)
    .get(getSkits);
router.route('/skits/:id')
    .patch(updateSkit)
    .delete(deleteSkit);

module.exports = router;