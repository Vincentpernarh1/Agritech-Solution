// Navbar.js
import React, { useState } from 'react';
import './Navbar.css'; // Import Navbar CSS file

const categories = [
  'Rice', 'Beans', 'Plantain', 'Maize', 'Wheat', 'Soybeans', 'Fruits', 'Vegetables', 'Dairy', 'Poultry'
];

function Navbar() {
  const [showCategories, setShowCategories] = useState(false);

  const handleMenuClick = () => {
    setShowCategories(!showCategories);
  };

  return (
    <nav>
      <ul>
        <li><a href="/#">Home</a></li>
        <li>
          <button className ='category-button' onClick={handleMenuClick}>Categories</button>
          {showCategories && (
            <div className="category-container">
              <ul className="category-list">
                {categories.map((category, index) => (
                  <li key={index}><a href={`/products?category=${category}`}>{category}</a></li>
                ))}
              </ul>
            </div>
          )}
        </li>
        <li><a href="/Education">Education</a></li>
        <li><a href="/News">News</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
