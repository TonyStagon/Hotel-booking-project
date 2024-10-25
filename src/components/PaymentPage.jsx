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

    try {
      // Communicate with backend to create a PaymentIntent
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: hotel.price * searchCriteria.guests * 100, // Convert amount to cents
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm the payment with the client secret received from the backend
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'User Name', // Retrieve this dynamically from your app's state or user context
          },
        },
      });

      if (error) {
        console.error(error);
        alert('Payment failed! Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        // Navigate to confirmation page or display success message
      }
    } catch (error) {
      console.error('Error in payment process:', error);
      alert('Error processing payment. Please try again later.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>Payment for {hotel.name}</h3>
      <p>Location: {hotel.location}</p>
      <p>Check-in: {searchCriteria.checkIn}</p>
      <p>Check-out: {searchCriteria.checkOut}</p>
      <p>Total amount: ${hotel.price * searchCriteria.guests}</p>

      <CardElement className="card-element" />
      <button type="submit" disabled={isProcessing || !stripe}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default PaymentPage;
