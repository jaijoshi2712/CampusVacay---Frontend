// src/components/pages/GuestDetails.js
import React from 'react';

function GuestDetails() {
  return (
    <div className="guest-details">
      <h3>Guest Details</h3>
      <form className="guest-details-form">
        <div className="left-column">
          <label>First Name</label>
          <input type="text" placeholder="Enter First Name" />

          <label>Last Name</label>
          <input type="text" placeholder="Enter Last Name" />

          <label>Email</label>
          <input type="email" placeholder="Enter Email" />

          <label>Country</label>
          <input type="text" placeholder="Enter Country" />

          <label>Expected Arrival Time</label>
          <input type="time" />
        </div>

        <div className="right-column">
          <label>Phone Number</label>
          <input type="tel" placeholder="Enter Phone Number" />

          <label>Special Requests</label>
          <textarea placeholder="Any special requests..." rows="2.7"></textarea>

          <label>Damage Insurance</label>
          <select>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>Amount</label>
          <input type="number" placeholder="Amount" step="0.01" />

          <label>Check-out Date</label>
          <input type="date" />
        </div>
      </form>
    </div>
  );
}

export default GuestDetails;
