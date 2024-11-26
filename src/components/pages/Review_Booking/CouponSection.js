// src/components/ReviewBooking/CouponSection.js
import React from 'react';

function CouponSection() {
  return (
    <div className="coupon-section">
      <h3>Coupon Codes</h3>
      <input type="text" placeholder="Enter coupon code" />
      <button className="apply-coupon-btn">Apply</button>
    </div>
  );
}

export default CouponSection;
