import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 animate-fade-in">
        <Link to="/" className="flex items-center justify-center mb-8">
          <Video className="h-10 w-10 text-primary-600" />
          <span className="ml-2 text-3xl font-bold text-gray-900">
            Stream<span className="text-primary-600">360</span>
          </span>
        </Link>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Page not found</p>
        
        <div className="max-w-md mx-auto">
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;