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
            type={showPassword ? "text" : "password"}
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
          <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
            Forgot Password?
          </a>
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

export default LoginPage;
