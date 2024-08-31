import React, { createContext, useState, useEffect } from 'react';
import './AuthContext.css';

// Utility functions to handle user data with timestamp
const saveUserWithTimestamp = (user) => {
  const data = {
    user,
    timestamp: Date.now(),
  };
  localStorage.setItem('user', JSON.stringify(data));
};

const getUserWithExpirationCheck = () => {
  const data = JSON.parse(localStorage.getItem('user'));
  if (data) {
    const now = Date.now();
    const THIRTY_MINUTES = 60 * 60 * 1000;
    if (now - data.timestamp > THIRTY_MINUTES) {
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      return null;
    }
    return data.user;
  }
  return null;
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserWithExpirationCheck();
    if (userData) {
      setUser(userData);
      saveUserWithTimestamp(userData);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    saveUserWithTimestamp(userData);

  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.reload();
};


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
