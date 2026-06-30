const express = require('express');
const router = express.Router();
const { createSOS, getSOSHistory, getActiveSOS, updateSOSStatus } = require('../controllers/sos.controller');
const { protect } = require('../middleware/auth.middleware');
const { sosLimiter } = require('../middleware/rateLimiter');

router.post('/', protect, sosLimiter, createSOS);
router.get('/history', protect, getSOSHistory);
router.get('/active', protect, getActiveSOS);
router.patch('/:id/status', protect, updateSOSStatus);

module.exports = router;
