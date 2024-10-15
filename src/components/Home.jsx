// src/components/Home.jsx
import React from 'react';
import NavBar from './NavBar'; // Import Navbar
import Footer from './Footer'; // Import Footer
import './Home.css'; // Add CSS styles for Home component

const Home = () => {
  return (
    <div className="home-container">
      <NavBar /> {/* Display the Navbar */}

      <div className="home-content">
        <p>Hotel & Resort</p>
        <h1>Welcome To InnovationHub</h1>
        <button>Discover Now</button>
      </div>

      <Footer /> {/* Display the Footer */}
    </div>
  );
};

export default Home;
