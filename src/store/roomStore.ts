import { create } from 'zustand';
import { Participant, Message } from '../types';
import {
  emitJoinRoom,
  emitLeaveRoom,
  emitSendMessage,
  emitToggleAudio,
  emitToggleVideo,
} from '../services/socket';

interface RoomState {
  roomId: string | null;
  participants: Participant[];
  messages: Message[];
  joinRoom: (roomId: string, user: any, localStream: MediaStream) => void;
  leaveRoom: (roomId: string, userId: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipantAudio: (participantId: string, isAudioMuted: boolean) => void;
  updateParticipantVideo: (participantId: string, isVideoMuted: boolean) => void;
  addMessage: (message: Message) => void;
  toggleAudio: (isMuted: boolean) => void;
  toggleVideo: (isOff: boolean) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  roomId: null,
  participants: [],
  messages: [],
  
  joinRoom: (roomId, user, localStream) => {
    set({ roomId });
    emitJoinRoom(roomId, user);
  },
  
  leaveRoom: (roomId, userId) => {
    if (roomId && userId) {
      emitLeaveRoom(roomId, userId);
    }
    set({ roomId: null, participants: [], messages: [] });
  },
  
  addParticipant: (participant) => {
    set((state) => {
      // Check if participant already exists
      const exists = state.participants.some(p => p.id === participant.id);
      if (exists) return state;
      
      return {
        participants: [...state.participants, participant]
      };
    });
  },
  
  removeParticipant: (participantId) => {
    set((state) => ({
      participants: state.participants.filter(p => p.id !== participantId)
    }));
  },
  
  updateParticipantAudio: (participantId, isAudioMuted) => {
    set((state) => ({
      participants: state.participants.map(p => 
        p.id === participantId ? { ...p, isAudioMuted } : p
      )
    }));
  },
  
  updateParticipantVideo: (participantId, isVideoMuted) => {
    set((state) => ({
      participants: state.participants.map(p => 
        p.id === participantId ? { ...p, isVideoMuted } : p
      )
    }));
  },
  
  addMessage: (message) => {
    const { roomId } = get();
    if (roomId) {
      emitSendMessage(roomId, message);
    }
    
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  
  toggleAudio: (isMuted) => {
    const { roomId } = get();
    if (roomId) {
      emitToggleAudio(roomId, 'local', isMuted);
    }
  },
  
  toggleVideo: (isOff) => {
    const { roomId } = get();
    if (roomId) {
      emitToggleVideo(roomId, 'local', isOff);
    }
  }
}));