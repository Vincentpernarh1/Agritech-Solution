import React, { useState } from 'react';
import ProductForm from './ProductForm';
import './StoreCreation.css';

function StoreCreation() {
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [products, setProducts] = useState([]);
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);

  const handleStoreNameChange = (e) => {
    setStoreName(e.target.value);
  };

  const handleStoreDescriptionChange = (e) => {
    setStoreDescription(e.target.value);
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const toggleStoreMenu = () => {
    setStoreMenuOpen(!storeMenuOpen);
  };

  return (
    <div className="store-creation-container">
      <h1>Create Your Store</h1>

      <input
        type="text"
        placeholder="Store Name"
        value={storeName}
        onChange={handleStoreNameChange}
        className="store-name-input"
      />
      
      <textarea
        placeholder="Store Description"
        value={storeDescription}
        onChange={handleStoreDescriptionChange}
        className="store-description-input"
      />
      
      <button onClick={toggleStoreMenu} className="toggle-menu-button">
        {storeMenuOpen ? 'Hide Menu' : 'Show Menu'}
      </button>

      {storeMenuOpen && (
        <div className="store-menu">
          <h2>Store Settings</h2>
          <p>Adjust your store parameters here.</p>
          {/* Add additional parameters or options here */}
        </div>
      )}

      <ProductForm addProduct={addProduct} />
      <div className="product-list">
        <h2>Products in Store:</h2>
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StoreCreation;
