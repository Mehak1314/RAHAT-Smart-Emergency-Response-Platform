const mongoose = require('mongoose');

const bloodDonorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
    },
    address: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, default: '' },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonatedAt: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    age: {
      type: Number,
      min: [18, 'Donor must be at least 18 years old'],
      max: [65, 'Donor must not exceed 65 years'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    medicalConditions: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bloodDonorSchema.index({ bloodGroup: 1, 'address.state': 1, 'address.district': 1, 'address.city': 1 });
bloodDonorSchema.index({ isAvailable: 1, bloodGroup: 1 });

module.exports = mongoose.model('BloodDonor', bloodDonorSchema);
