import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/roomStore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Phone,
  Monitor,
  MonitorOff,
  Settings
} from 'lucide-react';

const VideoControls: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleAudio, toggleVideo, leaveRoom } = useRoomStore();
  const { addToast } = useToast();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToggleAudio = () => {
    toggleAudio(!isMuted);
    setIsMuted(!isMuted);
    
    addToast({
      title: isMuted ? 'Microphone Activated' : 'Microphone Muted',
      variant: 'info',
    });
  };

  const handleToggleVideo = () => {
    toggleVideo(!isVideoOff);
    setIsVideoOff(!isVideoOff);
    
    addToast({
      title: isVideoOff ? 'Camera Activated' : 'Camera Turned Off',
      variant: 'info',
    });
  };

  const handleToggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        addToast({
          title: 'Screen sharing started',
          variant: 'success',
        });
      } else {
        // Stop screen sharing
        setIsScreenSharing(false);
        addToast({
          title: 'Screen sharing stopped',
          variant: 'info',
        });
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      addToast({
        title: 'Unable to share screen',
        description: 'Please try again or check permissions',
        variant: 'error',
      });
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom('', user?._id || '');
    navigate('/');
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-center space-x-2 md:space-x-6">
        <button
          onClick={handleToggleAudio}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-error-100 text-error-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        <button
          onClick={handleToggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? 'bg-error-100 text-error-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500`}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
        </button>

        <button
          onClick={handleToggleScreenShare}
          className={`p-3 rounded-full ${
            isScreenSharing ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500`}
          title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
        >
          {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
        </button>

        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`p-3 rounded-full ${
            isSettingsOpen ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500`}
          title="Settings"
        >
          <Settings className="h-6 w-6" />
        </button>

        <button
          onClick={handleLeaveRoom}
          className="p-3 rounded-full bg-error-600 text-white hover:bg-error-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-error-500"
          title="Leave meeting"
        >
          <Phone className="h-6 w-6 transform rotate-135" />
        </button>
      </div>
      
      {isSettingsOpen && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-200 animate-fade-in">
          <h3 className="text-lg font-medium mb-3">Audio and Video Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Audio Input
              </label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option>Default Microphone</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Input
              </label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option>Default Camera</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speaker
              </label>
              <select className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                <option>Default Speaker</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoControls;