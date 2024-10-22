import React from 'react';
import { useNavigate } from 'react-router-dom'; // Change to useNavigate
import './Account.css'; // Add your styles here

const Account = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle click on grid items
  const handleClick = (route) => {
    navigate(route); // Use navigate for routing
  };

  return (
    <div className="account-container">
      <h1>Account Settings</h1>
      <div className="grid-layout">
        <div className="grid-item" onClick={() => handleClick('/account/personal-info')}>
          <h3>Personal Info</h3>
          <p>View and edit your personal information</p>
        </div>
        <div className="grid-item" onClick={() => handleClick('/account/login-updates')}>
          <h3>Login Updates</h3>
          <p>Manage your login details and security settings</p>
        </div>
        <div className="grid-item" onClick={() => handleClick('/account/upload-picture')}>
          <h3>Upload Profile Picture</h3>
          <p>Update your profile picture</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
