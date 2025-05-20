import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-black">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 