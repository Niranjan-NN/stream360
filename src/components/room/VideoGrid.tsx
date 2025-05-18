import React, { useRef, useEffect } from 'react';
import { useRoomStore } from '../../store/roomStore';
import VideoTile from './VideoTile';

interface VideoGridProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
}

const VideoGrid: React.FC<VideoGridProps> = ({ localVideoRef }) => {
  const { participants } = useRoomStore();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeGrid = () => {
      if (!gridRef.current) return;
      
      const totalParticipants = participants.length + 1; // +1 for local video
      
      let columns;
      if (totalParticipants <= 2) {
        columns = 1;
      } else if (totalParticipants <= 4) {
        columns = 2;
      } else if (totalParticipants <= 9) {
        columns = 3;
      } else {
        columns = 4;
      }
      
      gridRef.current.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    };
    
    resizeGrid();
    window.addEventListener('resize', resizeGrid);
    
    return () => {
      window.removeEventListener('resize', resizeGrid);
    };
  }, [participants.length]);

  // Determine responsive layout
  const getGridClassnames = () => {
    const totalParticipants = participants.length + 1; // +1 for local video
    
    if (totalParticipants <= 1) {
      return 'grid-cols-1';
    } else if (totalParticipants === 2) {
      return 'grid-cols-1 md:grid-cols-2';
    } else if (totalParticipants <= 4) {
      return 'grid-cols-1 sm:grid-cols-2';
    } else if (totalParticipants <= 9) {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    } else {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  return (
    <div 
      ref={gridRef}
      className={`grid ${getGridClassnames()} gap-4 h-full w-full overflow-y-auto p-2`}
    >
      {/* Local video */}
      <VideoTile
        isLocal={true}
        videoRef={localVideoRef}
        participant={{
          id: 'local',
          name: 'You',
          isAudioMuted: false,
          isVideoMuted: false
        }}
      />
      
      {/* Remote videos */}
      {participants.map((participant) => (
        <VideoTile
          key={participant.id}
          isLocal={false}
          participant={participant}
        />
      ))}
    </div>
  );
};

export default VideoGrid;