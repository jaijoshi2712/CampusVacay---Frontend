// src/components/Review_Booking/PriceBreakdown.js
import React from 'react';

function PriceBreakdown({ price }) {
  // Calculate additional fees
  const taxRate = 0.1; // 10% tax
  const tax = price * taxRate;
  const serviceFee = 20; // Fixed service fee
  const total = price + tax + serviceFee;

  return (
    <div className="price-breakdown">
      <h3>Price Breakdown</h3>
      <div className="price-item">
        <span>Room Rate</span>
        <span>${price}</span>
      </div>
      <div className="price-item">
        <span>Taxes ({taxRate * 100}%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="price-item">
        <span>Service Fee</span>
        <span>${serviceFee}</span>
      </div>
      <div className="price-item total">
        <span>Total Amount</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default PriceBreakdown;