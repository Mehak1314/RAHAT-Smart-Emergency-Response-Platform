const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'RAHAT API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/hospitals', require('./routes/hospital.routes'));
app.use('/api/pharmacies', require('./routes/pharmacy.routes'));
app.use('/api/blood', require('./routes/blood.routes'));
app.use('/api/medical-profile', require('./routes/medicalProfile.routes'));
app.use('/api/emergency-contacts', require('./routes/emergencyContact.routes'));
app.use('/api/sos', require('./routes/sos.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Static uploads
app.use('/uploads', express.static('uploads'));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
