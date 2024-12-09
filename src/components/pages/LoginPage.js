import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loginType, setLoginType] = useState('Student');

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
  
      console.log('Login response data:', data); // Debugging output
  
      setMessage({ type: 'success', content: 'Login successful!' });

      localStorage.setItem('authToken', data.token);
      console.log(loginType);
  
      // Check userType and navigate accordingly
      if (loginType === 'hotel') {
        navigate('/dashboard');
      } else {
        navigate('/'); // Default navigation for non-hotel users
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
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
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a>
        </div>
        <div className="flex items-center justify-between">
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md flex w-full max-w-4xl">
        <div className="w-1/2 bg-cover bg-center rounded-l-lg" style={{backgroundImage: "url('/api/placeholder/600/800')"}}>
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
    </div>
  );
};

export default LoginPage;
