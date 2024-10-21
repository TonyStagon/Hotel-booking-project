// FinancePage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const FinancePage = () => {
  const location = useLocation();
  const { hotel, searchCriteria } = location.state || {};

  if (!hotel || !searchCriteria) {
    return <p>Reservation details are missing. Please go back and try again.</p>;
  }

  return (
    <div className="finance-page">
      <h1>Complete Your Reservation</h1>
      <div className="reservation-details">
        <h2>Hotel: {hotel.name}</h2>
        <p>Location: {hotel.location}</p>
        <p>Price per night: ${hotel.price}</p>
        <p>Check-in: {searchCriteria.checkIn}</p>
        <p>Check-out: {searchCriteria.checkOut}</p>
        <p>Guests: {searchCriteria.guests}</p>
      </div>

      {/* Payment form or options go here */}
      <button onClick={() => alert('Payment processing coming soon!')}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default FinancePage;
