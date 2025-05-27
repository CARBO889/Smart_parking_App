// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
  // components/Navbar.jsx
<nav className="sticky top-0 z-50 p-4 bg-blue-600 text-white shadow-md flex justify-between items-center">
  <h1 className="text-xl font-bold">Smart Parking</h1>
  <Link to="/" className="hover:underline">Home</Link>
</nav>

  );
};

export default Navbar;
