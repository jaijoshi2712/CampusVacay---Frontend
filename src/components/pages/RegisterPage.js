import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './edits.css';
import { FaGoogle } from 'react-icons/fa';

function RegisterPage() {
  // State to track the type of registration (Student or Hotel)
  const [registerType, setRegisterType] = useState('Student');
  
  // Form data initialized based on the registration type
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

  // State for managing messages (success or error) and visibility of password
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  // Updates formData state when input values change
  function handleChange(event) {
    const { name, value, type, files } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value, // Handles file inputs separately
    });
  }

  // Handles form submission
  async function handleSubmit(event) {
    event.preventDefault(); // Prevents default form submission behavior
    setMessage({ type: '', content: '' }); // Resets any previous message

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'university_id_proof' || key === 'hotel_photos') {
        // Appends file data only if it exists
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]); // Appends other data
      }
    });

    try {
      // Sends registration request to appropriate API endpoint based on registration type
      const url = `http://10.18.190.118:8000/${registerType.toLowerCase()}/api/register/`;
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        if (registerType === 'Hotel') {
          navigate('/login'); // Redirect to login on successful hotel registration
        } else {
          setMessage({ type: 'success', content: 'Student registered successfully!' });
        }
      } else {
        // Displays error message on unsuccessful registration
        setMessage({ type: 'error', content: responseData.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      // Catches and displays any network or other errors
      setMessage({ type: 'error', content: 'An error occurred. Please try again.' });
    }
  }

  // Toggles password visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Renders an input field
  const renderField = (name, label, type = 'text', required = true) => (
    <div className="register-field">
      <input
        type={type}
        id={name}
        className="register-input"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        autoComplete="off"
        placeholder={`${label}${required ? ' *' : ''}`}
      />
    </div>
  );

  // Renders a textarea field
  const renderTextarea = (name, label, required = true) => (
    <div className="register-field">
      <textarea
        id={name}
        className="register-input"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        placeholder={`${label}${required ? ' *' : ''}`}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="register-page">
      <div className="register-container">
        {/* Left panel with branding */}
        <div className="register-left-panel">
          <div className="register-logo">
            <span className="logo-part-blue">Campus</span>
            <span className="logo-part-dark">Vacay.</span>
          </div>
        </div>

        {/* Right panel with registration form */}
        <div className="register-right-panel">
          <div className="register-form-container">
            <div className="register-header">
              <h2>{registerType} Account</h2>
              <div className="register-toggle">
                {/* Toggle switch for switching registration type */}
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    className="toggle-checkbox"
                    onChange={() => {
                      setRegisterType(registerType === 'Student' ? 'Hotel' : 'Student'); // Updates type
                      // Updates form data structure based on selected type
                      setFormData(registerType === 'Student'
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
                  <label htmlFor="toggle" className="toggle-label"></label>
                </div>
                <span>{registerType}</span>
              </div>
            </div>

            {/* Form fields for Student registration */}
            {registerType === 'Student' ? (
              <>
                {renderField('username', 'Username')}
                <div className="register-field password-field">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    className="register-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password *"
                    autoComplete="off"
                  />
                  <span className="password-toggle" onClick={toggleVisibility}>
                    {isVisible ? 'Hide' : 'Show'}
                  </span>
                </div>
                {renderField('email', 'Email', 'email')}
                {renderField('first_name', 'First Name')}
                {renderField('last_name', 'Last Name')}
                {renderField('dob', 'Date of Birth', 'date')}
                {renderField('phone_number', 'Phone Number')}
                {renderTextarea('address', 'Address')}
                {renderField('university_name', 'University Name')}
                <div className="register-field">
                  <input
                    type="file"
                    id="university_id_proof"
                    className="register-input"
                    name="university_id_proof"
                    onChange={handleChange}
                    required
                    accept="image/png, image/jpeg, application/pdf"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Form fields for Hotel registration */}
                {renderField('username', 'Username')}
                <div className="register-field password-field">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    className="register-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password *"
                    autoComplete="off"
                  />
                  <span className="password-toggle" onClick={toggleVisibility}>
                    {isVisible ? 'Hide' : 'Show'}
                  </span>
                </div>
                {renderField('email', 'Email', 'email')}
                {renderField('hotel_name', 'Hotel Name')}
                {renderField('phone_number', 'Phone Number')}
                {renderTextarea('address1', 'Address 1')}
                {renderTextarea('address2', 'Address 2 (Optional)', false)}
                {renderTextarea('city', 'City')}
                {renderTextarea('country', 'Country')}
                {renderField('zip', 'Zip')}
              </>
            )}

            <div className="terms-section">
              By signing up you agree to <a href="#">terms and conditions</a>
            </div>

            {/* Registration button */}
            <button type="submit" className="register-button">
              Register
            </button>

            {/* Google Sign-up button */}
            <button type="button" className="google-button">
              <FaGoogle className="google-icon" />
              Sign up with Google
            </button>

            {/* Displays success or error message */}
            {message.content && (
              <div className={`register-message ${message.type === 'success' ? 'success' : 'error'}`}>
                {message.content}
              </div>
            )}

            {/* Link to login page */}
            <div className="login-link">
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegisterPage;