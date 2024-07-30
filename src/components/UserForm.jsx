import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './Hirdaramanilogo.png'; // Adjust the path based on your project structure
import logo1 from './HBeat.jpg'; // Adjust the path based on your project structure

const UserForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Gampaha');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const savedPhone = localStorage.getItem('phone');
    const savedLocation = localStorage.getItem('location');

    if (savedName) setName(savedName);
    if (savedPhone) setPhone(savedPhone);
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    localStorage.setItem('name', name);
    localStorage.setItem('phone', phone);
    localStorage.setItem('location', location);

    try {
      await axios.post('https://helloradio.lk/submit', { name, phone, location, message });
      setSubmitted(true);
      setMessage(''); // Clear only the message input field
      
      setTimeout(() => {
        setSubmitted(false);
      }, 3000); // Reset the submitted state after 3 seconds
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Failed to submit the form');
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  return (
    <>
      <style>
        {`
          .form-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f8f9fa;
            text-align: center;
          }
          .form-card {
            width: 100%;
            max-width: 350px; /* Reduced width */
            padding: 20px;
            margin: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .form-card label {
            font-weight: bold;
          }
          .form-card button {
            width: 100%;
          }
          .logo {
            max-width:70px; /* Reduced image size */
            margin-bottom: 15px;
          }
            .logo1 {
            max-width: 50px; /* Reduced image size */
            margin-bottom: 15px;
          }
          .heading {
            font-size: 1.2rem; /* Adjusted font size */
            margin-bottom: 20px;
          }
          .success-message {
            color: green;
            font-weight: bold;
            margin-top: 10px;
          }
        `}
      </style>
      <div className="form-container">
        
        <img src={logo} alt="Hirdaramani Logo" className="logo" />
      
        <h1 className="heading">H-Beat Radio Live Chat</h1>
        <img src={logo1} alt="Hbeat Logo" className="logo1" />
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name:</label>
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number:</label>
              <input 
                type="text" 
                className="form-control" 
                id="phone" 
                value={phone} 
                onChange={handlePhoneChange} 
                pattern="^\d{10}$" 
                title="Phone number must be 10 digits" 
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Factory Location:</label>
              <select className="form-select" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required>
                <option value="Gampaha">Gampaha</option>
                <option value="Kandy">Kandy</option>
                <option value="Colombo">Colombo</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message:</label>
              <textarea className="form-control" id="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          {submitted && <div className="success-message">Message sent successfully!</div>}
        </div>
      </div>
    </>
  );
};

export default UserForm;
