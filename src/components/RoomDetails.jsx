import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import NavBar from './NavBar';
import { useAuth } from './AuthContext';
import './RoomDetails.css';

const RoomDetails = () => {
  const location = useLocation();
  const { room } = location.state || {}; // Get room data
  const navigate = useNavigate();
  const { currentUser, onLogout } = useAuth();

  const [reservationDetails, setReservationDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleChange = (e) => {
    setReservationDetails({
      ...reservationDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleReserve = async () => {
    if (!room) return;

    try {
      const bookingData = {
        user: currentUser.uid,
        roomType: room.roomType,
        checkIn: reservationDetails.checkIn,
        checkOut: reservationDetails.checkOut,
        guests: reservationDetails.guests,
        price: room.price,
        reservedAt: new Date(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      toast.info(
        <div>
          <p>Room {room.roomType} is booked! Proceed to payment?</p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => handlePaymentChoice(true)}>Yes</button>
            <button onClick={() => handlePaymentChoice(false)}>No</button>
          </div>
        </div>,
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
        }
      );
    } catch (error) {
      console.error('Error booking room:', error);
      toast.error('Failed to book the room. Please try again.');
    }
  };

  const handlePaymentChoice = (proceedToPayment) => {
    toast.dismiss();
    if (proceedToPayment) {
      navigate('/finance', { state: { room, reservationDetails } });
    } else {
      navigate('/dashboard');
    }
  };

  if (!room) {
    return <p>Room details not found.</p>;
  }

  return (
    <div>
      <NavBar user={currentUser} onLogout={onLogout} />

      <div className="room-details-container">
        <div className="search-form">
          <input type="date" name="checkIn" value={reservationDetails.checkIn} onChange={handleChange} />
          <input type="date" name="checkOut" value={reservationDetails.checkOut} onChange={handleChange} />
          <input type="number" name="guests" value={reservationDetails.guests} onChange={handleChange} min="1" />
          <button onClick={handleReserve}>Reserve</button>
        </div>

        <h1>{room.roomType}</h1>
        <div className="room-details">
          <p>Price per night: R{room.price}</p>
          <p>Description: {room.description}</p>

          <div className="room-images">
            {room.images && room.images.length > 0 ? (
              room.images.map((image, index) => <img key={index} src={image} alt={`Room ${index + 1}`} width="200" />)
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        <button onClick={handleReserve} className="reserve-button">
          Proceed to Reserve
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;
