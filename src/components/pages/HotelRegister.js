import React, { useState } from 'react';
import './Register.css';

function HotelRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    nic: '',
    username: '',
    password: '',
    hotelName: '',
    registrationNo: '',
    address: '',
    facilities: ''
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      country: '',
      nic: '',
      username: '',
      password: '',
      hotelName: '',
      registrationNo: '',
      address: '',
      facilities: ''
    })
  }

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
      setIsVisible(!isVisible);
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className="container">
      
      <div className='right-panel'>
        <h1>CampusVacay.</h1>
  
          <h2 className="label-wrapper">
            <label>Name</label>
          </h2>
          <input
            type="text"
            id="name"
            className="input input__lg"
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Enter your Name"
            required
          />
          
          <h2 className="label-wrapper">
            <label>E-mail</label>
          </h2>
          <input
            type="text"
            id="email"
            className="input input__lg"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            placeholder="name@gmail.com"
            required
          />
          <h2 className="label-wrapper">
            <label>Phone NO.</label>
          </h2>
          <input
            type="text"
            id="hotel-phone"
            className="input input__lg"
            name="phone"
            autoComplete="off"
            value={formData.phone}
            onChange={handleChange}
            placeholder="With Country Code"
            required
          />

          <h2 className="label-wrapper">
            <label>Country</label>
          </h2>
          <input
            type="text"
            id="hotel-country"
            className="input input__lg"
            name="country"
            autoComplete="off"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country Name"
            required
          />

          <h2 className="label-wrapper">
            <label>NIC</label>
          </h2>
          <input
            type="text"
            id="nic"
            className="input input__lg"
            name="nic"
            autoComplete="off"
            value={formData.nic}
            onChange={handleChange}
            placeholder="National Identity Card"
            required
          />

          <h2 className="label-wrapper">
            <label>Username</label>
          </h2>
          <input
            type="text"
            id="username"
            className="input input__lg"
            name="username"
            autoComplete="off"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />

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
            required
          /></div>
          <div className="inline-block4" onClick={toggleVisibility}>
            {isVisible ? 'Hide' : 'Show'}
          </div>
          </div>
      
      </div>
      <div className='right-panel'>
        <h1>Register Your Hotel</h1>
        
          <h2 className="label-wrapper">
            <label>Hotel Name</label>
          </h2>
          <input
            type="text"
            id="hotelName"
            className="input input__lg"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Full Name"
            required
          />
          
          <h2 className="label-wrapper">
            <label>Registration No.</label>
          </h2>
          <input
            type="text"
            id="registrationNo"
            className="input input__lg"
            name="registrationNo"
            value={formData.registrationNo}
            onChange={handleChange}
            autoComplete="off"
            placeholder="PVT(Ltd)"
            required
          />
          <h2 className="label-wrapper">
            <label>Address</label>
          </h2>
          <input
            type="text"
            id="address"
            className="input input__lg"
            name="address"
            autoComplete="off"
            value={formData.address}
            onChange={handleChange}
            placeholder="Location"
            required
          />

          <h2 className="label-wrapper">
            <label>Upload Images</label>
          </h2>
          <input
            type="text"
            id="images"
            className="input input__lg"
            name="images"
            autoComplete="off"
            onChange={handleChange}
            placeholder="Upload"
            
          />

          <h2 className="label-wrapper">
            <label>Upload Documents</label>
          </h2>
          <input
            type="text"
            id="documents"
            className="input input__lg"
            name="documents"
            autoComplete="off"
            onChange={handleChange}
            placeholder="Upload"
            
          />

          <h2 className="label-wrapper">
            <label>Facilities</label>
          </h2>
          <input
            type="text"
            id="facilities"
            className="input input__lg"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Describe"
            required
          />

          <button type="submit" className="btn btn__primary btn__lg">
            Register
          </button>
        
        {/*render to login page*/}
        <div className='btn'><a href="">Login</a></div>
        <br/>
      </div>
      
    </div>
    </form>
  );
}


export default HotelRegister;
