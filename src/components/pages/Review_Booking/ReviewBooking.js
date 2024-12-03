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
    <div className="review-booking">
      <header className="campusvacay-header">
        <div className="logo-container">
          <span className="logo-part1">Campus</span>
          <span className="logo-part2">Vacay.</span>
        </div>
        <h2>Review Your Booking</h2>
      </header>

      <div className="content">
        <div className="left-section">
          <BookingDetails 
            hotelName={hotelData.name}
            location={hotelData.location}
            checkIn={bookingDetails.checkIn}
            checkOut={bookingDetails.checkOut}
            guests={bookingDetails.guests}
            roomType={bookingDetails.room_type}
            roomFacilities={bookingDetails.room_facilities}
          />
          <GuestDetails />
        </div>

        <div className="right-section">
          <PriceBreakdown 
            price={bookingDetails.price}
            numberOfNights={
              Math.ceil(
                (new Date(bookingDetails.checkOut) - new Date(bookingDetails.checkIn)) / 
                (1000 * 60 * 60 * 24)
              ) || 1
            }
          />
          <CouponSection />
          <ImportantInfo 
            bookingDetails={{
              checkIn: hotelData.check_in_time,
              checkOut: hotelData.check_out_time
            }} 
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="pay-now-container">
        <button 
          onClick={handlePayment}
          className="pay-now-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="loading-pulse">Processing...</span>
          ) : (
            `Pay Now - $${bookingDetails.price}`
          )}
        </button>
      </div>
    </div>
  );
}

export default ReviewBooking;