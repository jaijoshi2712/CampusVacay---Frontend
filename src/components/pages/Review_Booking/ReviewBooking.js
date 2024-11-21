// src/components/pages/Review_Booking/ReviewBooking.js
import React, { useEffect } from 'react';
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
  
  const { hotelData, bookingDetails } = location.state || {};

  // Redirect if no booking data is present
  useEffect(() => {
    if (!hotelData || !bookingDetails) {
      navigate('/');
    }
  }, [hotelData, bookingDetails, navigate]);

  const handlePayment = () => {
    // Add payment logic here
    console.log('Processing payment...');
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
          />
          <GuestDetails />
        </div>
        // In ReviewBooking.js
<div className="right-section">
  <PriceBreakdown 
    price={bookingDetails.price}
  />
  <CouponSection />
  <ImportantInfo bookingDetails={bookingDetails} /> {/* Pass bookingDetails as prop */}
</div>
      </div>

      <div className="pay-now-container">
        <button 
          onClick={handlePayment}
          className="pay-now-btn"
        >
          Pay Now - ${bookingDetails.price}
        </button>
      </div>
    </div>
  );
}

export default ReviewBooking;