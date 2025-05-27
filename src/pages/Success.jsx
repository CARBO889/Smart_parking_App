// src/pages/Success.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
  

    <div className="p-6 text-center">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
  <h2 className="text-3xl font-bold text-green-600">Booking Confirmed!</h2>
  <p className="text-gray-700">Your parking slot has been successfully reserved.</p>
  <Link to="/" className="text-blue-600 underline hover:text-blue-800">Back to Home</Link>
</div>
    </div>
  );
};

export default Success;
