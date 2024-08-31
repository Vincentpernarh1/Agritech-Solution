import React from 'react';
import HomePage from './homePage'; // Import HomePage
import ProductList from './ProductList';
import CategoryPage from './CategoryPage';

const CombinedHomePage = ({ product_home, products, user, setUser }) => {
  return (
    <div>
      <div className="section">
        <HomePage product_home={product_home} />
      </div>
      <div className="section">
        <CategoryPage products={products} />
      </div>
      <div className="section" >
        <ProductList products={products} user={user} setUser={setUser} />
      </div>
    </div>
  );
};

export default CombinedHomePage;
