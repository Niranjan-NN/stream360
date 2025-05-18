import express from 'express';
import Room from '../models/Room.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create a new room
router.post('/rooms', verifyToken, async (req, res) => {
  try {
    const { roomId } = req.body;
    
    // Check if room already exists
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }
    
    // Create new room
    const room = new Room({
      roomId,
      host: req.user.id,
      participants: [req.user.id],
    });
    
    await room.save();
    
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get room details
router.get('/rooms/:roomId', verifyToken, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('participants', 'name email')
      .populate('host', 'name email');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Join room
router.post('/rooms/:roomId/join', verifyToken, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is already in the room
    if (room.participants.includes(req.user.id)) {
      return res.json(room);
    }
    
    // Add user to participants
    room.participants.push(req.user.id);
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Leave room
router.post('/rooms/:roomId/leave', verifyToken, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Remove user from participants
    room.participants = room.participants.filter(
      (participant) => participant.toString() !== req.user.id
    );
    
    // If room is empty, delete it
    if (room.participants.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res.json({ message: 'Room deleted' });
    }
    
    // If host leaves, assign new host
    if (room.host.toString() === req.user.id) {
      room.host = room.participants[0];
    }
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete room (host only)
router.delete('/rooms/:roomId', verifyToken, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if user is the host
    if (room.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Room.deleteOne({ _id: room._id });
    
    res.json({ message: 'Room deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;