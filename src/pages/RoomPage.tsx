import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import RoomChat from '../components/room/RoomChat';
import Participants from '../components/room/Participants';
import VideoControls from '../components/room/VideoControls';
import VideoGrid from '../components/room/VideoGrid';
import { socket, initializeSocket } from '../services/socket';
import { useRoomStore } from '../store/roomStore';
import { Video, X, Users, MessageSquare } from 'lucide-react';

interface RouteParams {
  roomId: string;
  [key: string]: string | undefined;
}

const RoomPage: React.FC = () => {
  const { roomId } = useParams<RouteParams>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const {
    participants,
    messages,
    joinRoom,
    leaveRoom,
    addMessage,
  } = useRoomStore();

  useEffect(() => {
    if (!user || !roomId) return;

    initializeSocket();

    let localStream: MediaStream | null = null;

    const setupLocalStream = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        joinRoom(roomId, user, localStream);
        setIsLoading(false);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        addToast({
          title: 'Camera/Microphone Error',
          description: 'Unable to access your camera or microphone',
          variant: 'error',
        });
        navigate('/');
      }
    };

    setupLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      leaveRoom(roomId, user._id);
      socket.disconnect();
    };
  }, [roomId, user, joinRoom, leaveRoom, navigate, addToast]);

  const handleLeaveRoom = () => {
    leaveRoom(roomId!, user?._id!);
    navigate('/');
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    addMessage({
      id: Date.now().toString(),
      sender: user!,
      content: message,
      timestamp: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Video className="h-6 w-6 text-primary-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-900">
            Stream<span className="text-primary-600">360</span>
          </h1>
          <div className="ml-4 px-3 py-1 bg-gray-100 rounded-md">
            <span className="text-sm font-medium text-gray-700">Room ID: {roomId}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:space-x-4 items-center justify-end">
          <button
            onClick={() => {
              setIsParticipantsOpen(true);
              setIsChatOpen(false);
            }}
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isParticipantsOpen ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">{participants.length} Participants</span>
          </button>

          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsParticipantsOpen(false);
            }}
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium relative ${
              isChatOpen ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Chat</span>
            {messages.length > 0 && !isChatOpen && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            )}
          </button>

          <button
            onClick={handleLeaveRoom}
            className="bg-error-600 hover:bg-error-700 text-white rounded-md px-3 py-2 text-sm font-medium flex items-center transition-colors duration-300"
          >
            <X className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className={`flex-1 ${isChatOpen || isParticipantsOpen ? 'hidden lg:block' : 'block'}`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 px-2 sm:px-4 py-2 sm:py-4">
              <VideoGrid localVideoRef={localVideoRef} />
            </div>
            <VideoControls />
          </div>
        </div>

        {/* Sidebar */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className="w-full sm:max-w-sm md:max-w-xs lg:w-80 bg-white shadow-lg flex flex-col border-l border-gray-200">
            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                {isChatOpen ? 'Chat' : 'Participants'}
              </h2>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setIsParticipantsOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isChatOpen ? (
                <RoomChat messages={messages} onSendMessage={handleSendMessage} />
              ) : (
                <Participants participants={participants} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
