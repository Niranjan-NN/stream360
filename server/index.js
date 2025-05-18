import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import { verifyToken } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://niranjan87901:niju@cluster0.0w26r.mongodb.net/stream360?retryWrites=true&w=majority');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Routes
app.use('/api', authRoutes);
app.use('/api', roomRoutes);

// Protected route example
app.get('/api/me', verifyToken, (req, res) => {
  res.json(req.user);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      id: user._id,
      name: user.name,
      isAudioMuted: false,
      isVideoMuted: false
    });
    
    console.log(`User ${user.name} joined room ${roomId}`);
  });

  // Leave room
  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    io.to(roomId).emit('user-left', userId);
    console.log(`User ${userId} left room ${roomId}`);
  });

  // Send message
  socket.on('send-message', ({ roomId, message }) => {
    socket.to(roomId).emit('receive-message', message);
  });

  // Toggle audio
  socket.on('toggle-audio', ({ roomId, userId, isAudioMuted }) => {
    socket.to(roomId).emit('audio-toggle', { userId, isAudioMuted });
  });

  // Toggle video
  socket.on('toggle-video', ({ roomId, userId, isVideoMuted }) => {
    socket.to(roomId).emit('video-toggle', { userId, isVideoMuted });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});