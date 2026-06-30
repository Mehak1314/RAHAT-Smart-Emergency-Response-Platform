const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bloodGroup, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bloodGroup, address },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload profile photo
 * @route   POST /api/users/profile/photo
 * @access  Private
 */
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Please upload an image');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findById(req.user._id);

    // Delete old photo from Cloudinary if exists
    if (user.profilePhotoPublicId) {
      await deleteFromCloudinary(user.profilePhotoPublicId);
    }

    // Upload new photo
    const result = await uploadToCloudinary(req.file.buffer, 'profile-photos', {
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    user.profilePhoto = result.secure_url;
    user.profilePhotoPublicId = result.public_id;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Profile photo updated',
      profilePhoto: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete profile photo
 * @route   DELETE /api/users/profile/photo
 * @access  Private
 */
const deleteProfilePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.profilePhotoPublicId) {
      await deleteFromCloudinary(user.profilePhotoPublicId);
    }
    user.profilePhoto = null;
    user.profilePhotoPublicId = null;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Profile photo removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto };
