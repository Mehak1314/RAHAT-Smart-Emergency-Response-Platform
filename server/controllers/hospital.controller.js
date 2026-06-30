const Hospital = require('../models/Hospital');

/**
 * @desc    Get all hospitals with filters
 * @route   GET /api/hospitals
 * @access  Public
 */
const getHospitals = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      state,
      district,
      city,
      emergency,
      search,
      lat,
      lng,
      radius = 10000, // meters (10km default)
    } = req.query;

    const query = { isActive: true };

    // Geospatial near query
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    if (type) query.type = type;
    if (state) query['address.state'] = { $regex: state, $options: 'i' };
    if (district) query['address.district'] = { $regex: district, $options: 'i' };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (emergency === 'true') query.emergencyAvailable = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.district': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Hospital.countDocuments(query);
    const hospitals = await Hospital.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ emergencyAvailable: -1, name: 1 });

    res.json({
      success: true,
      count: hospitals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      hospitals,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single hospital
 * @route   GET /api/hospitals/:id
 * @access  Public
 */
const getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital || !hospital.isActive) {
      const error = new Error('Hospital not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, hospital });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create hospital (Admin only)
 * @route   POST /api/hospitals
 * @access  Admin
 */
const createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create({ ...req.body, addedBy: req.user._id });
    res.status(201).json({ success: true, message: 'Hospital added successfully', hospital });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update hospital (Admin only)
 * @route   PUT /api/hospitals/:id
 * @access  Admin
 */
const updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) {
      const error = new Error('Hospital not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Hospital updated', hospital });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete hospital (Admin only)
 * @route   DELETE /api/hospitals/:id
 * @access  Admin
 */
const deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hospital) {
      const error = new Error('Hospital not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Hospital removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHospitals, getHospital, createHospital, updateHospital, deleteHospital };
