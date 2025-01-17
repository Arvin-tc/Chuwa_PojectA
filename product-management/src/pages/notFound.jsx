import React from 'react';

const NotFound = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-9xl font-extrabold text-red-500">404</h1>
        <p className="text-2xl md:text-3xl font-medium mt-4">
          Oops! The page you're looking for doesn't exist.
        </p >
        <p className="text-lg mt-2">
          You may have mistyped the address or the page may have been removed.
        </p >
        <a
          href=" "
          className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Back
        </a >
      </div>
    );
  };

export default NotFound;
