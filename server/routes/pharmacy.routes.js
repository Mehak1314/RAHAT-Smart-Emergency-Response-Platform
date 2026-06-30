const express = require('express');
const router = express.Router();
const { getPharmacies, getPharmacy, createPharmacy, updatePharmacy, deletePharmacy } = require('../controllers/pharmacy.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

router.get('/', getPharmacies);
router.get('/:id', getPharmacy);
router.post('/', protect, adminOnly, createPharmacy);
router.put('/:id', protect, adminOnly, updatePharmacy);
router.delete('/:id', protect, adminOnly, deletePharmacy);

module.exports = router;
