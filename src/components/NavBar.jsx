// src/components/NavBar.jsx
import React from 'react';
import './NavBar.css'; // Importing the new styles

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="innovation-hub">Innovation Hub</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
        <li><a className="book-now-btn" href="/book-now">Book Now</a></li>
        <li>
          <input
            type="text"
            placeholder="Search"
            style={{
              padding: '5px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
