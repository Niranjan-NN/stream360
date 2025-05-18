export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Participant {
  id: string;
  name: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isHost?: boolean;
  stream?: MediaStream;
}

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: string;
}

export interface Room {
  _id: string;
  roomId: string;
  participants: string[];
  createdAt: string;
  host: string;
}