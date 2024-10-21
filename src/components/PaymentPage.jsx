import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './PaymentPage.css';

// Load your Stripe public key
const stripePromise = loadStripe('your-public-key-here');

const PaymentPage = ({ hotel, searchCriteria }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm hotel={hotel} searchCriteria={searchCriteria} />
    </Elements>
  );
};

const CheckoutForm = ({ hotel, searchCriteria }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    // Get card details
    const cardElement = elements.getElement(CardElement);

    // Communicate with backend to create a PaymentIntent
    const { error, paymentIntent } = await stripe.confirmCardPayment('client-secret-from-backend', {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'User Name', // Retrieve this from your app's state
        },
      },
    });

    if (error) {
      console.error(error);
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment successful!');
      // Navigate to confirmation page or display success message
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment for {hotel.name}</h3>
      <p>Location: {hotel.location}</p>
      <p>Check-in: {searchCriteria.checkIn}</p>
      <p>Check-out: {searchCriteria.checkOut}</p>
      <p>Total amount: ${hotel.price * searchCriteria.guests}</p>

      <CardElement />
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentPage;
