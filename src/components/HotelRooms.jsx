import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import './HotelRooms.css';

const HotelRooms = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const q = query(collection(db, 'rooms'), where('hotelId', '==', hotelId));
      const roomsSnapshot = await getDocs(q);
      const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsList);
    };

    fetchRooms();
  }, [hotelId]);

  const handleReserve = (room) => {
    navigate(`/room/${room.id}`, { state: { room } });  // Pass room data
  };

  return (
    <div className="hotel-rooms-container">
      <h1>Rooms</h1>
      <div className="room-list">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.id} className="room-item">
              <h2>{room.roomType}</h2>
              <p>Price: R{room.price}</p>
              <p>Description: {room.description}</p>
              <div className="room-images">
                {room.images.map((image, index) => (
                  <img key={index} src={image} alt={`Room ${index + 1}`} width="100" />
                ))}
              </div>
              <button onClick={() => handleReserve(room)}>Reserve</button>
            </div>
          ))
        ) : (
          <p>No rooms available for this hotel.</p>
        )}
      </div>
    </div>
  );
};

export default HotelRooms;
