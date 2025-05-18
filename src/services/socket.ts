import { io, Socket } from 'socket.io-client';
import { Participant, Message } from '../types';
import { useRoomStore } from '../store/roomStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let socket: Socket;

const initializeSocket = () => {
  if (socket) return socket;

  socket = io(baseURL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  // Setup socket event listeners
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('user-joined', (participant: Participant) => {
    const { addParticipant } = useRoomStore.getState();
    addParticipant(participant);
  });

  socket.on('user-left', (userId: string) => {
    const { removeParticipant } = useRoomStore.getState();
    removeParticipant(userId);
  });

  socket.on('receive-message', (message: Message) => {
    const { addMessage } = useRoomStore.getState();
    addMessage(message);
  });

  socket.on('audio-toggle', ({ userId, isAudioMuted }: { userId: string; isAudioMuted: boolean }) => {
    const { updateParticipantAudio } = useRoomStore.getState();
    updateParticipantAudio(userId, isAudioMuted);
  });

  socket.on('video-toggle', ({ userId, isVideoMuted }: { userId: string; isVideoMuted: boolean }) => {
    const { updateParticipantVideo } = useRoomStore.getState();
    updateParticipantVideo(userId, isVideoMuted);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  return socket;
};

// Function to emit events
const emitJoinRoom = (roomId: string, user: any) => {
  if (!socket.connected) socket.connect();
  socket.emit('join-room', { roomId, user });
};

const emitLeaveRoom = (roomId: string, userId: string) => {
  socket.emit('leave-room', { roomId, userId });
};

const emitSendMessage = (roomId: string, message: Message) => {
  socket.emit('send-message', { roomId, message });
};

const emitToggleAudio = (roomId: string, userId: string, isAudioMuted: boolean) => {
  socket.emit('toggle-audio', { roomId, userId, isAudioMuted });
};

const emitToggleVideo = (roomId: string, userId: string, isVideoMuted: boolean) => {
  socket.emit('toggle-video', { roomId, userId, isVideoMuted });
};

export {
  socket,
  initializeSocket,
  emitJoinRoom,
  emitLeaveRoom,
  emitSendMessage,
  emitToggleAudio,
  emitToggleVideo,
};