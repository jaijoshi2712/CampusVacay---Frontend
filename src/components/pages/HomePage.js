




import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Navigation, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HOTEL_IMAGES = [
  'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
  'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
  'https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg',
  'https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg',
  'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
  'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
  'https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg',
  'https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg',
  'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
  'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg'
];


const Header = () => {
  const [token, setToken] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  
  useEffect(() => {
    function getCSRFToken() {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      console.log(csrfToken);
      localStorage.setItem('csrftoken',csrfToken);
      //return csrfToken;
    }getCSRFToken();
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
      const url = `http://3.16.159.54/student/api/logout/`;
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
        <div className="text-3xl font-bold text-blue-700 flex items-center">
          <Navigation className="mr-2" />
          CampusVacay.
        </div>
        <nav className="hidden md:flex space-x-8 text-lg">
          {['Home', 'Hotels', 'Rooms', 'About', 'Contact'].map((item) => (
            <li key={item} className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              {item}
            </li>
          ))}
          <li className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              <a href="/dashboard">Dashboard</a>

          </li>
        </nav>
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
      {message.content && (
        <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.content}
        </div>
      )}
    </header>
  );
};

const Hero = () => (
  <section className="flex justify-between items-center py-32 px-6 bg-gradient-to-br from-white to-blue-50">
    <div className="max-w-6xl mx-auto flex flex-wrap lg:flex-nowrap items-center w-full">
      <div className="lg:w-1/2 pr-8">
        <h1 className="text-6xl font-bold mb-6 text-gray-800 leading-tight">
          Forget Busy Work,
          <br />
          <span className="text-blue-700">Start Next Vacation</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Where student adventures meet budget-friendly getaways.
          Book smart, travel easy, and create memories that last!
        </p>
        <button className="bg-blue-700 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-800 transition duration-300">
          Show More
        </button>
        <div className="flex space-x-12 mt-10">
          {[
            ['2500', 'Users', '🏨'],
            ['200', 'Treasure', '📸'],
            ['100', 'Cities', '📍']
          ].map(([number, label, emoji]) => (
            <div key={label} className="text-center">
              <div className="text-4xl">{emoji}</div>
              <strong className="text-3xl block font-bold text-blue-700">{number}</strong>
              <span className="text-gray-600 capitalize">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:w-1/2">
        <img
          src={HOTEL_IMAGES[0]}
          alt="Luxury Room"
          className="rounded-2xl shadow-lg object-cover w-full h-80"
        />
      </div>
    </div>
  </section>
);

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
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
      const response = await fetch('http://3.16.159.54/hotel/api/search/', {
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
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-6xl mx-auto -mt-14 relative z-10 border border-gray-200">
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
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center"
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

const PropertyCard = ({ imageIndex, price, name, location, popular }) => {
  const imageSrc = HOTEL_IMAGES[imageIndex % HOTEL_IMAGES.length];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-60 object-cover"
        />
        {popular && (
          <div className="absolute top-4 right-4 bg-blue-700 text-white px-2 py-1 rounded-full text-xs">
            Popular Choice
          </div>
        )}
        <div className="absolute bottom-4 left-4 bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
          ${price} per night
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-sm text-gray-600">{location}</p>
      </div>
    </div>
  );
};

const PropertyGrid = () => {
  const properties = [
    { imageIndex: 0, price: 50, name: "Blue Origin Farms", location: "Galle, Sri Lanka", popular: true },
    { imageIndex: 1, price: 22, name: "Ocean Land", location: "Trincomalee, Sri Lanka" },
    { imageIndex: 2, price: 62, name: "Vinna Villa", location: "Beruwala, Sri Lanka" },
    { imageIndex: 3, price: 856, name: "Stark House", location: "Dehiwala, Sri Lanka" },
    { imageIndex: 4, price: 72, name: "Bobox", location: "Kandy, Sri Lanka" },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Most Picked</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => (
  <div className="bg-gray-50 min-h-screen">
    <Header />
    <Hero />
    <SearchBar />
    <PropertyGrid />
  </div>
);

export default HomePage;
