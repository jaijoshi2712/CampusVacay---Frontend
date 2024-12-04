// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import BookingDetails from './BookingDetails';
// import PriceBreakdown from './PriceBreakdown';
// import GuestDetails from './GuestDetails';
// import CouponSection from './CouponSection';
// import ImportantInfo from './ImportantInfo';
// import './ReviewBooking.css';

// function ReviewBooking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   const { hotelData, bookingDetails } = location.state || {};

//   // Redirect if no booking data is present
//   useEffect(() => {
//     if (!hotelData || !bookingDetails) {
//       navigate('/');
//     }
//   }, [hotelData, bookingDetails, navigate]);

//   const handlePayment = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Add your payment processing logic here
//       console.log('Processing payment...', {
//         hotelData,
//         bookingDetails
//       });

//       // Mock API call
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Navigate to success page or show success message
//       alert('Payment successful!');
//     } catch (err) {
//       setError('Payment failed. Please try again.');
//       console.error('Payment error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!hotelData || !bookingDetails) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900">Review Your Booking</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {/* Hotel Info */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-900">Hotel Details</h2>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="font-medium text-gray-900">{hotelData.name}</h3>
//                   <p className="text-gray-600">{hotelData.location}</p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600">Check-in</p>
//                     <p className="font-medium text-gray-900">{bookingDetails.checkIn}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Check-out</p>
//                     <p className="font-medium text-gray-900">{bookingDetails.checkOut}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Rooms */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-900">Selected Rooms</h2>
//               <div className="space-y-4">
//                 {hotelData.selectedRooms.map((room, index) => (
//                   <div key={index} className="flex justify-between items-start border-b pb-4 last:border-0">
//                     <div>
//                       <h3 className="font-medium text-gray-900">{room.room_type}</h3>
//                       <p className="text-sm text-gray-600">Quantity: {room.quantity}</p>
//                       <p className="text-sm text-gray-600">Max occupancy: {room.max_occupancy} guests per room</p>
//                       <p className="text-sm text-gray-600">{room.facilities}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-gray-900">${room.price_per_night}</p>
//                       <p className="text-sm text-gray-600">per night</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Guest Details */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-900">Guest Details</h2>
//               <GuestDetails />
//             </div>
//           </div>

//           <div className="lg:col-span-1">
//             {/* Price Breakdown */}
//             <div className="bg-white rounded-lg shadow p-6 sticky top-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-900">Price Summary</h2>
//               <PriceBreakdown price={bookingDetails.totalPrice} />
              
//               {/* Coupon Section */}
//               <div className="mt-6">
//                 <CouponSection />
//               </div>

//               {error && (
//                 <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
//                   {error}
//                 </div>
//               )}

//               <button
//                 onClick={handlePayment}
//                 disabled={loading}
//                 className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   `Pay $${bookingDetails.totalPrice}`
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ReviewBooking;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const ReviewBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelData, bookingDetails } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    phone_number: '',
    expected_arrival_time: '',
    special_requests: ''
  });
  const [includeInsurance, setIncludeInsurance] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const makeReservation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock successful payment
      console.log('Payment successful, creating reservation...');
      
      // Create reservation request body
      const reservationData = {
        hotel: hotelData.hotel_id,
        room: bookingDetails.rooms[0].room_id,  // Using first room's ID
        first_name: guestDetails.first_name,
        last_name: guestDetails.last_name,
        email: guestDetails.email,
        country: guestDetails.country,
        phone_number: guestDetails.phone_number,
        expected_arrival_time: guestDetails.expected_arrival_time,
        special_requests: guestDetails.special_requests || '',
        check_in_date: bookingDetails.checkIn,
        check_out_date: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        damage_insurance: includeInsurance,
        stripe_payment_id: 'mock_payment_' + Date.now(),
        amount: bookingDetails.totalPrice,
        payment_status: 'completed'
      };

      console.log('Making API call with data:', reservationData);

      const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create reservation');
      }

      const result = await response.json();
      console.log('Reservation created successfully:', result);
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = async () => {
    // Validate required fields
    const requiredFields = ['first_name', 'last_name', 'email', 'country', 'phone_number', 'expected_arrival_time'];
    const missingFields = requiredFields.filter(field => !guestDetails[field]);

    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    // Proceed with reservation
    await makeReservation();
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="mt-2 text-gray-600">
              A confirmation email has been sent to {guestDetails.email}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hotelData || !bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
              <div className="space-y-2">
                <p className="font-medium">{hotelData.hotel_name}</p>
                <p className="text-gray-600">{hotelData.address}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{bookingDetails.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{bookingDetails.checkOut}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Details Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={guestDetails.first_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={guestDetails.last_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={guestDetails.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={guestDetails.phone_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={guestDetails.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Arrival Time *</label>
                  <input
                    type="time"
                    name="expected_arrival_time"
                    value={guestDetails.expected_arrival_time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                  <textarea
                    name="special_requests"
                    value={guestDetails.special_requests}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Any special requests for your stay?"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Option */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Damage Insurance</h3>
                  <p className="text-sm text-gray-600">Protect against accidental damage during your stay</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
              <div className="space-y-4">
                {bookingDetails.rooms.map((room, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{room.room_type}</p>
                      <p className="text-sm text-gray-600">{room.quantity} room(s) × ${room.price_per_night}</p>
                    </div>
                    <p className="font-medium">${room.quantity * room.price_per_night}</p>
                  </div>
                ))}

                {hotelData.student_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Student Discount</p>
                    <p>-{hotelData.student_discount}%</p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t font-bold">
                  <p>Total Amount</p>
                  <p>${bookingDetails.discountedTotal?.toFixed(2) || bookingDetails.totalPrice?.toFixed(2)}</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
                    <AlertCircle className="mr-2" size={16} />
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePaymentClick}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${bookingDetails.discountedTotal?.toFixed(2) || bookingDetails.totalPrice?.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;