const mongoose = require('mongoose');

const sosRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      default: 'Location unavailable',
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'cancelled', 'false_alarm'],
      default: 'active',
    },
    emergencyType: {
      type: String,
      enum: ['medical', 'accident', 'fire', 'crime', 'natural_disaster', 'other'],
      default: 'medical',
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    nearbyHospitals: [
      {
        hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
        distance: Number, // in meters
      },
    ],
    notifiedContacts: [
      {
        contact: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyContact' },
        notifiedAt: { type: Date, default: Date.now },
        method: { type: String, enum: ['email', 'sms', 'call'], default: 'email' },
        success: { type: Boolean, default: false },
      },
    ],
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

sosRequestSchema.index({ location: '2dsphere' });
sosRequestSchema.index({ user: 1, status: 1 });
sosRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SOSRequest', sosRequestSchema);
