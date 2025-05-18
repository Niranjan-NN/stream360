import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, Users, Shield, MessageSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const LandingPage: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    navigate(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex items-center">
            <Video className="h-10 w-10 mr-3 text-primary-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Stream<span className="text-primary-600">360</span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Connect with anyone, anywhere with our professional-grade video conferencing solution.
          </p>

          <div className="w-full max-w-md mb-16 animate-fade-in">
            {user ? (
              <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Start or Join Meeting</h2>
                <div className="space-y-6">
                  <button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition duration-300 flex justify-center items-center"
                  >
                    {isCreatingRoom ? 'Creating...' : 'Create New Meeting'}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or join existing</span>
                    </div>
                  </div>

                  <form onSubmit={handleJoinRoom}>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 transition duration-300"
                    >
                      Join Meeting
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Join Stream360</h2>
                <p className="mb-6 text-gray-600">
                  Sign in to create or join a meeting
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-300"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
            <FeatureCard 
              icon={<Video className="h-8 w-8 text-primary-600" />}
              title="HD Video"
              description="Crystal clear video quality for professional meetings"
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-primary-600" />}
              title="Secure Rooms"
              description="End-to-end encryption for your privacy and security"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-primary-600" />}
              title="Multiple Participants"
              description="Connect with your entire team in a single call"
            />
            <FeatureCard 
              icon={<MessageSquare className="h-8 w-8 text-primary-600" />}
              title="Chat Features"
              description="Send messages while in a meeting with participants"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;