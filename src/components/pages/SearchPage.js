import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Navigation, Calendar } from 'lucide-react';
import './edits.css';

// SearchBar Component: Handles the input, suggestions, and search functionality
const SearchBar = ({ initialData }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState(initialData || {
    location: '',
    check_in: '',
    check_out: '',
    guests: ''
  });

  const [suggestions, setSuggestions] = useState([]); // Autocomplete suggestions for location input
  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of suggestions dropdown
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteService = useRef(null); // Google Places Autocomplete service
  const wrapperRef = useRef(null); // Reference to detect clicks outside the suggestions dropdown

  // Initialize Google Places Autocomplete service
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

  // Close suggestions dropdown when clicking outside
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

  // Fetch location predictions from Google Places API
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
          const processedSuggestions = predictions.map(prediction => ({
            id: prediction.place_id,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text,
            description: prediction.description,
            types: prediction.types
          }));
          setSuggestions(processedSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  // Handle input changes and fetch autocomplete suggestions for location
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

  // Update location field when a suggestion is clicked
  const handleSuggestionClick = (suggestion) => {
    setSearchData(prev => ({
      ...prev,
      location: suggestion.description
    }));
    setShowSuggestions(false);
  };

  // Submit search query and navigate to search results page
  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const requestBody = { ...searchData };

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
      navigate('/search', { state: { searchResults: data, searchData } });
    } catch (error) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto border border-gray-200">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
        {/* Check-in date input */}
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
        {/* Check-out date input */}
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
        {/* Guests input */}
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
        {/* Location input with autocomplete */}
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
            {/* Suggestions dropdown */}
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
        {/* Submit button */}
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
      {/* Display errors */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchPage;