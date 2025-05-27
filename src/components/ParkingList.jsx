// src/components/ParkingList.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ParkingList = ({ slots }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {slots.map(slot => (
        <div
          key={slot.id}
          className={`p-5 rounded-2xl shadow-md border ${
            slot.available ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'
          } transition-all duration-200 hover:shadow-lg`}
        >
          <h2 className="text-xl font-bold text-gray-800">{slot.name}</h2>
          <p className="text-gray-600">{slot.address}</p>
          <p className="text-gray-700 font-medium mt-1">Price: ₹{slot.pricePerHour} / hour</p>
          <p
            className={`font-semibold mt-2 ${
              slot.available ? 'text-green-600' : 'text-red-500'
            }`}
          >
            Status: {slot.available ? 'Available' : 'Full'}
          </p>
          {slot.available && (
            <Link
              to={`/book/${slot.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Book Now
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParkingList;
