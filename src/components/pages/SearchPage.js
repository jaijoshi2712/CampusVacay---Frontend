import React, { useState } from 'react';
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

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value
    }));
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
      const response = await fetch('http://10.18.191.34:8000/hotel/api/search/', {
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

      // Update the current page's state instead of navigating
      window.location.reload();
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
          <select
            name="guests"
            value={searchData.guests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Select Guests</option>
            {[1, 2, 3, 4, '5+'].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            value={searchData.location}
            onChange={handleChange}
            placeholder="Enter a city"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
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

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <img 
          src={imageError ? "/api/placeholder/400/300" : (hotel.image || "/api/placeholder/400/300")}
          alt={hotel.name}
          onError={handleImageError}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            ${hotel.price}/night
          </span>
        </div>
        {hotel.student_discount && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              {hotel.student_discount}% Student Discount
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={16} className="mr-2" />
          <span>{hotel.location}</span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">{hotel.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 block">Check-in</span>
              <span className="font-semibold">{hotel.check_in_time}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Check-out</span>
              <span className="font-semibold">{hotel.check_out_time}</span>
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
        
        <button 
          onClick={() => navigate(`/hotel/${hotel.id}`)}
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
            {searchResults.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;