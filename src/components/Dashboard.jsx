// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for navigation
import { Carousel } from 'react-bootstrap'; // Carousel for image slides
import { db, auth } from './firebase'; // Import Firestore database and Firebase auth
import './Dashboard.css'; // Ensure you have styles for your component
import hotelImage1 from '../assets/hotel2.jpg'; // Example of how to import images from assets
import hotelImage2 from '../assets/hotel.jpg';
import hotelImage3 from '../assets/hotel3.jpg';
import hotelImage4 from '../assets/hotel1.jpg';

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch hotels from Firestore when the component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const snapshot = await db.collection('hotels').get();
        const hotelsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelsList);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    // Get the currently logged-in user
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    fetchHotels();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Extract the first letter of the user's email
  const getUserInitial = () => {
    return user?.email ? user.email.charAt(0).toUpperCase() : '';
  };

  // Generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="dashboard-container">
      {/* Custom Navbar section */}
      <nav className="custom-navbar">
        <div className="navbar-brand">Hotel Booking App</div>
        <div className="navbar-links">
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/booked">Booked</NavLink>
          <NavLink to="/book-now">Book Now</NavLink> {/* Add Book Now link here */}
          <NavLink to="/logout">Log out</NavLink>
          {user && (
            <span
              className="user-initial"
              style={{
                backgroundColor: getRandomColor(), // Random color
                borderRadius: '50%', // Make it circular
                width: '30px', // Width of the circle
                height: '30px', // Height of the circle
                display: 'flex', // Center text vertically
                alignItems: 'center', // Center text vertically
                justifyContent: 'center', // Center text horizontally
                color: '#fff', // Text color
                fontWeight: 'bold', // Bold text
                fontSize: '16px', // Font size
              }}
            >
              {getUserInitial()}
            </span>
          )}
        </div>
      </nav>

      <h1>Dashboard</h1>

      {/* Search form and carousel */}
      <div className="carousel-section">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={hotelImage1} alt="Hotel 1" />
            <Carousel.Caption>
              <h3>Norway Resort</h3>
              <p>Take an unforgettable tour of Norway. And rest in our nature-friendly hotel</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={hotelImage2} alt="Hotel 2" />
            <Carousel.Caption>
              <h3>Midrand Riversand</h3>
              <p>Enjoy the best services.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={hotelImage3} alt="Hotel 3" />
            <Carousel.Caption>
              <h3>Italy Reserve</h3>
              <p>Experience the comfort.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img className="d-block w-100" src={hotelImage4} alt="Hotel 4" />
            <Carousel.Caption>
              <h3>The Miracle</h3>
              <p>Feel at home in our cozy rooms.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* List of hotels posted by admin */}
      <div className="hotels-list">
        <h2>Available Hotels</h2>
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-item">
              <h3>{hotel.name}</h3>
              <img
                src={
                  hotel.gallery && hotel.gallery.length > 0
                    ? hotel.gallery[0]
                    : 'https://via.placeholder.com/150'
                }
                alt={hotel.name}
                className="hotel-thumbnail"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
              <p>Location: {hotel.location}</p>
              <p>Price per night: ${hotel.price}</p>
              <p>Rating: {hotel.rating} stars</p>
            </div>
          ))
        ) : (
          <p>No hotels available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
