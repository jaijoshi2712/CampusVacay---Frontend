import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { Navigation } from 'lucide-react';
import './edits.css';

function RegisterPage() {
  const [token, setToken] = useState(null);
  const [loginType, setLoginType] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerMessage, setHeaderMessage] = useState({ type: '', content: '' });
  const [registerType, setRegisterType] = useState('Student');
  const [formData, setFormData] = useState(
    registerType === 'Student'
      ? {
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          dob: '',
          phone_number: '',
          address: '',
          university_name: '',
          university_id_proof: null,
        }
      : {
          username: '',
          password: '',
          email: '',
          hotel_name: '',
          phone_number: '',
          address1: '',
          address2: '',
          city: '',
          country: '',
          zip: '',
        }
  );
  const [registerMessage, setRegisterMessage] = useState({ type: '', content: '' });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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

      setHeaderMessage({ type: 'success', content: 'Logout successful!' });
      localStorage.removeItem('authToken');
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      setHeaderMessage({ type: 'error', content: error.message });
    }
  };

  function handleChange(event) {
    const { name, value, type, files } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setRegisterMessage({ type: '', content: '' });

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'university_id_proof' || key === 'hotel_photos') {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = `http://10.18.190.118:8000/${registerType.toLowerCase()}/api/register/`;
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        if (registerType === 'Hotel') {
          navigate('/login');
        } else {
          setRegisterMessage({ type: 'success', content: 'Student registered successfully!' });
        }
      } else {
        setRegisterMessage({ type: 'error', content: responseData.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setRegisterMessage({ type: 'error', content: 'An error occurred. Please try again.' });
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header (from older code) */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="text-3xl font-bold text-blue-700 flex items-center no-underline">
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
        {headerMessage.content && (
          <div className={`fixed top-16 right-8 p-4 rounded-lg ${headerMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {headerMessage.content}
          </div>
        )}
      </header>

      {/* Main Content (Registration Form) */}
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{registerType} Account</h1>
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() => {
                      setRegisterType(registerType === 'Student' ? 'Hotel' : 'Student');
                      setFormData(
                        registerType === 'Student'
                          ? {
                              username: '',
                              password: '',
                              email: '',
                              hotel_name: '',
                              phone_number: '',
                              address1: '',
                              address2: '',
                              city: '',
                              country: '',
                              zip: '',
                            }
                          : {
                              username: '',
                              password: '',
                              email: '',
                              first_name: '',
                              last_name: '',
                              dob: '',
                              phone_number: '',
                              address: '',
                              university_name: '',
                              university_id_proof: null,
                            }
                      );
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3252DF]"></div>
                </label>
                <span className="text-sm font-medium text-gray-600">{registerType}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username *"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    placeholder="Password *"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {isVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email *"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                    required
                  />
                </div>
                {registerType === 'Student' ? (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="First Name *"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name *"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="Hotel Name *"
                        name="hotel_name"
                        value={formData.hotel_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone Number *"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {registerType === 'Student' ? (
                  <>
                    <div>
                      <input
                        type="date"
                        placeholder="Date of Birth *"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone Number *"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Address *"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="University Name *"
                        name="university_name"
                        value={formData.university_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        name="university_id_proof"
                        onChange={handleChange}
                        accept="image/png, image/jpeg, application/pdf"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#3252DF] hover:file:bg-blue-100"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <textarea
                        placeholder="Address 1 *"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Address 2 (Optional)"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        rows={3}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="City *"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Country *"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="ZIP Code *"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3252DF] focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="text-sm text-center text-gray-600">
                By signing up you agree to <a href="#" className="text-[#3252DF] hover:underline">terms and conditions</a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3252DF] text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 border border-gray-200 bg-white text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaGoogle className="text-[#3252DF]" />
                <span>Sign up with Google</span>
              </button>

              {registerMessage.content && (
                <div
                  className={`p-4 rounded-lg ${
                    registerMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {registerMessage.content}
                </div>
              )}

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#3252DF] hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer (from older code) */}
      <footer className="bg-gray-800 text-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-start">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <a href="/" className="text-3xl font-bold text-blue-500 flex items-center mb-2 no-underline">
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

      {/* Copyright Bar (from older code) */}
      <div className="bg-[#3252DF] text-white h-11 flex items-center justify-center text-center text-sm">
        <p>&copy; {new Date().getFullYear()} CampusVacay. All rights reserved.</p>
      </div>
    </div>
  );
}

export default RegisterPage;

