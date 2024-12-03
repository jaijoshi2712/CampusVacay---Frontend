import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Check, Star, Phone, Info, AlertTriangle } from 'lucide-react';

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelData, searchData } = location.state || {};
  const [selectedRooms, setSelectedRooms] = useState({});

  if (!hotelData) {
    navigate('/');
    return null;
  }

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return new Date(2024, 0, 1, hours, minutes).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleRoomQuantityChange = (roomId, action) => {
    setSelectedRooms(prev => {
      const currentQuantity = prev[roomId] || 0;
      let newQuantity = currentQuantity;

      if (action === 'increment') {
        newQuantity = currentQuantity + 1;
      } else if (action === 'decrement' && currentQuantity > 0) {
        newQuantity = currentQuantity - 1;
      }

      return {
        ...prev,
        [roomId]: newQuantity
      };
    });
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedRooms).reduce((total, [roomId, quantity]) => {
      const room = hotelData.rooms.find(r => r.room_type.toLowerCase().replace(/\s+/g, '-') === roomId);
      return total + (room?.price_per_night || 0) * quantity;
    }, 0);
  };

  const calculateDiscountedTotal = () => {
    const totalPrice = calculateTotalPrice();
    const discount = hotelData.student_discount || 0;
    return totalPrice - (totalPrice * (discount / 100));
  };

  const handleProceedToBooking = () => {
    const selectedRoomDetails = Object.entries(selectedRooms)
      .filter(([_, quantity]) => quantity > 0)
      .map(([roomId, quantity]) => {
        const room = hotelData.rooms.find(r => r.room_type.toLowerCase().replace(/\s+/g, '-') === roomId);
        return {
          ...room,
          quantity
        };
      });

    navigate('/review-booking', {
      state: {
        hotelData: {
          ...hotelData,
          selectedRooms: selectedRoomDetails
        },
        bookingDetails: {
          checkIn: searchData?.check_in || '',
          checkOut: searchData?.check_out || '',
          guests: searchData?.guests || '',
          totalPrice: calculateTotalPrice(),
          discountedTotal: calculateDiscountedTotal(),
          rooms: selectedRoomDetails
        }
      }
    });
  };

  const getTotalRooms = () => {
    return Object.values(selectedRooms).reduce((a, b) => a + b, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Search Results
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hotel Header */}
          <div className="relative h-96">
            <img 
              src="/api/placeholder/1200/400"
              alt={hotelData.hotel_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-white">{hotelData.hotel_name}</h1>
                {hotelData.average_rating != null && typeof hotelData.average_rating === 'number' && (
                  <div className="flex items-center bg-yellow-400 px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 text-white fill-current" />
                    <span className="ml-1 text-white font-medium">{hotelData.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-white">
                <MapPin className="mr-2" size={20} />
                <span>{hotelData.address}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Key Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-blue-800 mb-2">Contact Information</h3>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2" size={16} />
                  <span>{hotelData.phone_number}</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-orange-800 mb-2">Cancellation Policy</h3>
                <div className="flex items-start text-gray-600">
                  <AlertTriangle className="mr-2 mt-1 flex-shrink-0" size={16} />
                  <span>{hotelData.cancellation_policy}</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 mb-6">{hotelData.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Check-in time</p>
                  <p className="font-medium text-gray-900">{formatTime(hotelData.check_in_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out time</p>
                  <p className="font-medium text-gray-900">{formatTime(hotelData.check_out_time)}</p>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Facilities</h2>
              <div className="flex flex-wrap gap-3">
                {hotelData.facilities?.split(',').map((facility, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
                    <Check size={16} className="mr-2 text-green-600" />
                    <span>{facility.trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Select Your Rooms</h2>
                {hotelData.student_discount > 0 && (
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center">
                    <Star size={16} className="mr-2" />
                    <span className="font-medium">{hotelData.student_discount}% Student Discount Available</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {hotelData.rooms.map((room) => {
                  const roomId = room.room_type.toLowerCase().replace(/\s+/g, '-');
                  const quantity = selectedRooms[roomId] || 0;
                  
                  return (
                    <div key={roomId} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{room.room_type}</h3>
                          <p className="text-gray-600">Fits up to {room.max_occupancy} guests per room</p>
                          <p className="text-gray-600">{room.available_rooms} rooms available</p>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Room amenities:</p>
                            <p className="text-gray-600">{room.facilities}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${room.price_per_night}</div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>

                      <div className="flex justify-end items-center pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => handleRoomQuantityChange(roomId, 'decrement')}
                            className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            disabled={quantity === 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => handleRoomQuantityChange(roomId, 'increment')}
                            className="w-8 h-8 flex items-center justify-center border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            disabled={quantity >= room.available_rooms}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            {hotelData.hotel_reviews && hotelData.hotel_reviews.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold">Guest Reviews</h2>
                  {hotelData.average_rating != null && typeof hotelData.average_rating === 'number' && (
                    <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium text-yellow-700">
                        {hotelData.average_rating.toFixed(1)} Average Rating
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {hotelData.hotel_reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center bg-blue-100 px-3 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-blue-600 fill-current" />
                          <span className="ml-1 font-medium">{review.rating}</span>
                        </div>
                        <span className="text-gray-500 text-sm ml-4">
                          {formatDate(review.date_added)}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Summary */}
            <div className="flex justify-between items-center p-6 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">
                  Total for {getTotalRooms()} room(s)
                </div>
                <div className="flex items-baseline gap-2">
                  {hotelData.student_discount > 0 ? (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        ${calculateDiscountedTotal().toFixed(2)}
                      </div>
                      <div className="text-lg text-gray-500 line-through">
                        ${calculateTotalPrice().toFixed(2)}
                      </div>
                      <div className="text-sm text-green-600 ml-2">
                        {hotelData.student_discount}% student discount applied
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      ${calculateTotalPrice().toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleProceedToBooking}
                disabled={getTotalRooms() === 0}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;