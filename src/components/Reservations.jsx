// Reservations.jsx

import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

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

  return (
    <div className="reservations-container">
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
