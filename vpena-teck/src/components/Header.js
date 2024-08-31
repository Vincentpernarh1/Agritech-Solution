import React, { useState, useEffect, useContext } from 'react';
import { FaShoppingCart, FaEnvelope, FaSearch } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import profileIcon from './logo512.png';
import './Header.css';
import { AuthContext } from '../AuthContext';
import Navbar from './Navbar';

function Header({ cartItems, onSearch}) {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    if (user) {
      setLoggedInUser(user);
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        setLoggedInUser(storedUser);
      }
    }
  }, [user, setUser]);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = event.target.elements.search.value;
    onSearch(searchQuery);
  };

  const handleCartClick = () => {
    try {
      if (loggedInUser) {
        navigate('/cart');
      } else {
        navigate('/create-account');
      }
    } catch (error) {
      console.error('Error handling cart click:', error);
    }
  };

  const handleLogin = () => {
    navigate('/create-account');
  };

  const handleMessageClick = () => {
    navigate('/message');
  };

  const handleUserProfileClick = () => {
    if (loggedInUser) {
      navigate('/userProfile');
    } else {
      navigate('/create-account');
    }
  };

  const handleMenuClickInternal = () => {
    setShowNavbar(!showNavbar);
  };

  const handleseller = () => {
    window.open('/StoreCreation', '_blank');
    //navigate('/StoreCreation');
  };

  return (
    <>
      <header className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="left-side">
          <h1 className="logo"><a href="/#">Vpena Agrik</a></h1>
          <div className="menu" onClick={handleMenuClickInternal}><FiMenu /></div>
        </div>
        <div className="search">
          <form onSubmit={handleSearch} className="flex items-center w-full relative">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="p-2 rounded w-full search-input"
            />
            <button type="submit" className="search-button">
              <FaSearch color="blue" />
            </button>
          </form>
        </div>
        <div className="right-side relative">
          <div className='Seller-button'>
            <button onClick={handleseller}>Sell</button>
          </div>
          <div className="cart-icon-head" onClick={handleCartClick}>
            <FaShoppingCart color='white' />
            <div className="cart-count-head">{cartItems.length > 0 && cartItems.length}</div>
          </div>
          <div className="message-icon" onClick={handleMessageClick}>
            <FaEnvelope color='white' />
          </div>
          {loggedInUser ? (
            <div className="user-profile" onClick={handleUserProfileClick}>
              <img src={profileIcon} alt="Profile" className="profile-icon" />
              <div className="username">{loggedInUser.username}</div>
            </div>
          ) : (
            <div className="user-profile" onClick={handleLogin}>
              <button className='log-in-button'>
                <div>Log in</div>
              </button>
            </div>
          )}
        </div>
      </header>
      {showNavbar && <Navbar />}
    </>
  );
}

export default Header;
