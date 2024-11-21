// src/components/Review_Booking/BookingDetails.js
import React from 'react';

function BookingDetails({ hotelName, location, checkIn, checkOut, guests }) {
  return (
    <div className="booking-details">
      <h3>{hotelName}</h3>
      <p>{location}</p>
      <div className="booking-info">
        <div className="info-item">
          <strong>Check-in:</strong>
          <p>{checkIn}</p>
        </div>
        <div className="info-item">
          <strong>Check-out:</strong>
          <p>{checkOut}</p>
        </div>
        <div className="info-item">
          <strong>Guests:</strong>
          <p>{guests} Guest(s)</p>
        </div>
      </div>
      <div className="room-info">
        <h4>Room Details</h4>
        <p>Standard Room with Bathtub</p>
        <ul className="amenities-list">
          <li>Breakfast Included</li>
          <li>Express check-in</li>
          <li>Non-Refundable</li>
        </ul>
      </div>
    </div>
  );
}

export default BookingDetails;