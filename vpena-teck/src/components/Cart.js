import React, { useState, useEffect } from 'react';
import './Cart.css';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Cart({ user }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${user.uid}/cart`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const data = await response.json();
        setCart(data.cart);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchCartData();
    }
  }, [user]);

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId]
    );
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const selectedProducts = cart.filter((item) => selectedItems.includes(item.id));
  const totalPrice = selectedProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const shippingCost = user && user.shippingAddress ? 5.00 : null;

  const handleCheckout = () => {
    if (user) {
        const checkoutData = selectedProducts.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variation: item.selectedVariation.name,
            size: item.selectedSize.variation,
            image: item.image
        }));

        navigate('/Payments', { state: { 
            TotalPrice: totalPrice,
            productdata: checkoutData, 
            shipping: shippingCost || []
        }});
    } else if (!user.shippingAddress) {
        alert('Please provide your shipping address to proceed with checkout.');
    } else {
        alert('Proceeding to checkout...');
    }
  };

  const handleRemoveFromCart = async (productId, variation, size) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.uid}/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, variation, size }), // Send the product details
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const fetchCartData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/user/${user.uid}/cart`);
          if (!response.ok) {
            throw new Error('Failed to fetch cart data');
          }
          const data = await response.json();
          setCart(data.cart);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cart data:', error);
          setError(error.message);
          setLoading(false);
        }
      };

      setMessage('Item removed!');
      fetchCartData();

    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error}</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {!error && <div className="error-message">{message}</div>}
        <div className="cart-icon">
          <FaShoppingCart />
          <h2 className="text-xl font-semibold mb-4">Cart</h2>
          <span className="cart-count">{totalItems}</span>
        </div>

        <div className="cart-content">
          <ul>
            {Array.isArray(cart) && cart.length > 0 ? (
              cart.map((item, index) => (
                <li key={index} className="mb-2">
                  <div className='cart-image-name-checkbox'>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                    <span>
                      <Link to={`/product/${item.id}`} className="product-link">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                      </Link>
                    </span>
                    
                  </div>

                  <div className='cart-image-name'>
                    <Link to={`/product/${item.id}`} className="product-link">
                      <div className='cart-left-side'>
                        <span>{'GH₵'} {item.price.toFixed(2)} x {item.quantity}</span>
                        <span>{item.name}</span>
                        <h12>Variations : {item.selectedVariation.name}, {item.selectedSize.variation}</h12>
                      </div>
                    </Link>
                  </div>
                  <button className="remove-item-button" onClick={() => handleRemoveFromCart(item.id, item.selectedVariation.name, item.selectedSize.name)}>
                    <FaTrash />
                  </button>
                </li>
              ))
            ) : (
              <p>No items in the cart.</p>
            )}
          </ul>
        </div>
      </div>
      <div className="checkout-container">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        {user && user.shippingAddress && (
          <div className="shipping-info">
            <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
            <p>City: {user.shippingAddress.city}</p>
            <p>State: {user.shippingAddress.state}</p>
            <p>Shipping Cost: {shippingCost ? `$${shippingCost.toFixed(2)}` : 'To be estimated'}</p>
            <p>Estimated Delivery Date: {new Date().toLocaleDateString()}</p>
          </div>
        )}
        <div className="cart-total">
          Total: ${(totalPrice + (shippingCost || 0)).toFixed(2)}
        </div>
        <button className="checkout-button" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
