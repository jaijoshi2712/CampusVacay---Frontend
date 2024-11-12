// src/components/pages/ReviewBooking.js
import React from 'react';
import BookingDetails from './BookingDetails';
import PriceBreakdown from './PriceBreakdown';
import GuestDetails from './GuestDetails';
import ImportantInfo from './ImportantInfo';
import CouponSection from './CouponSection';
import './ReviewBooking.css';

function ReviewBooking() {
  return (
    <div className="review-booking">
      {/* CampusVacay Header */}
      <header className="campusvacay-header">
        <div className="logo-container">
          <span className="logo-part1">Campus</span>
          <span className="logo-part2">Vacay.</span>
        </div>
        <h2>Review Your Booking</h2>
      </header>

      {/* Booking Information Section */}
      <div className="content">
        <div className="left-section">
          <BookingDetails />
        </div>
        <div className="right-section">
          <PriceBreakdown />
        </div>
      </div>

      {/* Guest Details Section in Two Columns */}
      <div className="guest-details-container">
        <GuestDetails />
      </div>

      {/* Pay Now Button */}
      <div className="pay-now-container">
        <button className="pay-now-btn">Pay Now - $1200</button>
      </div>
    </div>
  );
}

export default ReviewBooking;
