import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send } from 'lucide-react';
import { Message } from '../../types';

interface RoomChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const RoomChat: React.FC<RoomChatProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender._id === user?._id 
                    ? 'bg-primary-100 text-primary-900' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.sender._id !== user?._id && (
                  <div className="font-medium text-xs text-gray-500 mb-1">
                    {message.sender.name}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="text-xs text-right mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white rounded-r-md px-3 py-2 hover:bg-primary-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomChat;