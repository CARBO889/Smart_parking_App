// src/components/BookSlot.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BookSlot = ({ slot }) => {
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    toast.success('Your ticket is confirmed!');
    setIsBooked(true);
  };

  return (
    <div className="p-4 border rounded shadow mt-4">
      <div className="p-6 bg-white border rounded shadow max-w-md mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-2">Booking: {slot.name}</h2>
        <p className="text-gray-700 mb-4">Address: {slot.address}</p>
        <button
          onClick={handleBooking}
          disabled={isBooked}
          className={`px-5 py-2 rounded transition text-white ${
            isBooked
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isBooked ? 'Booked' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
};

export default BookSlot;
