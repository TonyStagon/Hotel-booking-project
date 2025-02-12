import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import './Discover.css';
import NavBar from './NavBar'; // Import NavBar
import { useAuth } from './AuthContext'; // Import authentication context

const Discover = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: '',
    checkOut: '',
    location: '',
    guests: 1,
  });

  const navigate = useNavigate();
  const { currentUser, onLogout } = useAuth(); // Get user authentication state

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelCollection = await getDocs(collection(db, 'hotels'));
      setHotels(hotelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFilteredHotels(hotelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHotels();
  }, []);

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    const { checkIn, checkOut, location, guests } = searchCriteria;
    const filtered = hotels.filter(hotel => {
      const matchesLocation = hotel.location.toLowerCase().includes(location.toLowerCase());
      const matchesGuests = hotel.capacity >= guests;
      return matchesLocation && matchesGuests;
    });
    setFilteredHotels(filtered);
  };

  const handleReserve = (hotel) => {
    navigate(`/hotel/${hotel.id}`, { state: { hotel } });
  };

  return (
    <div className="discover-container">
      {/* Include NavBar */}
      <NavBar user={currentUser} onLogout={onLogout} />

      <h1>Discover Hotels</h1>

      {/* Search Form */}
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

      {/* Display filtered hotels */}
      <div className="hotel-list">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-item">
              <h2>{hotel.name}</h2>
              <p>Location: {hotel.location}</p>
              <p>Price per night: ${hotel.price}</p>
              <p>Rating: {hotel.rating} stars</p>
              <p>
                Facilities: {Array.isArray(hotel.facilities) ? hotel.facilities.join(', ') : 'N/A'}
              </p>
              <p>
                Policies: {Array.isArray(hotel.policies) ? hotel.policies.join(', ') : 'N/A'}
              </p>

              {/* Display Hotel Images */}
              <div className="hotel-gallery">
                {hotel.gallery && hotel.gallery.length > 0 ? (
                  hotel.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Hotel ${hotel.name} - ${index + 1}`}
                      className="hotel-image"
                    />
                  ))
                ) : (
                  <p>No images available for this hotel.</p>
                )}
              </div>

              {/* Reserve Button */}
              <button onClick={() => handleReserve(hotel)}>Reserve</button>
            </div>
          ))
        ) : (
          <p>No hotels found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Discover;
