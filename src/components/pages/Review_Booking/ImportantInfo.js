// src/components/Review_Booking/ImportantInfo.js
import React from 'react';
import PropTypes from 'prop-types';

function ImportantInfo({ bookingDetails }) {
  return (
    <div className="important-info">
      <h3>Important Information</h3>
      <ul className="info-list">
        <li>Check-in time starts at {bookingDetails?.checkIn || '2:00 PM'}</li>
        <li>Check-out time is {bookingDetails?.checkOut || '12:00 PM'}</li>
        <li>Tourism Fee: $8 per night</li>
        <li>100% advance payment required</li>
        <li>Valid government-issued ID required at check-in</li>
        <li>Additional fees may apply for certain amenities</li>
      </ul>
    </div>
  );
}

ImportantInfo.propTypes = {
  bookingDetails: PropTypes.shape({
    checkIn: PropTypes.string,
    checkOut: PropTypes.string
  })
};

ImportantInfo.defaultProps = {
  bookingDetails: {
    checkIn: '2:00 PM',
    checkOut: '12:00 PM'
  }
};

export default ImportantInfo;