const EmergencyContact = require('../models/EmergencyContact');

const MAX_CONTACTS = 5;

/**
 * @desc    Get all emergency contacts
 * @route   GET /api/emergency-contacts
 * @access  Private
 */
const getContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: 1 });
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add emergency contact
 * @route   POST /api/emergency-contacts
 * @access  Private
 */
const addContact = async (req, res, next) => {
  try {
    const count = await EmergencyContact.countDocuments({ user: req.user._id });
    if (count >= MAX_CONTACTS) {
      const error = new Error(`You can only add a maximum of ${MAX_CONTACTS} emergency contacts`);
      error.statusCode = 400;
      return next(error);
    }

    // If this is marked as primary, unset existing primary
    if (req.body.isPrimary) {
      await EmergencyContact.updateMany({ user: req.user._id }, { isPrimary: false });
    }

    const contact = await EmergencyContact.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, message: 'Emergency contact added', contact });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update emergency contact
 * @route   PUT /api/emergency-contacts/:id
 * @access  Private
 */
const updateContact = async (req, res, next) => {
  try {
    // If setting as primary, unset others
    if (req.body.isPrimary) {
      await EmergencyContact.updateMany({ user: req.user._id }, { isPrimary: false });
    }

    const contact = await EmergencyContact.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      const error = new Error('Contact not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({ success: true, message: 'Contact updated', contact });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete emergency contact
 * @route   DELETE /api/emergency-contacts/:id
 * @access  Private
 */
const deleteContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      const error = new Error('Contact not found');
      error.statusCode = 404;
      return next(error);
    }

    res.json({ success: true, message: 'Emergency contact removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getContacts, addContact, updateContact, deleteContact };
