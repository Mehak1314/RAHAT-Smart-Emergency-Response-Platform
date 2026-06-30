const BloodDonor = require('../models/BloodDonor');

/**
 * @desc    Search blood donors
 * @route   GET /api/blood/donors
 * @access  Public
 */
const searchDonors = async (req, res, next) => {
  try {
    const { bloodGroup, state, district, city, available, page = 1, limit = 12 } = req.query;

    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (state) query['address.state'] = { $regex: state, $options: 'i' };
    if (district) query['address.district'] = { $regex: district, $options: 'i' };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (available !== undefined) query.isAvailable = available === 'true';

    const total = await BloodDonor.countDocuments(query);
    const donors = await BloodDonor.find(query)
      .populate('user', 'name profilePhoto')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ isAvailable: -1, updatedAt: -1 });

    res.json({ success: true, count: donors.length, total, donors });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register as blood donor
 * @route   POST /api/blood/register
 * @access  Private
 */
const registerDonor = async (req, res, next) => {
  try {
    // Check if already registered
    const existing = await BloodDonor.findOne({ user: req.user._id });
    if (existing) {
      const error = new Error('You are already registered as a blood donor');
      error.statusCode = 400;
      return next(error);
    }

    const donor = await BloodDonor.create({ 
      user: req.user._id, 
      phone: req.body.phone || req.user.phone,
      ...req.body 
    });
    res.status(201).json({ success: true, message: 'Registered as blood donor', donor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my donor profile
 * @route   GET /api/blood/my-profile
 * @access  Private
 */
const getMyDonorProfile = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOne({ user: req.user._id });
    res.json({ success: true, donor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update donor profile
 * @route   PUT /api/blood/update
 * @access  Private
 */
const updateDonorProfile = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!donor) {
      const error = new Error('Donor profile not found. Please register first');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Donor profile updated', donor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle availability
 * @route   PATCH /api/blood/availability
 * @access  Private
 */
const toggleAvailability = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOne({ user: req.user._id });
    if (!donor) {
      const error = new Error('Donor profile not found');
      error.statusCode = 404;
      return next(error);
    }
    donor.isAvailable = !donor.isAvailable;
    await donor.save();
    res.json({
      success: true,
      message: `You are now ${donor.isAvailable ? 'available' : 'unavailable'} for donation`,
      isAvailable: donor.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark donation done
 * @route   PATCH /api/blood/donated
 * @access  Private
 */
const markDonated = async (req, res, next) => {
  try {
    const donor = await BloodDonor.findOneAndUpdate(
      { user: req.user._id },
      { lastDonatedAt: new Date(), $inc: { totalDonations: 1 }, isAvailable: false },
      { new: true }
    );
    res.json({ success: true, message: 'Donation recorded. Thank you!', donor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete donor profile
 * @route   DELETE /api/blood/unregister
 * @access  Private
 */
const unregisterDonor = async (req, res, next) => {
  try {
    await BloodDonor.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Donor registration removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchDonors, registerDonor, getMyDonorProfile, updateDonorProfile, toggleAvailability, markDonated, unregisterDonor };
