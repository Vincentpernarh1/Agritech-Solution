import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import { AuthContext } from '../AuthContext'; // Import AuthContext to access user data

function ProductList({ products }) {
  const { user, setUser } = useContext(AuthContext); // Access user data and setUser function from AuthContext

  // Function to handle storing browsing history
  const handleStoreBrowsingHistory = (productId) => {
    if (user) {
      // Check if user is logged in
      const updatedUser = { ...user, browsingHistory: [...(user.browsingHistory || []), productId] };
      setUser(updatedUser); // Update user state with new browsing history
      // You may also want to store the updated user data in local storage or a backend server for persistence
    }
  };

  return (
    <div className="products-container">
      <h4> PRODUCTS</h4>
      <div className="products-grid">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="product-link" onClick={() => handleStoreBrowsingHistory(product.id)}>
            <div className="product-card">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2" />
              <h3 className="product-name">{product.name}</h3>
              {product.priceRange ? (
                <div className="price-range">
                  <p>{product.priceRange}</p>
                </div>
              ) : (
                <p className="text-green-600">${product.price}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
