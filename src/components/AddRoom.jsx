import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css'; // Reusing the same CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

const AddRoom = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({
    roomType: '',
    price: '',
    description: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

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
      const roomData = { ...room, images: imageUrls, hotelId };
      await addDoc(collection(db, 'rooms'), roomData);
      navigate(`/admin-dashboard`);
    } catch (error) {
      console.error("Error adding room: ", error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out: ", error);
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
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>
      </nav>

      <div className="add-room container mt-5">
        <h1 className="text-center mb-4">Add Room to Hotel</h1>
        <form onSubmit={handleSubmit} className="card p-4 shadow">
          <div className="mb-3">
            <label htmlFor="roomType" className="form-label">Room Type</label>
            <select
              id="roomType"
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
            <label htmlFor="price" className="form-label">Price (Rands)</label>
            <div className="input-group">
              <span className="input-group-text">R</span>
              <input
                type="number"
                id="price"
                className="form-control"
                placeholder="Price"
                value={room.price}
                onChange={(e) => setRoom({ ...room, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-control"
              placeholder="Description"
              value={room.description}
              onChange={(e) => setRoom({ ...room, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="images" className="form-label">Upload 3 Images</label>
            <input
              type="file"
              id="images"
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