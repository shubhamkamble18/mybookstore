/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email/Password Signup
  const signUp = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password sign‑in is not enabled. Please enable Email/Password provider in Firebase console.');
      }
      throw error;
    }
  };

  // Email/Password Login
  const logIn = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password sign‑in is not enabled. Please enable Email/Password provider in Firebase console.');
      }
      throw error;
    }
  };

  // Google OAuth Login
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      // Provide a clearer message for disabled provider
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign‑in is not enabled. Please enable the Google provider in Firebase console.');
      }
      throw error;
    }
  };

  // Global Logout
  const logOut = () => {
    return signOut(auth);
  };

  // Subscribe to persistent Auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    logIn,
    signInWithGoogle,
    logOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
