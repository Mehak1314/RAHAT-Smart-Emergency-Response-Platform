const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: [
        'father',
        'mother',
        'spouse',
        'sibling',
        'child',
        'friend',
        'colleague',
        'neighbor',
        'doctor',
        'other',
      ],
    },
    email: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure max 5 emergency contacts per user (enforced in controller)
emergencyContactSchema.index({ user: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
