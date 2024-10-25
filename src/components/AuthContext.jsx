import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from './firebase'; // Import your Firebase configuration
import { setPersistence, browserLocalPersistence, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth methods
import { getDoc, doc } from 'firebase/firestore'; // Import Firestore methods for fetching user roles

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state to handle loading

  const login = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid)); // Adjust collection name accordingly
        const userData = userDoc.data();
        setCurrentUser({ ...user, role: userData.role });
      } else {
        setCurrentUser(null); // User is logged out
      }
      setLoading(false); // Set loading to false after checking the auth state
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally render a loading state while Firebase checks auth status
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
