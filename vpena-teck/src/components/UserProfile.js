import React, {useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { AuthContext } from '../AuthContext';
import './UserProfile.css';
import profileIcon from './logo512.png';

function UserProfile() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    if (logout) {
      logout();
    }
    navigate('/create-account');
  }, [logout, navigate, setUser]);
 

  const obfuscateEmail = (email) => {
    if (email.length <= 5) {
      return '*****';
    }
    const visiblePart1 = email.slice(0, 5);
    const visiblePart2 = email.slice(8);

    return `${visiblePart1}***** ${visiblePart2}`;

  };

  return (
    <div className="user-profile-container">
      {user ? (
        <>
          <div className="user-profile-header">
            <div className='image'>
            <div className='profile'>
             <img src={profileIcon} alt="User" className="user-profile-photo" />
             <Link className='link' to="/upload-photo">Upload photo</Link>
             </div>
             <p>Member ID: <h4 className='id'>{user.uid}</h4></p>
            </div>
            <div className='info'>
            <p> Email:<p1 className='shot-email'>  {obfuscateEmail( user.email )}  </p1></p>
            <p>Mobile: <p1 className='shot-phone'>{obfuscateEmail( user.phoneNumber)}</p1></p>
            </div>
          </div>

          <div className="user-profile-sections">
            <div className="user-profile-info">
              <h3>Personal information</h3>
              <ul className="user-profile-list">
                <li><Link to="/my-profile">My profile</Link></li>
                <li><Link to="/privacy-settings">Privacy</Link></li>
              </ul>
            </div>

            <div className="user-profile-info">
              <h3>Account Security</h3>
              <ul className="user-profile-list">
                <li><Link to="/change-email">Change email address</Link></li>
                <li><Link to="/change-password">Change Password</Link></li>
                <li><Link to="/manage-verification-phones">Manage Verification Phones</Link></li>
              </ul>
            </div>

            <div className="user-profile-info">
              <h3>Finance Account</h3>
              <ul className="user-profile-list">
                <li><Link to="/transactions">My transactions</Link></li>
              </ul>
            </div>
          </div>

          <div className="user-profile-logout">
            <button onClick={handleLogout} className="user-profile-button">
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <div className="user-profile-login">
          <p>You are not logged in.</p>
          <button onClick={() => navigate('/create-account')} className="user-profile-button">
            Login or Create Account
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
