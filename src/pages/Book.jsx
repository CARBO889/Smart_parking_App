// src/pages/Book.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BookSlot from '../components/BookSlot';

const Book = () => {
  const { id } = useParams();
  const [bookingStatus, setBookingStatus] = useState('');

  // For demo: mock slot data based on id
  const slot = {
    id,
    name: `Slot ${id}`,
    address: `123 Main Street - ID ${id}`,
  };

  const handleBooking = () => {
    // Simulate successful booking
    setBookingStatus('Seat reserved! ✅');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Book Parking Slot</h2>
      <BookSlot slot={slot} onBook={handleBooking} />
      {bookingStatus && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded shadow">
          {bookingStatus}
        </div>
      )}
    </div>
  );
};

export default Book;
