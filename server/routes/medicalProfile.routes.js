const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, uploadDocument, deleteDocument } = require('../controllers/medicalProfile.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadDocuments } = require('../middleware/upload.middleware');

router.get('/', protect, getMyProfile);
router.put('/', protect, updateProfile);
router.post('/documents', protect, uploadDocuments, uploadDocument);
router.delete('/documents/:docId', protect, deleteDocument);

module.exports = router;
