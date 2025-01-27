// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import your AuthContext
import NavBar from './NavBar'; // Import NavBar
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Use the login function from AuthContext
  const navigate = useNavigate(); // Get navigate function

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError(null);

    try {
      const user = await login(email, password);
      // After login, navigate based on role
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div>
      <NavBar /> {/* Include the Navbar at the top */}
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};



export default Login;
