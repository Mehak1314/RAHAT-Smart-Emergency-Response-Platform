const express = require('express');
const router = express.Router();
const {
  searchDonors,
  registerDonor,
  getMyDonorProfile,
  updateDonorProfile,
  toggleAvailability,
  markDonated,
  unregisterDonor,
} = require('../controllers/blood.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/donors', searchDonors);
router.post('/register', protect, registerDonor);
router.get('/my-profile', protect, getMyDonorProfile);
router.put('/update', protect, updateDonorProfile);
router.patch('/availability', protect, toggleAvailability);
router.patch('/donated', protect, markDonated);
router.delete('/unregister', protect, unregisterDonor);

module.exports = router;
