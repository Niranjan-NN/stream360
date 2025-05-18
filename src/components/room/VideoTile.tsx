import React, { useEffect, useRef, useState } from 'react';
import { MicOff, VideoOff, User } from 'lucide-react';
import { Participant } from '../../types';

interface VideoTileProps {
  participant: Participant;
  isLocal: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const VideoTile: React.FC<VideoTileProps> = ({ 
  participant,
  isLocal,
  videoRef
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const localRef = useRef<HTMLVideoElement>(null);
  const videoElement = videoRef || localRef;
  const { id, name, isAudioMuted, isVideoMuted, stream } = participant;

  useEffect(() => {
    if (!isLocal && stream && videoElement.current) {
      videoElement.current.srcObject = stream;
    }
  }, [isLocal, stream, videoElement]);

  // Simulating speaking detection (in a real app, use audio analysis)
  useEffect(() => {
    if (isAudioMuted) {
      setIsSpeaking(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const randomSpeak = () => {
      const shouldSpeak = Math.random() > 0.7;
      setIsSpeaking(shouldSpeak);
      
      const nextUpdate = shouldSpeak ? 
        Math.random() * 3000 + 1000 : // Speaking duration
        Math.random() * 5000 + 2000;  // Silent duration
      
      timer = setTimeout(randomSpeak, nextUpdate);
    };
    
    // Initial call
    timer = setTimeout(randomSpeak, Math.random() * 5000);
    
    return () => clearTimeout(timer);
  }, [isAudioMuted]);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden bg-gray-800 shadow-md transition-all duration-300 ${
        isSpeaking ? 'ring-2 ring-primary-500' : ''
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      {isVideoMuted ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-300" />
            </div>
            <p className="mt-2 text-white font-medium">{name}</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoElement}
          autoPlay
          playsInline
          muted={isLocal || isAudioMuted}
          className="w-full h-full object-cover"
        />
      )}

      {/* Status icons */}
      <div className="absolute bottom-3 left-3 flex space-x-2">
        {isAudioMuted && (
          <div className="bg-error-600 rounded-full p-1.5">
            <MicOff className="h-4 w-4 text-white" />
          </div>
        )}
        
        {isVideoMuted && (
          <div className="bg-error-600 rounded-full p-1.5">
            <VideoOff className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Participant name */}
      <div className="absolute bottom-3 right-3 bg-gray-900/70 px-2 py-1 rounded text-sm text-white">
        {name} {isLocal && '(You)'}
      </div>
    </div>
  );
};

export default VideoTile;