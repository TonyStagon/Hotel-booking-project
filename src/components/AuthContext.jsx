// src/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { auth, db } from './firebase'; // Make sure to import your Firebase configuration
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid)); // Adjust collection name accordingly
      const userData = userDoc.data();

      setCurrentUser({ ...user, role: userData.role }); // Set the current user with role
      return { ...user, role: userData.role }; // Return user data including role
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
