import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase'; // Firebase Firestore and Storage instances
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // For Firebase Storage
import { Link } from 'react-router-dom'; // For navigation links
import './AdminDashboard.css';


const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    gallery: [],
    location: '',
    price: '',
    rating: '',
    facilities: '',
    policies: '',
  });
  const [images, setImages] = useState([]); // State to handle images
  const [uploading, setUploading] = useState(false); // State for uploading progress
  const [editingHotelId, setEditingHotelId] = useState(null); // State to track which hotel is being edited

  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      const hotelCollection = await getDocs(collection(db, 'hotels'));
      setHotels(hotelCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchHotels();
  }, []);

  // Add new hotel
  const addHotel = async () => {
    try {
      setUploading(true);
      const galleryUrls = await uploadImages(images); // Upload images and get their URLs
      const docRef = await addDoc(collection(db, 'hotels'), { ...newHotel, gallery: galleryUrls });
      setHotels([...hotels, { id: docRef.id, ...newHotel, gallery: galleryUrls }]);
      resetForm();
    } catch (error) {
      console.error("Error adding hotel: ", error);
    } finally {
      setUploading(false);
    }
  };

  // Update hotel
  const updateHotel = async () => {
    try {
      setUploading(true);
      let galleryUrls = newHotel.gallery;

      // If new images are provided, upload them and get their URLs
      if (images.length > 0) {
        galleryUrls = await uploadImages(images);
      }

      const hotelDoc = doc(db, 'hotels', editingHotelId);
      await updateDoc(hotelDoc, { ...newHotel, gallery: galleryUrls });
      setHotels(hotels.map(hotel => (hotel.id === editingHotelId ? { ...hotel, ...newHotel, gallery: galleryUrls } : hotel)));
      resetForm();
    } catch (error) {
      console.error("Error updating hotel: ", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHotelId) {
      updateHotel(); // Call update function if editing
    } else {
      addHotel(); // Call add function if adding
    }
  };

  // Edit hotel
  const editHotel = (id) => {
    const hotelToEdit = hotels.find(hotel => hotel.id === id);
    setNewHotel(hotelToEdit);
    setEditingHotelId(id);
  };

  // Delete hotel
  const deleteHotel = async (id) => {
    try {
      await deleteDoc(doc(db, 'hotels', id));
      setHotels(hotels.filter(hotel => hotel.id !== id));
    } catch (error) {
      console.error("Error deleting hotel: ", error);
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Upload images to Firebase Storage and return URLs
  const uploadImages = async (imageFiles) => {
    const imageUrls = await Promise.all(imageFiles.map(async (imageFile) => {
      const storageRef = ref(storage, `hotels/${imageFile.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, imageFile);
      return await getDownloadURL(uploadTask.ref);
    }));
    return imageUrls;
  };

  // Reset form fields
  const resetForm = () => {
    setNewHotel({
      name: '',
      gallery: [],
      location: '',
      price: '',
      rating: '',
      facilities: '',
      policies: '',
    });
    setImages([]);
    setEditingHotelId(null); // Reset editing state
  };

  return (
    <div className="admin-dashboard">
      {/* Navigation Bar */}
      <nav className="admin-navbar">
        <h2>Admin Dashboard</h2>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/add-hotel">Add Hotel</Link>
          <Link to="/manage-hotels">Manage Hotels</Link>
        </div>
      </nav>

      <h1>Manage Hotels</h1>

      {/* Add New Hotel Form */}
      <form onSubmit={handleSubmit}>
        <h2>{editingHotelId ? "Edit Hotel" : "Add New Hotel"}</h2>
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newHotel.location}
          onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price per night"
          value={newHotel.price}
          onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Star Rating"
          value={newHotel.rating}
          onChange={(e) => setNewHotel({ ...newHotel, rating: e.target.value })}
          required
        />
        <textarea
          placeholder="Facilities (comma separated)"
          value={newHotel.facilities}
          onChange={(e) => setNewHotel({ ...newHotel, facilities: e.target.value.split(',').map(f => f.trim()) })} // Ensure trimming of spaces
        />
        <textarea
          placeholder="Policies (comma separated)"
          value={newHotel.policies}
          onChange={(e) => setNewHotel({ ...newHotel, policies: e.target.value.split(',').map(p => p.trim()) })} // Ensure trimming of spaces
        />
        {/* Image upload input */}
        <input type="file" multiple onChange={handleImageChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : (editingHotelId ? 'Update Hotel' : 'Add Hotel')}
        </button>
      </form>

      {/* Display Existing Hotels */}
      <div>
        <h2>Your Hotels</h2>
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-item">
            <h3>{hotel.name}</h3>
            <p>Location: {hotel.location}</p>
            <p>Price: {hotel.price}</p>
            <p>Rating: {hotel.rating}</p>
            <p>
              Facilities: {Array.isArray(hotel.facilities) ? hotel.facilities.join(', ') : 'N/A'}
            </p>
            <p>
              Policies: {Array.isArray(hotel.policies) ? hotel.policies.join(', ') : 'N/A'}
            </p>
            {/* Display images */}
            {hotel.gallery.map((imageUrl, index) => (
              <img key={index} src={imageUrl} alt={`${hotel.name}-${index}`} width="100" />
            ))}
            <button onClick={() => editHotel(hotel.id)}>Edit</button>
            <button onClick={() => deleteHotel(hotel.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
