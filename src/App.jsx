// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Home from './pages/Home';
import Book from './pages/Book';
import Success from './pages/Success';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <Router>
      <div>
        <h1>Welcome to my app Ankit Parashar</h1>
        <h1 className="text-4xl text-red-500 font-bold">Tailwind Test</h1>
      </div>

      <Navbar />

      {!user ? (
        <SignIn setUser={setUser} />
      ) : (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold">Welcome, {user.displayName}</p>
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-16 h-16 rounded-full mx-auto mt-2"
          />
          <button
            onClick={handleSignOut}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
          >
            Sign Out
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
};

export default App;
