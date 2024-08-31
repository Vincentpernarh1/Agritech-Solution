import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function AccountCreation() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateAccount = async (userType) => {
    if(email && password && name) {
      try {
        const response = await axios.post('http://localhost:5000/api/users', {
          name,
          email,
          username,
          password,
          address,
          phoneNumber,
          userType: userType === 'Seller' ? 'Vendor' : 'Buyer'
        });
        console.log('User created successfully:', response.data);
        navigate('/UserProfile');
      } catch (error) {
        console.error('Error creating user:', error);
        setError(error.response.data.message || 'Internal server error');
      }
    }else{
      setErrorMessage('Please enter Email and password.');
    }
    
  };

  return (
    <div className='profile-page'>
    <div className="profile-creation-container">
      <h2>Create Account</h2>
      {errorMessage && <p className="error" color='red'>{errorMessage}</p>}
      {error && <div className="error-message" color='red'>{error}</div>}
      <form className="profile-creation-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Full Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="signup-options">
          <p>Create Account As a ?:</p>
          <button className="vendor-button" onClick={() => handleCreateAccount('Seller')}>
            Seller
          </button>
          <button className="buyer-button" onClick={() => handleCreateAccount('buyer')}>
            Buyer
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default AccountCreation;
