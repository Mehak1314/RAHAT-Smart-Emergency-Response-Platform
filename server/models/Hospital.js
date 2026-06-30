const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['government', 'private', 'trust', 'clinic'],
      required: [true, 'Hospital type is required'],
    },
    address: {
      houseNumber: { type: String, default: '' },
      street: { type: String, default: '' },
      locality: { type: String, default: '' },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    alternatePhone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    // GeoJSON for geospatial queries
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
    specialties: [{ type: String }],
    emergencyAvailable: {
      type: Boolean,
      default: true,
    },
    beds: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ 'address.state': 1, 'address.district': 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
