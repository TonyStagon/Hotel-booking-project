import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import './HotelDetails.css'; // Add CSS styling for HotelDetails

const HotelDetails = () => {
  const location = useLocation();
  const { hotel } = location.state || {}; // Get hotel data from state
  const navigate = useNavigate(); // Use navigate for redirection

  // Search criteria state
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

  // Handle the search button click
  const handleSearch = () => {
    console.log('Search criteria:', searchCriteria);
    // Add your search logic here, e.g., API call or filtering hotels
  };

  // Handle the 'Proceed to Reserve' button click
  const handleReserve = () => {
    console.log('Proceeding to reserve...');
    // Navigate to FinancePage and pass the hotel and search criteria as state
    navigate('/finance', {
      state: {
        hotel,
        searchCriteria,
      },
    });
  };

  if (!hotel) {
    return <p>Hotel details not found.</p>;
  }

  return (
    <div className="hotel-details-container">
      {/* Search form at the top */}
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
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Hotel details below the search form */}
      <h1>{hotel.name}</h1>
      <div className="hotel-details">
        {/* Check if hotel.gallery exists and has at least one image */}
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

      {/* Proceed to Reserve button */}
      <div className="reserve-button-container">
        <button onClick={handleReserve} className="reserve-button">
          Proceed to Reserve
        </button>
      </div>
    </div>
  );
};

export default HotelDetails;
