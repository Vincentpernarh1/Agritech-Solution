// AccountCreation.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './AccountCreation.css';

function AccountCreation() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
      setErrorMessage('');
  
      const response = await axios.post('http://localhost:5000/api/signin', { email, password });
  
      if (response.status === 200 && response.data.user) {
        login(response.data.user);
        navigate('/');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCreateAccount = () => {
    navigate('/profile');
  };

  return (
    <div className='page'>
      <div className="account-creation-container">
      <h2>Log In</h2>
      {errorMessage && <p className="error" color='red'>{errorMessage}</p>}
      {isLoading && <p>Loading...</p>}
      <form className="account-creation-form" onSubmit={handleSignIn}>
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
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="signup-options">
          <button type="submit" className="create-account-button" disabled={isLoading}>
            Sign In
          </button>
          <p>Don't have an account?</p>
          <button type="button" className="submit-button" onClick={handleCreateAccount}>
            Create Account
          </button>
        </div>
      </form>
    </div>
    </div>
    
  );
}

export default AccountCreation;
