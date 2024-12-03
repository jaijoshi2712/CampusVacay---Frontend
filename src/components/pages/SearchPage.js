

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Calendar } from 'lucide-react';

const SearchBar = ({ initialData }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(initialData || {
    location: '',
    check_in: '',
    check_out: '',
    guests: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const autocompleteService = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      } else {
        setTimeout(initializeAutocomplete, 500);
      }
    };

    initializeAutocomplete();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPlacePredictions = (input) => {
    if (!input || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    const searchConfig = {
      input,
      componentRestrictions: { country: 'us' }
    };

    autocompleteService.current.getPlacePredictions(
      searchConfig,
      (predictions, status) => {
        if (status === 'OK' && predictions) {
          const processedSuggestions = predictions.map(prediction => {
            const mainText = prediction.structured_formatting.main_text;
            const secondaryText = prediction.structured_formatting.secondary_text;
            
            return {
              id: prediction.place_id,
              mainText: mainText,
              secondaryText: secondaryText,
              description: prediction.description,
              types: prediction.types
            };
          });
          setSuggestions(processedSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'location') {
      fetchPlacePredictions(value);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchData(prev => ({
      ...prev,
      location: suggestion.description
    }));
    setShowSuggestions(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const requestBody = {
      location: searchData.location,
      check_in: searchData.check_in,
      check_out: searchData.check_out,
      guests: searchData.guests
    };

    try {
      const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/hotel/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed');
      }

      navigate('/search', { 
        state: { 
          searchResults: data,
          searchData: searchData 
        } 
      });
    } catch (error) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto border border-gray-200">
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-gray-600">Check Available</label>
          <input
            type="date"
            name="check_in"
            value={searchData.check_in}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-gray-600">Check Out</label>
          <input
            type="date"
            name="check_out"
            value={searchData.check_out}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
            min={searchData.check_in || new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block mb-1 text-gray-600">Guests</label>
          <input
            type="number"
            name="guests"
            value={searchData.guests}
            onChange={handleChange}
            placeholder="Number of guests"
            min="1"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>
        <div className="flex-1 min-w-[200px] relative" ref={wrapperRef}>
          <label className="block mb-1 text-gray-600">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="location"
              value={searchData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-lg p-3 pl-10"
              autoComplete="off"
            />

{showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <div>
                      <div className="text-gray-800">{suggestion.mainText}</div>
                      <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center self-end"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="mr-2" size={18} />
              Search
            </>
          )}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const searchData = location.state?.searchData;

  // Get the lowest price room
  const lowestPriceRoom = hotel.rooms.reduce((min, room) => 
    room.price_per_night < (min?.price_per_night || Infinity) ? room : min
  , null);

  // Calculate maximum occupancy across all room types
  const maxOccupancy = Math.max(...hotel.rooms.map(room => room.max_occupancy));

  const handleImageError = () => {
    setImageError(true);
  };

// In HotelCard component (SearchPage.js)
const handleBooking = () => {
  navigate('/hotel-details', {
    state: {
      hotelData: hotel, // Pass the entire hotel object from API
      searchData
    }
  });
};

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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={imageError ? "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg" : "/api/placeholder/400/300"}
          alt={hotel.hotel_name}
          onError={handleImageError}
          className="w-full h-64 object-cover"
        />
        {lowestPriceRoom && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              From ${lowestPriceRoom.price_per_night}/night
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{hotel.hotel_name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2" />
          <span>{hotel.address}</span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">{hotel.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 block">Check-in</span>
              <span className="font-semibold">{formatTime(hotel.check_in_time)}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Check-out</span>
              <span className="font-semibold">{formatTime(hotel.check_out_time)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Facilities</h4>
          <div className="flex flex-wrap gap-2">
            {hotel.facilities?.split(',').map((facility, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {facility.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2">Available Rooms</h4>
          <div className="space-y-2">
            {hotel.rooms.map((room, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <span className="text-gray-700 font-medium">{room.room_type}</span>
                  <div className="text-sm text-gray-500">
                    Max Occupancy: {room.max_occupancy} guests
                  </div>
                  <div className="text-sm text-gray-500">
                    {room.facilities}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-semibold">
                    ${room.price_per_night}
                  </div>
                  <div className="text-sm text-gray-500">
                    per night
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleBooking}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchResults = location.state?.searchResults || [];
  const initialSearchData = location.state?.searchData;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Back to Home
          </button>
        </div>

        <div className="mb-8">
          <SearchBar initialData={initialSearchData} />
        </div>

        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hotels found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((hotel) => (
  <HotelCard 
    key={hotel.hotel_id} 
    hotel={hotel}  // Pass the complete hotel object
  />
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;