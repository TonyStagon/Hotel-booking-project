import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Discover from './components/Discover';
import RoomDetails from './components/RoomDetails'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import FinancePage from './components/FinancePage';
import Account from './components/Account';
import BookNow from './components/BookNow';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Booked from './components/Booked';
import AddRoom from './components/AddRoom';
import PaymentPage from './components/PaymentPage';
import Reservations from './components/Reservations';
import UploadPicture from './components/UploadPicture';
import LoginUpdates from './components/LoginUpdates';
import ViewRooms from './components/ViewRooms';

import HotelRooms from './components/HotelRooms';
import ReserveRoom from './components/ReserveRoom';

const stripePromise = loadStripe('pk_test_51QDhySK00NR3qztWpPut9XbyDJBEXmT5kS30f49cVi7yGoR4QpYuaVObIOILM8UGUwk0V9LNzdGhlxDKNLzZlNY900HE3Mbmjt');

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer />
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/account/upload-picture" element={<UploadPicture />} />

              {/* PROTECTED ROUTES */}
              <Route path="/dashboard" element={<ProtectedRoute userElement={<Dashboard />} />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/admin-dashboard" element={<ProtectedRoute adminElement={<AdminDashboard />} />} />
              <Route path="/add-room/:hotelId" element={<ProtectedRoute userElement={<AddRoom />} />} />
              <Route path="/reservations" element={<AdminProtectedRoute><Reservations /></AdminProtectedRoute>} />
              <Route path="/booked" element={<ProtectedRoute userElement={<Booked />} />} />

              {/* HOTEL & ROOM ROUTES */}
              <Route path="/hotel/:hotelId/rooms" element={<HotelRooms />} />
              <Route path="/room/:roomId" element={<ProtectedRoute userElement={<RoomDetails />} />} />
              <Route path="/reserve/:roomId" element={<ProtectedRoute userElement={<ReserveRoom />} />} />

              {/* OTHER ROUTES */}
              <Route path="/book-now" element={<BookNow />} />
              <Route path="/account/login-updates" element={<LoginUpdates />} />
              <Route path="/account" element={<Account />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/view-rooms/:hotelId" element={<AdminProtectedRoute><ViewRooms /></AdminProtectedRoute>} />

              {/* CATCH-ALL */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Elements>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
