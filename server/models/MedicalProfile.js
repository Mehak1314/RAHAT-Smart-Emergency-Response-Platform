const mongoose = require('mongoose');

const medicalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
      default: '',
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    currentMedicines: [
      {
        name: { type: String, trim: true },
        dosage: { type: String, default: '' },
        frequency: { type: String, default: '' },
      },
    ],
    chronicDiseases: [
      {
        type: String,
        trim: true,
      },
    ],
    pastSurgeries: [
      {
        type: String,
        trim: true,
      },
    ],
    emergencyNotes: {
      type: String,
      maxlength: [500, 'Emergency notes cannot exceed 500 characters'],
      default: '',
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    insuranceProvider: {
      type: String,
      default: '',
    },
    insurancePolicyNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalProfile', medicalProfileSchema);
