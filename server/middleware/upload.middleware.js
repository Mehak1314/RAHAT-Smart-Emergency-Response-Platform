const multer = require('multer');
const path = require('path');

// Memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/jpeg|image\/png|application\/pdf|application\/msword|application\/vnd.openxmlformats/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (JPEG, PNG), PDF, and Word documents are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});

// Upload for profile photo (single image)
const uploadPhoto = upload.single('photo');

// Upload for medical documents (up to 5 files)
const uploadDocuments = upload.array('documents', 5);

module.exports = { uploadPhoto, uploadDocuments };
