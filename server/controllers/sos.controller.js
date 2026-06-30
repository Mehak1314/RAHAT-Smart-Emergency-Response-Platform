const SOSRequest = require('../models/SOSRequest');
const EmergencyContact = require('../models/EmergencyContact');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const { sendSOSEmail } = require('../services/email.service');

/**
 * @desc    Create SOS request
 * @route   POST /api/sos
 * @access  Private
 */
const createSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, address, emergencyType, description } = req.body;

    if (!latitude || !longitude) {
      const error = new Error('Location is required for SOS');
      error.statusCode = 400;
      return next(error);
    }

    // Find nearby hospitals (within 10km)
    const nearbyHospitals = await Hospital.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 10000,
        },
      },
    }).limit(5);

    // Create SOS request
    const sos = await SOSRequest.create({
      user: req.user._id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address: address || 'See map for location',
      emergencyType: emergencyType || 'medical',
      description,
      nearbyHospitals: nearbyHospitals.map((h) => ({
        hospital: h._id,
        distance: 0, // Will be calculated client-side
      })),
    });

    // Get emergency contacts
    const contacts = await EmergencyContact.find({ user: req.user._id });
    const user = await User.findById(req.user._id);

    // Notify contacts with email
    const notifiedContacts = [];
    for (const contact of contacts) {
      if (contact.email) {
        const result = await sendSOSEmail(contact, user, sos);
        notifiedContacts.push({
          contact: contact._id,
          method: 'email',
          success: result.success,
          notifiedAt: new Date(),
        });
      }
    }

    sos.notifiedContacts = notifiedContacts;
    await sos.save();

    // Emit via socket if available
    if (req.app.get('io')) {
      req.app.get('io').emit('sos:new', {
        sosId: sos._id,
        userId: req.user._id,
        userName: user.name,
        location: sos.location,
        emergencyType: sos.emergencyType,
      });
    }

    // Populate for response
    await sos.populate([
      { path: 'nearbyHospitals.hospital', select: 'name type address phone emergencyAvailable location' },
      { path: 'notifiedContacts.contact', select: 'name phone relationship' },
    ]);

    res.status(201).json({
      success: true,
      message: 'SOS alert sent. Help is on the way!',
      sos,
      nearbyHospitals,
      contactsNotified: notifiedContacts.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my SOS history
 * @route   GET /api/sos/history
 * @access  Private
 */
const getSOSHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await SOSRequest.countDocuments({ user: req.user._id });
    const requests = await SOSRequest.find({ user: req.user._id })
      .populate('nearbyHospitals.hospital', 'name address phone')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ success: true, count: requests.length, total, requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active SOS
 * @route   GET /api/sos/active
 * @access  Private
 */
const getActiveSOS = async (req, res, next) => {
  try {
    const sos = await SOSRequest.findOne({ user: req.user._id, status: 'active' })
      .populate('nearbyHospitals.hospital', 'name address phone emergencyAvailable')
      .sort({ createdAt: -1 });
    res.json({ success: true, sos });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update SOS status
 * @route   PATCH /api/sos/:id/status
 * @access  Private
 */
const updateSOSStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const sos = await SOSRequest.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        status,
        ...(status === 'resolved' && { resolvedAt: new Date() }),
      },
      { new: true }
    );

    if (!sos) {
      const error = new Error('SOS request not found');
      error.statusCode = 404;
      return next(error);
    }

    if (req.app.get('io')) {
      req.app.get('io').emit('sos:update', { sosId: sos._id, status });
    }

    res.json({ success: true, message: `SOS marked as ${status}`, sos });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSOS, getSOSHistory, getActiveSOS, updateSOSStatus };
