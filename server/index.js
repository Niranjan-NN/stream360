import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize app & server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Routes
app.use('/api', authRoutes);
app.use('/api', roomRoutes);

app.get('/api/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// Just respond with a simple message at root
app.get('/', (req, res) => {
  res.send('✅ Stream360 API is live!');
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', {
      id: user._id,
      name: user.name,
      isAudioMuted: false,
      isVideoMuted: false
    });
    console.log(`✅ ${user.name} joined room ${roomId}`);
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', userId);
    console.log(`🚪 ${userId} left room ${roomId}`);
  });

  socket.on('send-message', ({ roomId, message }) => {
    socket.to(roomId).emit('receive-message', message);
  });

  socket.on('toggle-audio', ({ roomId, userId, isAudioMuted }) => {
    socket.to(roomId).emit('audio-toggle', { userId, isAudioMuted });
  });

  socket.on('toggle-video', ({ roomId, userId, isVideoMuted }) => {
    socket.to(roomId).emit('video-toggle', { userId, isVideoMuted });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
