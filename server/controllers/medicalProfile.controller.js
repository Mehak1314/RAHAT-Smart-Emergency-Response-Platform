const MedicalProfile = require('../models/MedicalProfile');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');

/**
 * @desc    Get my medical profile
 * @route   GET /api/medical-profile
 * @access  Private
 */
const getMyProfile = async (req, res, next) => {
  try {
    let profile = await MedicalProfile.findOne({ user: req.user._id });
    if (!profile) {
      // Create if doesn't exist
      profile = await MedicalProfile.create({ user: req.user._id });
    }
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update medical profile
 * @route   PUT /api/medical-profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const profile = await MedicalProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.json({ success: true, message: 'Medical profile updated', profile });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload medical document
 * @route   POST /api/medical-profile/documents
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      const error = new Error('Please select documents to upload');
      error.statusCode = 400;
      return next(error);
    }

    const profile = await MedicalProfile.findOne({ user: req.user._id });
    if (!profile) {
      const error = new Error('Medical profile not found');
      error.statusCode = 404;
      return next(error);
    }

    const uploadedDocs = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'medical-documents', {
        resource_type: 'auto',
      });
      uploadedDocs.push({
        name: req.body.name || file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    profile.documents.push(...uploadedDocs);
    await profile.save();

    res.json({ success: true, message: 'Documents uploaded successfully', documents: uploadedDocs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete medical document
 * @route   DELETE /api/medical-profile/documents/:docId
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    const profile = await MedicalProfile.findOne({ user: req.user._id });
    if (!profile) {
      const error = new Error('Profile not found');
      error.statusCode = 404;
      return next(error);
    }

    const doc = profile.documents.id(req.params.docId);
    if (!doc) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      return next(error);
    }

    await deleteFromCloudinary(doc.publicId, 'raw');
    doc.deleteOne();
    await profile.save();

    res.json({ success: true, message: 'Document removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, updateProfile, uploadDocument, deleteDocument };
