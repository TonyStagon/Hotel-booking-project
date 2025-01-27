// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import NavBar from './NavBar'; // Import Navbar
import Footer from './Footer'; // Import Footer
import './Home.css'; // Add CSS styles for Home component


const Home = () => {
  return (
    <div>
    {/* Navbar is independent of the register-container */}
    <NavBar />
    <div className="home-container">
    

      <div className="home-content">
        <p>Hotel & Resort</p>
        <h1>Welcome To Enviro-Hotel </h1>
        
        {/* Link the button to the Discover page */}
        <Link to="/discover">
          <button className="discover-button">Discover Now</button>
        </Link>
      </div>

      <Footer /> {/* Display the Footer */}
    </div>
    </div>
  );
};

export default Home;