import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Check, Star, Phone, Info, AlertTriangle, ArrowLeft, Navigation } from 'lucide-react';

const Header = () => {
  const [token, setToken] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  useEffect(() => {
    setLoginType(localStorage.getItem('type'));
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const url = `http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/logout/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(''),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || JSON.stringify(responseData) || 'Logout failed');
      }

      setMessage({ type: 'success', content: 'Logout successful!' });
      localStorage.removeItem('authToken');
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-3xl font-bold text-blue-700 flex items-center no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </a>
        <div className="flex items-center space-x-4">
          {token && loginType == 'Student' ? (
            <a href="/student/dashboard" className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              Dashboard
            </a>
          ) : token && loginType === 'Hotel' ? (
            <a href="/dashboard" className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              Dashboard
            </a>
          ) : (<div></div>)
          }
          {token ? (
            <button onClick={handleLogout} className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Logout
            </button>
          ) : (
            <a href="/login" className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Login
            </a>
          )}
        </div>
      </div>
      {message.content && (
        <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.content}
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-gray-200 py-6">
    <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-start">
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <a href="#home" className="text-3xl font-bold text-blue-500 flex items-center mb-2 no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </a>
        <p className="text-gray-400 text-sm">We kaboom your beauty holiday instantly and memorable.</p>
      </div>
      <div className="w-full md:w-1/3 text-right">
        <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>Phone: +1-234-567-890</li>
          <li>Email: support@campusvacay.com</li>
          <li>Address: 123 Vacation Lane, Dream City, Holiday State</li>
        </ul>
      </div>
    </div>
  </footer>
);

const CopyrightBar = () => (
  <div className="bg-[#3252DF] text-white h-11 flex items-center justify-center text-center text-sm">
    <p>&copy; {new Date().getFullYear()} CampusVacay. All rights reserved.</p>
  </div>
);

const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelData, searchData } = location.state || {};
  const [selectedRooms, setSelectedRooms] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      console.log(hotelData);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center transition duration-300 ease-in-out"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Search Results
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Hotel Header */}
            <div className="relative h-64 md:h-96">
              <img 
                src={`http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com${hotelData.hotel_photos}`}
                alt={hotelData.hotel_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{hotelData.hotel_name}</h1>
                  {hotelData.average_rating != null && typeof hotelData.average_rating === 'number' && (
                    <div className="flex items-center bg-yellow-400 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-white fill-current" />
                      <span className="ml-1 text-white font-semibold text-sm">{hotelData.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-white text-sm">
                  <MapPin className="mr-2" size={16} />
                  <span>{hotelData.address}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Key Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-lg text-blue-800 mb-2">Contact Information</h3>
                  <div className="flex items-center text-gray-700">
                    <Phone className="mr-2" size={16} />
                    <span>{hotelData.phone_number}</span>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-lg text-orange-800 mb-2">Cancellation Policy</h3>
                  <div className="flex items-start text-gray-700">
                    <AlertTriangle className="mr-2 mt-1 flex-shrink-0" size={16} />
                    <span>{hotelData.cancellation_policy}</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-700 mb-6">{hotelData.description}</p>

                <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
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

              {/* Tourist Spots */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Nearby Tourist Spots</h2>
                <div className="">
                  {hotelData.tourist_spots?.map((spot, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{spot.name}</h3>
                        <p className="text-sm text-gray-600">{spot.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-green-500" />
                          <span className="ml-1 text-green-700 font-medium text-sm">{spot.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{spot.user_ratings_total} reviews</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {hotelData.facilities?.split(',').map((facility, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                      <Check size={14} className="mr-1 text-green-600" />
                      <span>{facility.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Select Your Rooms</h2>
                  {hotelData.student_discount > 0 && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm">
                      <Star size={14} className="mr-1" />
                      <span className="font-medium">{hotelData.student_discount}% Student Discount Available</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {hotelData.rooms.map((room) => {
                    const roomId = room.room_type.toLowerCase().replace(/\s+/g, '-');
                    const quantity = selectedRooms[roomId] || 0;
                    
                    return (
                      <div key={roomId} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{room.room_type}</h3>
                            <p className="text-gray-600 text-sm">Fits up to {room.max_occupancy} guests per room</p>
                            <p className="text-gray-600 text-sm">{room.available_rooms} rooms available</p>
                            
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">Room amenities:</p>
                              <p className="text-gray-600 text-sm">{room.facilities}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">${room.price_per_night}</div>
                            <div className="text-sm text-gray-500">per night</div>
                          </div>
                        </div>

                        <div className="flex justify-end items-center pt-2 border-t">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleRoomQuantityChange(roomId, 'decrement')}
                              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50"
                              disabled={quantity === 0}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">
                              {quantity}
                            </span>
                            <button 
                              onClick={() => handleRoomQuantityChange(roomId, 'increment')}
                              className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50"
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
                    <h2 className="text-2xl font-bold">Guest Reviews</h2>
                    {hotelData.average_rating != null && typeof hotelData.average_rating === 'number' && (
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-medium text-sm text-yellow-700">
                          {hotelData.average_rating.toFixed(1)} Average Rating
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {hotelData.hotel_reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center bg-blue-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-blue-600 fill-current" />
                            <span className="ml-1 font-medium text-sm">{review.rating}</span>
                          </div>
                          <span className="text-gray-500 text-sm ml-3">
                            {formatDate(review.date_added)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary */}
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-inner">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total for {getTotalRooms()} room(s)
                  </div>
                  <div className="flex items-baseline gap-2">
                    {hotelData.student_discount > 0 ? (
                      <>
                        <div className="text-2xl font-bold text-blue-600">
                          ${calculateDiscountedTotal().toFixed(2)}
                        </div>
                        <div className="text-lg text-gray-500 line-through">
                          ${calculateTotalPrice().toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600 ml-1">
                          {hotelData.student_discount}% student discount applied
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-blue-600">
                        ${calculateTotalPrice().toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleProceedToBooking}
                  disabled={getTotalRooms() === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CopyrightBar />
    </div>
  );
};

export default HotelDetails;

