import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import './AdminDashboard.css'; // Reuse the same CSS file

const ViewRooms = () => {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const roomsCollection = collection(db, 'rooms');
      const q = query(roomsCollection, where('hotelId', '==', hotelId));
      const querySnapshot = await getDocs(q);
      setRooms(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRooms();
  }, [hotelId]);

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h2>View Rooms</h2>
        <div className="navbar-links">
          <button onClick={() => navigate('/admin-dashboard')} className="logout-button">Back to Dashboard</button>
        </div>
      </nav>

      <h1>Rooms for Hotel ID: {hotelId}</h1>

      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <h3>{room.roomType}</h3>
            <p>Price: R{room.price}</p>
            <p>Description: {room.description}</p>
            <div className="room-images">
              {room.images.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`${room.roomType}-${index}`} width="100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewRooms;