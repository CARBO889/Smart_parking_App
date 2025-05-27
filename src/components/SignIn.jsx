// src/components/SignIn.js
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

const SignIn = ({ setUser }) => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={handleGoogleSignIn}
        className="bg-white text-black px-6 py-3 rounded-2xl shadow-md hover:bg-gray-100 transition-all"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
