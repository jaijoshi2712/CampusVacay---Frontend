import React from 'react';

function BookingDetails({ 
  hotelName, 
  location, 
  checkIn, 
  checkOut, 
  guests,
  roomType,
  roomFacilities
}) {
  return (
    <div className="booking-details">
      <h3>{hotelName || 'Hotel Name'}</h3>
      <p>{location || 'Location'}</p>
      
      <div className="booking-info">
        <div className="info-item">
          <strong>Check-in Date:</strong>
          <p>{checkIn || 'Not specified'}</p>
        </div>
        <div className="info-item">
          <strong>Check-out Date:</strong>
          <p>{checkOut || 'Not specified'}</p>
        </div>
        <div className="info-item">
          <strong>Guests:</strong>
          <p>{guests || 0} Guest(s)</p>
        </div>
      </div>

      <div className="room-info">
        <h4>Room Details</h4>
        <p>{roomType || 'Standard Room'}</p>
        <ul className="amenities-list">
          {roomFacilities ? (
            roomFacilities.split(',').map((facility, index) => (
              <li key={index}>{facility.trim()}</li>
            ))
          ) : (
            <>
              <li>No specific facilities listed</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BookingDetails;