// Reservations.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Import auth from Firebase
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationCollection = await getDocs(collection(db, 'bookings'));
      setReservations(reservationCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchReservations();
  }, []);

  const approveReservation = async (id) => {
    try {
      const reservationDoc = doc(db, 'bookings', id);
      await updateDoc(reservationDoc, { status: 'Approved' });
      setReservations(reservations.map(res => res.id === id ? { ...res, status: 'Approved' } : res));
    } catch (error) {
      console.error("Error approving reservation: ", error);
    }
  };

  const declineReservation = async (id) => {
    try {
      const reservationDoc = doc(db, 'bookings', id);
      await deleteDoc(reservationDoc); // Delete reservation if declined
      setReservations(reservations.filter(res => res.id !== id));
    } catch (error) {
      console.error("Error declining reservation: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Auth
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="reservations-container">
      <nav className="admin-navbar">
        <h2>Admin Dashboard</h2>
        <div className="navbar-links">
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/reservations">Reservations</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <h1>Reservations</h1>
      {reservations.map((reservation) => (
        <div key={reservation.id} className="reservation-item">
          <h3>{reservation.hotelName}</h3>
          <p>Check-in: {reservation.checkIn}</p>
          <p>Check-out: {reservation.checkOut}</p>
          <p>Location: {reservation.location}</p>
          <p>Guests: {reservation.guests}</p>
          <p>Price: ${reservation.price}</p>
          <p>Status: {reservation.status || 'Pending'}</p>
          <button onClick={() => approveReservation(reservation.id)} disabled={reservation.status === 'Approved'}>Approve</button>
          <button onClick={() => declineReservation(reservation.id)} disabled={reservation.status === 'Declined'}>Decline</button>
        </div>
      ))}
    </div>
  );
};

export default Reservations;