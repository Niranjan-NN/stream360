import React from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Crown } from 'lucide-react';
import { Participant } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ParticipantsProps {
  participants: Participant[];
}

const Participants: React.FC<ParticipantsProps> = ({ participants }) => {
  const { user } = useAuth();
  
  // Add the local user to the participants list
  const allParticipants = [
    {
      id: 'local',
      name: `${user?.name} (You)`,
      isAudioMuted: false,
      isVideoMuted: false,
      isHost: true
    },
    ...participants
  ];

  return (
    <div className="divide-y divide-gray-200">
      {allParticipants.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>No participants yet</p>
        </div>
      ) : (
        allParticipants.map((participant) => (
          <div 
            key={participant.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <span className="text-primary-700 font-medium">
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div>
                <div className="flex items-center">
                  <p className="font-medium text-gray-800">{participant.name}</p>
                  {participant.isHost && (
                    <span className="ml-2 flex items-center text-xs font-medium text-primary-700">
                      <Crown className="h-3 w-3 mr-1" />
                      Host
                    </span>
                  )}
                </div>
                <div className="flex mt-1 space-x-1">
                  {participant.isAudioMuted ? (
                    <MicOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                  
                  {participant.isVideoMuted ? (
                    <VideoOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <VideoIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
            
            {participant.id !== 'local' && participant.isHost && (
              <div className="flex space-x-2">
                <button 
                  className="p-1.5 text-error-600 hover:bg-error-50 rounded-full"
                  title="Remove participant"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Participants;