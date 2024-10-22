import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './HotelDetails.css';

const HotelDetails = () => {
  const location = useLocation();
  const { hotel } = location.state || {};
  const navigate = useNavigate();

  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: '',
    checkOut: '',
    location: '',
    guests: 1,
  });

  // Handle input changes in the form
  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  // Handle the 'Proceed to Reserve' button click
  const handleReserve = () => {
    if (!hotel) return; // Ensure hotel data exists

    // Custom notification with buttons for Yes/No
    toast.info(
      <div>
        <p>Hotel {hotel.name} is booked! Do you wish to complete payment?</p>
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
  };

  // Handle the user's choice
  const handlePaymentChoice = (proceedToPayment) => {
    toast.dismiss(); // Close the toast notification
    if (proceedToPayment) {
      // If 'Yes', navigate to the FinancePage
      navigate('/finance', {
        state: { hotel, searchCriteria },
      });
    } else {
      // If 'No', navigate back to the dashboard
      navigate('/dashboard');
    }
  };

  if (!hotel) {
    return <p>Hotel details not found.</p>;
  }

  return (
    <div className="hotel-details-container">
      <div className="search-form">
        <input
          type="date"
          name="checkIn"
          value={searchCriteria.checkIn}
          onChange={handleChange}
          placeholder="Check-in Date"
        />
        <input
          type="date"
          name="checkOut"
          value={searchCriteria.checkOut}
          onChange={handleChange}
          placeholder="Check-out Date"
        />
        <input
          type="text"
          name="location"
          value={searchCriteria.location}
          onChange={handleChange}
          placeholder="Where?"
        />
        <input
          type="number"
          name="guests"
          value={searchCriteria.guests}
          onChange={handleChange}
          placeholder="Number of Guests"
          min="1"
        />
        <button onClick={handleReserve}>Search</button>
      </div>

      <h1>{hotel.name}</h1>
      <div className="hotel-details">
        {hotel.gallery && hotel.gallery.length > 0 ? (
          <img src={hotel.gallery[0]} alt={hotel.name} className="hotel-main-image" />
        ) : (
          <p>No image available</p>
        )}
        <div className="hotel-info">
          <p>Location: {hotel.location}</p>
          <p>Price per night: ${hotel.price}</p>
          <p>Rating: {hotel.rating} stars</p>
          <p>Facilities: {hotel.facilities?.join(', ') || 'Not specified'}</p>
          <p>Policies: {hotel.policies?.join(', ') || 'No policies available'}</p>
        </div>
      </div>

      <div className="reserve-button-container">
        <button onClick={handleReserve} className="reserve-button">
          Proceed to Reserve
        </button>
      </div>
    </div>
  );
};

export default HotelDetails;
