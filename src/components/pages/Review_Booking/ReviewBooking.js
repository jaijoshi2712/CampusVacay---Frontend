import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingDetails from './BookingDetails';
import PriceBreakdown from './PriceBreakdown';
import GuestDetails from './GuestDetails';
import CouponSection from './CouponSection';
import ImportantInfo from './ImportantInfo';
import './ReviewBooking.css';

function ReviewBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { hotelData, bookingDetails } = location.state || {};

  // Redirect if no booking data is present
  useEffect(() => {
    if (!hotelData || !bookingDetails) {
      navigate('/');
    }
  }, [hotelData, bookingDetails, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Add your payment processing logic here
      console.log('Processing payment...', {
        hotelData,
        bookingDetails
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to success page or show success message
      alert('Payment successful!');
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!hotelData || !bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Review Your Booking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Hotel Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{hotelData.name}</h3>
                  <p className="text-gray-600">{hotelData.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium text-gray-900">{bookingDetails.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium text-gray-900">{bookingDetails.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Rooms */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Selected Rooms</h2>
              <div className="space-y-4">
                {hotelData.selectedRooms.map((room, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div>
                      <h3 className="font-medium text-gray-900">{room.room_type}</h3>
                      <p className="text-sm text-gray-600">Quantity: {room.quantity}</p>
                      <p className="text-sm text-gray-600">Max occupancy: {room.max_occupancy} guests per room</p>
                      <p className="text-sm text-gray-600">{room.facilities}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${room.price_per_night}</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Guest Details</h2>
              <GuestDetails />
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Price Summary</h2>
              <PriceBreakdown price={bookingDetails.totalPrice} />
              
              {/* Coupon Section */}
              <div className="mt-6">
                <CouponSection />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${bookingDetails.totalPrice}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewBooking;