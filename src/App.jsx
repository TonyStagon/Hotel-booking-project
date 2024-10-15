import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from './components/Dashboard'; // Your dashboard component
import Home from './components/Home'; // Home component for landing page
import Login from './components/Login'; // Login component
import './App.css'; // Your global styles

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route for Home as the Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Public Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Public Route for Dashboard (for now, no authentication check) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Default Route to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
