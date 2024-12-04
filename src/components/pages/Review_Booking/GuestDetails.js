// src/components/Review_Booking/GuestDetails.js
import React, { useState } from 'react';

function GuestDetails() {
  const [guestData, setGuestData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    arrivalTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="guest-details">
      <h3>Guest Details</h3>
      <form className="guest-details-form">
        <div className="form-columns">
          <div className="left-column">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={guestData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={guestData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={guestData.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="right-column">
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={guestData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={guestData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                required
              />
            </div>
            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                name="specialRequests"
                value={guestData.specialRequests}
                onChange={handleChange}
                placeholder="Any special requests..."
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GuestDetails;