import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function RegisterPage() {
  const [registerType, setRegisterType] = useState('Student');
  const [formData, setFormData] = useState(
    registerType === 'Student'
      ? {
          username: '',
          password: '',
          first_name: '',
          last_name: '',
          email: '',
          dob: null,
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
          address: '',
          location: '',
          city: '',
          country: '',
          hotel_photos: null,
          phone_number: '',
          description: '',
          facilities: '',
          check_in_time: '',
          check_out_time: '',
          cancellation_policy: '',
          student_discount: '',
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
      const url = `http://3.16.159.54/${registerType.toLowerCase()}/api/register/`;
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

  const renderField = (name, label, type = 'text', helpText = '') => (
    <>
      <h2 className="label-wrapper">
        <label>{label}</label>
        {helpText && <small className="help-text">{helpText}</small>}
      </h2>
      {type === 'textarea' ? (
        <textarea
          id={name}
          className="input input__lg"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          autoComplete="off"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          id={name}
          className="input input__lg"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          autoComplete="off"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <div className='left-panel'>
          <h1>CampusVacay.</h1>
          <div className="flex justify-end mb-4">
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                onChange={() => {
                  setRegisterType(registerType === 'Student' ? 'Hotel' : 'Student');
                  setFormData(registerType === 'Student'
                    ? {
                        username: '',
                        password: '',
                        email: '',
                        hotel_name: '',
                        address: '',
                        location: '',
                        city: '',
                        country: '',
                        hotel_photos: null,
                        phone_number: '',
                        description: '',
                        facilities: '',
                        check_in_time: '',
                        check_out_time: '',
                        cancellation_policy: '',
                        student_discount: '',
                        special_offers: ''
                      }
                    : {
                        username: '',
                        password: '',
                        first_name: '',
                        last_name: '',
                        email: '',
                        dob: null,
                        phone_number: '',
                        address: '',
                        university_name: '',
                        university_id_proof: null
                      }
                  );
                }}
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <span className="text-gray-700">{registerType} Registration</span>
          </div>
        </div>
        <div className='right-panel'>
          <h1>{registerType} Registration</h1>
          {renderField('username', 'Username')}
          <h2 className="label-wrapper">
            <label>Password</label>
          </h2>
          <div>
            <div className='inline-block3'>
              <input
                type={isVisible ? 'text' : 'password'}
                id="password"
                className="input input__lg"
                name="password"
                autoComplete="off"
                value={formData.password}
                onChange={handleChange}
                placeholder="6+ characters"
              />
            </div>
            <div className="inline-block4" onClick={toggleVisibility}>
              {isVisible ? 'Hide' : 'Show'}
            </div>
          </div>
          {renderField('email', 'E-mail', 'email')}
          {registerType === 'Student' ? (
            <>
              {renderField('first_name', 'First Name')}
              {renderField('last_name', 'Last Name')}
              {renderField('dob', 'Date of Birth', 'date')}
              {renderField('phone_number', 'Phone Number')}
              {renderField('address', 'Address')}
              {renderField('university_name', 'University Name')}
              <h2 className="label-wrapper">
                <label>University ID Proof</label>
              </h2>
              <input
                type="file"
                id="university_id_proof"
                className="input input__lg"
                name="university_id_proof"
                onChange={handleChange}
                accept="image/png, image/jpeg, application/pdf"
              />
            </>
          ) : (
            <>
              {renderField('hotel_name', 'Hotel Name')}
              {renderField('address', 'Address', 'textarea')}
              {renderField('location', 'Location')}
              {renderField('city', 'City')}
              {renderField('country', 'Country')}
              <h2 className="label-wrapper">
                <label>Hotel Photos</label>
                <small className="help-text">Upload an image file</small>
              </h2>
              <input
                type="file"
                id="hotel_photos"
                className="input input__lg"
                name="hotel_photos"
                onChange={handleChange}
                accept="image/*"
              />
              {renderField('phone_number', 'Phone Number')}
              {renderField('description', 'General Hotel Description', 'textarea')}
              {renderField('facilities', 'Facilities', 'textarea', 'Comma-separated list of facilities, e.g., Wi-Fi, Pool, Parking')}
              {renderField('check_in_time', 'Check-in Time', 'time')}
              {renderField('check_out_time', 'Check-out Time', 'time')}
              {renderField('cancellation_policy', 'Cancellation Policy', 'textarea')}
              {renderField('student_discount', 'Student Discount (%)', 'number', 'Percentage discount for students')}
              {renderField('special_offers', 'Special Offers')}
            </>
          )}
          <button type="submit" className="btn btn__primary btn__lg">
            Register
          </button>
          {message.content && (
            <div className={`mt-4 p-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.content}
            </div>
          )}
          <div className='btn'>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default RegisterPage;
