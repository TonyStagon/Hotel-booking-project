import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Discover from './components/Discover'; // Import Discover page
import HotelDetails from './components/HotelDetails';
import ProtectedRoute from './components/ProtectedRoute';
import FinancePage from './components/FinancePage'; // Your finance page
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discover" element={<Discover />} /> {/* New Discover Route */}
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/dashboard" element={<ProtectedRoute userElement={<Dashboard />} />} />
            <Route path="/finance" element={<FinancePage />} /> {/* Corrected Route */}
            <Route path="/admin-dashboard" element={<ProtectedRoute adminElement={<AdminDashboard />} />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
