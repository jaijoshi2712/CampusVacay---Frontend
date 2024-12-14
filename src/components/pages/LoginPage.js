import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
      setMessage({ type: 'error', content: error.message || 'An unknown error occurred' });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-blue-700 flex items-center no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </Link>
        <div className="flex items-center space-x-4">
          {token && loginType === 'Student' ? (
            <Link to="/student/dashboard" className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              Dashboard
            </Link>
          ) : token && loginType === 'Hotel' ? (
            <Link to="/dashboard" className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              Dashboard
            </Link>
          ) : null}
          {token ? (
            <button onClick={handleLogout} className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
              Login
            </Link>
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
        <Link to="/" className="text-3xl font-bold text-blue-500 flex items-center mb-2 no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </Link>
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

const LoginForm = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('http://campusvacay-env.eba-mdfmvvfe.us-east-1.elasticbeanstalk.com/student/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      console.log('Login response data:', data);

      setMessage({ type: 'success', content: 'Login successful!' });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('type', type);
      if (type === 'Hotel') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message || 'An unknown error occurred' });
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">{type} Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username/Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            placeholder="Username/email"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {message.content && (
          <div className={`mb-4 p-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.content}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2 leading-tight" />
            <span>Remember me</span>
          </label>
          <Link to="#" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Forgot Password?
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>

      <div className="text-center mt-4">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="font-bold text-blue-500 hover:text-blue-800">
          Create Account
        </Link>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [loginType, setLoginType] = useState('Student');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100 flex items-center justify-center pt-32 pb-16">
        <div className="bg-white p-8 rounded-lg shadow-md flex w-full max-w-4xl">
          <div className="w-1/2 bg-cover bg-center rounded-l-lg" style={{ backgroundImage: "url('/api/placeholder/600/800')" }}>
            <div className="h-full w-full bg-blue-500 bg-opacity-50 flex items-center justify-center rounded-l-lg">
              <h1 className="text-4xl font-bold text-white">CampusVacay.</h1>
            </div>
          </div>
          <div className="w-1/2 p-8">
            <div className="flex justify-end mb-4">
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  onChange={() => setLoginType(loginType === 'Student' ? 'Hotel' : 'Student')}
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <span className="text-gray-700">{loginType} Login</span>
            </div>
            <LoginForm type={loginType} />
          </div>
        </div>
      </main>
      <Footer />
      <CopyrightBar />
    </div>
  );
};

export default LoginPage;

