const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  toggleUserStatus,
  getAllSOS,
  updateUserRole,
} = require('../controllers/admin.controller');
const { getHospitals, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital.controller');
const { getPharmacies, createPharmacy, updatePharmacy, deletePharmacy } = require('../controllers/pharmacy.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);
router.patch('/users/:id/role', updateUserRole);

// SOS management
router.get('/sos', getAllSOS);

// Hospital management
router.get('/hospitals', getHospitals);
router.post('/hospitals', createHospital);
router.put('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

// Pharmacy management
router.get('/pharmacies', getPharmacies);
router.post('/pharmacies', createPharmacy);
router.put('/pharmacies/:id', updatePharmacy);
router.delete('/pharmacies/:id', deletePharmacy);

module.exports = router;
