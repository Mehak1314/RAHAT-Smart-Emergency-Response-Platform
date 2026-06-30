const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Pharmacy = require('../models/Pharmacy');
const BloodDonor = require('../models/BloodDonor');
const SOSRequest = require('../models/SOSRequest');
const MedicalProfile = require('../models/MedicalProfile');

/**
 * @desc    Admin dashboard analytics
 * @route   GET /api/admin/analytics
 * @access  Admin
 */
const getAnalytics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHospitals,
      totalPharmacies,
      totalDonors,
      activeSOS,
      resolvedSOS,
      recentUsers,
      recentSOS,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Hospital.countDocuments({ isActive: true }),
      Pharmacy.countDocuments({ isActive: true }),
      BloodDonor.countDocuments({ isAvailable: true }),
      SOSRequest.countDocuments({ status: 'active' }),
      SOSRequest.countDocuments({ status: 'resolved' }),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('name email phone createdAt'),
      SOSRequest.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name phone'),
    ]);

    // Blood group distribution
    const bloodGroupStats = await BloodDonor.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // SOS by type
    const sosByType = await SOSRequest.aggregate([
      { $group: { _id: '$emergencyType', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalHospitals,
        totalPharmacies,
        availableDonors: totalDonors,
        activeSOS,
        resolvedSOS,
        bloodGroupStats,
        sosByType,
        recentUsers,
        recentSOS,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ success: true, count: users.length, total, users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status
 * @route   PATCH /api/admin/users/:id/toggle
 * @access  Admin
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all SOS requests
 * @route   GET /api/admin/sos
 * @access  Admin
 */
const getAllSOS = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await SOSRequest.countDocuments(query);
    const requests = await SOSRequest.find(query)
      .populate('user', 'name phone email')
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
 * @desc    Promote user to admin
 * @route   PATCH /api/admin/users/:id/role
 * @access  Admin
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      const error = new Error('Invalid role');
      error.statusCode = 400;
      return next(error);
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics, getAllUsers, toggleUserStatus, getAllSOS, updateUserRole };
