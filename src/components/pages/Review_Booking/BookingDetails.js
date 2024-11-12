// src/components/ReviewBooking/BookingDetails.js
import React from 'react';

function BookingDetails() {
  return (
    <div className="booking-details">
      <h3>Blue Origin Fams</h3>
      <p>Galle, Sri Lanka</p>
      <p><strong>Check-in:</strong> Nov 12, 2024, 2 PM</p>
      <p><strong>Check-out:</strong> Nov 14, 2024, 12 PM</p>
      <p><strong>Guests:</strong> 1 Adult | 1 Room</p>
      <div className="room-info">
        <h4>Standard Room with Bathtub</h4>
        <p>Breakfast, Express check-in</p>
        <p>Non-Refundable</p>
      </div>
    </div>
  );
}

export default BookingDetails;
