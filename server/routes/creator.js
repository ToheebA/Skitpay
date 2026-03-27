const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const authenticateRole = require('../middleware/role_authentication');
const { multiUpload } = require('../config/cloudinary');

const {
    createProfile,
    getProfile,
    updateProfile,
    deactivateProfile,
    reactivateProfile,
    uploadSkit,
    getSkits,
    updateSkit,
    deleteSkit,
    getCreatorStats
} = require('../controllers/creatorController');

router.use(authenticateUser);
router.use(authenticateRole('creator'));

router.route('/profile')
    .post(createProfile)
    .get(getProfile)
    .patch(updateProfile)
    .delete(deactivateProfile);
router.patch('/profile/reactivate', reactivateProfile);
router.route('/skits')
    .post(multiUpload, uploadSkit)
    .get(getSkits);
router.route('/skits/:id')
    .patch(updateSkit)
    .delete(deleteSkit);
router.get('/stats', getCreatorStats)

module.exports = router;