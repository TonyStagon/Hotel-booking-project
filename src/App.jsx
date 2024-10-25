import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Discover from './components/Discover'; // Import Discover page
import HotelDetails from './components/HotelDetails';
import ProtectedRoute from './components/ProtectedRoute';
import FinancePage from './components/FinancePage'; // Your finance page
import Account from './components/Account'; // Import Account component
import BookNow from './components/BookNow'; // Make sure you have this component
import { AuthProvider, useAuth } from './components/AuthContext'; // Import useAuth hook
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Booked from './components/Booked'; // Import Booked component
import PaymentPage from './components/PaymentPage'; // Import PaymentPage

function App() {
  const { currentUser } = useAuth(); // Access currentUser from AuthContext

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer />
          <Routes>
            {/* Conditionally redirect to dashboard if logged in */}
            <Route 
              path="/" 
              element={currentUser ? <Navigate to="/dashboard" /> : <Home />} 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/dashboard" element={<ProtectedRoute userElement={<Dashboard />} />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute adminElement={<AdminDashboard />} />} />
            <Route path="/book-now" element={<BookNow />} />
            <Route path="/account" element={<Account />} />
            <Route path="/booked" element={<ProtectedRoute userElement={<Booked />} />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
