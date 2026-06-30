const Pharmacy = require('../models/Pharmacy');

/**
 * @desc    Get all pharmacies with filters
 * @route   GET /api/pharmacies
 * @access  Public
 */
const getPharmacies = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      open24 = false,
      state,
      district,
      city,
      search,
      lat,
      lng,
      radius = 5000,
    } = req.query;

    const query = { isActive: true };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    if (open24 === 'true') query.isOpen24x7 = true;
    if (state) query['address.state'] = { $regex: state, $options: 'i' };
    if (district) query['address.district'] = { $regex: district, $options: 'i' };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Pharmacy.countDocuments(query);
    const pharmacies = await Pharmacy.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ isOpen24x7: -1, name: 1 });

    res.json({ success: true, count: pharmacies.length, total, pharmacies });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single pharmacy
 * @route   GET /api/pharmacies/:id
 * @access  Public
 */
const getPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy || !pharmacy.isActive) {
      const error = new Error('Pharmacy not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, pharmacy });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create pharmacy (Admin only)
 * @route   POST /api/pharmacies
 * @access  Admin
 */
const createPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    res.status(201).json({ success: true, message: 'Pharmacy added', pharmacy });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update pharmacy (Admin only)
 * @route   PUT /api/pharmacies/:id
 * @access  Admin
 */
const updatePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pharmacy) {
      const error = new Error('Pharmacy not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Pharmacy updated', pharmacy });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete pharmacy (Admin only)
 * @route   DELETE /api/pharmacies/:id
 * @access  Admin
 */
const deletePharmacy = async (req, res, next) => {
  try {
    await Pharmacy.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Pharmacy removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPharmacies, getPharmacy, createPharmacy, updatePharmacy, deletePharmacy };
