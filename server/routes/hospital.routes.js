const express = require('express');
const router = express.Router();
const { getHospitals, getHospital, createHospital, updateHospital, deleteHospital } = require('../controllers/hospital.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.get('/', getHospitals);
router.get('/:id', getHospital);
router.post('/', protect, adminOnly, createHospital);
router.put('/:id', protect, adminOnly, updateHospital);
router.delete('/:id', protect, adminOnly, deleteHospital);

module.exports = router;
