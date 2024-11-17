import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './edits.css';
import { FaGoogle } from 'react-icons/fa';

function RegisterPage() {
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
          university_id_proof: null
        }
      : {
          username: '',
          password: '',
          email: '',
          hotel_name: '',
          phone_number: '',
          address: '',
          location: '',
          city: '',
          country: '',
          hotel_photos: null,
          description: '',
          facilities: '',
          check_in_time: '15:00',
          check_out_time: '11:00',
          cancellation_policy: '',
          student_discount: '0.00',
          special_offers: ''
        }
  );

  const [message, setMessage] = useState({ type: '', content: '' });
  const [isVisible, setIsVisible] = useState(false);

  function handleChange(event) {
    const { name, value, type, files } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: '', content: '' });

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'university_id_proof' || key === 'hotel_photos') {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const url = `https://3.16.159.54/${registerType.toLowerCase()}/api/register/`;
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || JSON.stringify(responseData));
      }

      console.log('Registration successful:', responseData);
      setMessage({ type: 'success', content: 'Registration successful!' });
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ type: 'error', content: error.message });
    }
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

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
        <div className='register-left-panel'>
          <div className="register-logo">
            <span className="logo-part-blue">Campus</span>
            <span className="logo-part-dark">Vacay.</span>
          </div>
        </div>
        <div className='register-right-panel'>
          <div className="register-form-container">
            <div className="register-header">
              <h2>{registerType} Account</h2>
              <div className="register-toggle">
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    className="toggle-checkbox"
                    onChange={() => {
                      setRegisterType(registerType === 'Student' ? 'Hotel' : 'Student');
                      setFormData(registerType === 'Student'
                        ? {
                            username: '',
                            password: '',
                            email: '',
                            hotel_name: '',
                            phone_number: '',
                            address: '',
                            location: '',
                            city: '',
                            country: '',
                            hotel_photos: null,
                            description: '',
                            facilities: '',
                            check_in_time: '15:00',
                            check_out_time: '11:00',
                            cancellation_policy: '',
                            student_discount: '0.00',
                            special_offers: ''
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
                            university_id_proof: null
                          }
                      );
                    }}
                  />
                  <label htmlFor="toggle" className="toggle-label"></label>
                </div>
                <span>{registerType}</span>
              </div>
            </div>

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
                {renderTextarea('address', 'Address')}
                {renderTextarea('location', 'Location', false)}
                {renderTextarea('city', 'City')}
                {renderTextarea('country', 'Country')}
                <div className="register-field">
                  <input
                    type="file"
                    id="hotel_photos"
                    className="register-input"
                    name="hotel_photos"
                    onChange={handleChange}
                    required
                    accept="image/*"
                  />
                </div>
                {renderTextarea('description', 'Description', false)}
                {renderTextarea('facilities', 'Facilities', false)}
                {renderField('check_in_time', 'Check-in Time', 'time')}
                {renderField('check_out_time', 'Check-out Time', 'time')}
                {renderTextarea('cancellation_policy', 'Cancellation Policy', false)}
                {renderField('student_discount', 'Student Discount (%)', 'number', false)}
                {renderField('special_offers', 'Special Offers', 'text', false)}
              </>
            )}

            <div className="terms-section">
              By signing up you agree to <a href="#">terms and conditions</a>
            </div>

            <button type="submit" className="register-button">
              Register
            </button>

            <button type="button" className="google-button">
              <FaGoogle className="google-icon" />
              Sign up with Google
            </button>

            {message.content && (
              <div className={`register-message ${message.type === 'success' ? 'success' : 'error'}`}>
                {message.content}
              </div>
            )}

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