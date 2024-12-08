import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QTTD8ER4O8rsbmLHpV5QJT6foTDYrS8TMYl157Ev3hBJmWK2yKrFq3oBvyOxgMiUs8jbghkPMcB4CZl4mF2DoHC00CdOwtBcF');

// Payment Form Component
const PaymentForm = ({ clientSecret, onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      onError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="mb-4" />
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </span>
        ) : (
          `Pay $${amount}`
        )}
      </button>
    </form>
  );
};

const ReviewBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelData, bookingDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [guestDetails, setGuestDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    phone_number: '',
    expected_arrival_time: '',
    special_requests: ''
  });
  const [includeInsurance, setIncludeInsurance] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInitiatePayment = async () => {
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'country', 'phone_number', 'expected_arrival_time'];
    const missingFields = requiredFields.filter(field => !guestDetails[field]);

    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Store reservation data
      const reservationData = {
        hotel: hotelData.hotel_id,
        room: 17,
        first_name: guestDetails.first_name,
        last_name: guestDetails.last_name,
        email: guestDetails.email,
        country: guestDetails.country,
        phone_number: guestDetails.phone_number,
        expected_arrival_time: guestDetails.expected_arrival_time,
        special_requests: guestDetails.special_requests || '',
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        damage_insurance: includeInsurance,
        amount: bookingDetails.totalPrice
      };

      localStorage.setItem('pendingReservation', JSON.stringify(reservationData));

      // Create payment intent
      const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/payment/create-payment-intent/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round((bookingDetails.discountedTotal || bookingDetails.totalPrice) * 100), // Convert to cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const { client_secret } = await response.json();
      setClientSecret(client_secret);

    } catch (error) {
      setError(error.message || 'Failed to initialize payment');
      console.error('Payment initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const pendingReservation = JSON.parse(localStorage.getItem('pendingReservation'));

      // Create reservation with payment details
      const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          ...pendingReservation,
          payment_status: paymentIntent.status,
          stripe_payment_id: paymentIntent.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      // Clear pending reservation
      localStorage.removeItem('pendingReservation');
      
      // Navigate to success page
      navigate('/booking-success');

    } catch (error) {
      setError('Failed to complete reservation. Please contact support.');
      console.error('Reservation error:', error);
    }
  };

  if (!hotelData || !bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{hotelData.hotel_name}</p>
                <p className="text-gray-600">{hotelData.address}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{bookingDetails.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{bookingDetails.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={guestDetails.first_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={guestDetails.last_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={guestDetails.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={guestDetails.phone_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={guestDetails.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Arrival Time *</label>
                  <input
                    type="time"
                    name="expected_arrival_time"
                    value={guestDetails.expected_arrival_time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <textarea
                    name="special_requests"
                    value={guestDetails.special_requests}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Any special requests for your stay?"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Option */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Damage Insurance</h3>
                  <p className="text-sm text-gray-600">Protect against accidental damage during your stay</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
              <div className="space-y-4">
                {bookingDetails.rooms.map((room, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{room.room_type}</p>
                      <p className="text-sm text-gray-600">{room.quantity} room(s) × ${room.price_per_night}</p>
                    </div>
                    <p className="font-medium">${room.quantity * room.price_per_night}</p>
                  </div>
                ))}

                {hotelData.student_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Student Discount</p>
                    <p>-{hotelData.student_discount}%</p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t font-bold">
                  <p>Total Amount</p>
                  <p>${bookingDetails.discountedTotal?.toFixed(2) || bookingDetails.totalPrice?.toFixed(2)}</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    {error}
                  </div>
                )}

{clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={setError}
                      amount={bookingDetails.discountedTotal?.toFixed(2) || bookingDetails.totalPrice?.toFixed(2)}
                    />
                  </Elements>
                ) : (
                  <button
                    onClick={handleInitiatePayment}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </span>
                    ) : (
                      `Pay $${bookingDetails.discountedTotal?.toFixed(2) || bookingDetails.totalPrice?.toFixed(2)}`
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;