// src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Use NavLink for navigation
import { Carousel } from 'react-bootstrap'; // Carousel for image slides
import { db, auth } from './firebase'; // Import Firestore database and Firebase auth
import './Dashboard.css'; // Ensure you have styles for your component
import hotelImage1 from '../assets/hotel2.jpg'; // Import images from assets
import hotelImage2 from '../assets/hotel.jpg';
import hotelImage3 from '../assets/hotel3.jpg';
import hotelImage4 from '../assets/hotel1.jpg';

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      setUser(currentUser);
    });

    fetchHotels();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Extract the first letter of the user's email
  const getUserInitial = () => user?.email?.charAt(0).toUpperCase() || '';

  // Generate a random color for user initials
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    return `#${Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')}`;
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login'); // Redirect to login after logout
    });
  };

  return (
    <div className="dashboard-container">
      {/* Custom Navbar section */}
      <nav className="custom-navbar">
        <div className="navbar-brand">EnviroHotel</div>
        <div className="navbar-links">
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/booked">Booked</NavLink>
          <NavLink to="/book-now">Book Now</NavLink> {/* Add Book Now link here */}
          <button onClick={handleLogout}>Log out</button> {/* Log out button */}
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

      <h1>WELCOME TO THE DASHBOARD</h1>

      {/* Search form and carousel */}
      <div className="carousel-section">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src={hotelImage1} alt="Hotel 1" />
            <Carousel.Caption>
              <h3>Norway Resort</h3>
              <p>Take an unforgettable tour of Norway. And rest in our nature-friendly hotel.</p>
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
    </div>
  );
};

export default Dashboard;
