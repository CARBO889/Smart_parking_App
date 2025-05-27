// src/pages/Home.jsx
import React from 'react';
import MapView from '../components/MapView';
import ParkingList from '../components/ParkingList';
import parkingSpots from '../data/parkingSpots'; // ✅ Import real data

const Home = () => {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-semibold text-gray-800">Find Parking Near You</h2>
      <MapView />
      <ParkingList slots={parkingSpots} /> {/* ✅ Use real data */}
    </div>
  );
};

export default Home;
