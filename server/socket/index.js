const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Initialize Socket.io with authentication and event handling
 */
const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('name role');
        if (user) {
          socket.user = user;
        }
      }
      next();
    } catch {
      next(); // Allow unauthenticated sockets (for public notifications)
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();
    console.log(`🔌 Socket connected: ${socket.id}${userId ? ` (User: ${userId})` : ''}`);

    // Join personal room for targeted notifications
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Admin joins admin room
    if (socket.user?.role === 'admin') {
      socket.join('admin');
    }

    // Live location update (for SOS tracking)
    socket.on('location:update', (data) => {
      if (userId && data.sosId) {
        // Broadcast location to admin room
        io.to('admin').emit('location:update', {
          userId,
          userName: socket.user?.name,
          sosId: data.sosId,
          lat: data.lat,
          lng: data.lng,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // SOS status update
    socket.on('sos:join', (sosId) => {
      socket.join(`sos:${sosId}`);
    });

    socket.on('sos:leave', (sosId) => {
      socket.leave(`sos:${sosId}`);
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  // Expose io to be used by controllers via req.app.get('io')
  // This is set in index.js after initSocket is called
  return io;
};

module.exports = initSocket;
