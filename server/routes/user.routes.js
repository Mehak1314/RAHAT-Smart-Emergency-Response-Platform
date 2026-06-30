const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadPhoto } = require('../middleware/upload.middleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/photo', protect, uploadPhoto, uploadProfilePhoto);
router.delete('/profile/photo', protect, deleteProfilePhoto);

module.exports = router;
