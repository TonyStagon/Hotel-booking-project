import { db } from './firebase'; // Import Firestore correctly
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Import specific Firestore functions

export const addAccommodation = async (data) => {
  try {
    await addDoc(collection(db, 'accommodations'), data); // Adding a document to 'accommodations' collection
  } catch (error) {
    console.error('Error adding accommodation:', error);
  }
};

export const getAccommodations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'accommodations'));
    const accommodations = [];
    querySnapshot.forEach(doc => {
      accommodations.push({ id: doc.id, ...doc.data() });
    });
    return accommodations;
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
};
