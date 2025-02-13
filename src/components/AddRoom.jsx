import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage, auth } from './firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRoom = () => {
  const { hotelId } = useParams(); // Get hotelId from URL
  const navigate = useNavigate();
  
  const [hotelName, setHotelName] = useState(""); // State for hotel name
  const [room, setRoom] = useState({
    roomType: '',
    price: '',
    description: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  // Fetch hotel name based on hotelId
  useEffect(() => {
    const fetchHotelName = async () => {
      if (hotelId) {
        const hotelRef = doc(db, 'hotels', hotelId);
        const hotelSnap = await getDoc(hotelRef);
        if (hotelSnap.exists()) {
          setHotelName(hotelSnap.data().name); // Set hotel name
        } else {
          console.error("Hotel not found");
        }
      }
    };
    fetchHotelName();
  }, [hotelId]);

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length !== 3) {
      setImageError('Please upload exactly 3 images.');
    } else {
      setImageError('');
      setRoom({ ...room, images: selectedImages });
    }
  };

  const uploadImages = async (imageFiles) => {
    const imageUrls = await Promise.all(imageFiles.map(async (imageFile) => {
      const storageRef = ref(storage, `rooms/${imageFile.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, imageFile);
      return await getDownloadURL(uploadTask.ref);
    }));
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (room.images.length !== 3) {
      setImageError('Please upload exactly 3 images.');
      return;
    }
    try {
      setUploading(true);
      const imageUrls = await uploadImages(room.images);
      const roomData = { 
        ...room, 
        images: imageUrls, 
        hotelId, 
        hotelName // Save the hotel name in the rooms collection
      };
      await addDoc(collection(db, 'rooms'), roomData);
      navigate('/admin-dashboard');
    } catch (error) {
      console.error("Error adding room: ", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <h2 className="navbar-brand">Admin Dashboard</h2>
          <div className="navbar-links">
            <Link to="/admin-dashboard" className="nav-link">Dashboard</Link>
            <Link to="/reservations" className="nav-link">Reservations</Link>
          </div>
        </div>
      </nav>

      <div className="add-room container mt-5">
        <h1 className="text-center mb-4">Add Room to <span className="text-primary">{hotelName}</span></h1>
        <form onSubmit={handleSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label className="form-label">Hotel Name</label>
            <input type="text" className="form-control" value={hotelName} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Room Type</label>
            <select
              className="form-select"
              value={room.roomType}
              onChange={(e) => setRoom({ ...room, roomType: e.target.value })}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Price (Rands)</label>
            <div className="input-group">
              <span className="input-group-text">R</span>
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={room.price}
                onChange={(e) => setRoom({ ...room, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Description"
              value={room.description}
              onChange={(e) => setRoom({ ...room, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Upload 3 Images</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {imageError && <p className="text-danger">{imageError}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || room.images.length !== 3}
          >
            {uploading ? 'Uploading...' : 'Add Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
