const express = require('express');
const router = express.Router();
const { getContacts, addContact, updateContact, deleteContact } = require('../controllers/emergencyContact.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getContacts);
router.post('/', protect, addContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
