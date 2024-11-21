// src/components/ReviewBooking/PriceBreakdown.js
import React from 'react';

function PriceBreakdown() {
  return (
    <div className="price-breakdown">
      <h3>Price Breakdown</h3>
      <p>1 Room x 2 Nights: $400</p>
      <p>Total Discount: -$50</p>
      <p>Price After Discount: $350</p>
      <p>Taxes & Service Fees: $30</p>
      <p><strong>Total Amount: $380</strong></p>
    </div>
  );
}

export default PriceBreakdown;
