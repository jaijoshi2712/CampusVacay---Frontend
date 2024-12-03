// src/components/Review_Booking/CouponSection.js
import React, { useState } from 'react';

function CouponSection() {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');

  const handleApplyCoupon = () => {
    // Add coupon validation logic here
    if (couponCode.trim()) {
      setMessage('Applying coupon...');
      // Add API call to validate coupon
    }
  };

  return (
    <div className="coupon-section">
      <h3>Have a Coupon?</h3>
      <div className="coupon-input">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
        />
        <button 
          onClick={handleApplyCoupon}
          className="apply-coupon-btn"
        >
          Apply
        </button>
      </div>
      {message && <p className="coupon-message">{message}</p>}
    </div>
  );
}

export default CouponSection;