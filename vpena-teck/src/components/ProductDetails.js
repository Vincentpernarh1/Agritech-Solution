import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { MdOutlineMessage } from "react-icons/md";
import './ProductDetails.css';

const ProductDetails = ({ products }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const product = products.find(p => p.id === parseInt(productId));

  const [selectedImage, setSelectedImage] = useState(product?.images ? product.images[0] : product?.image);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [selectedsize, setSelectedsize] = useState({});

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images ? product.images[0] : product.image);
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
        if (!user) {
            alert('Please sign in to add items to the cart.');
            navigate('/create-account');
            return;
        }

        // Fetch the current cart data
        let updatedCart = [];
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user.uid}/cart`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart data');
            }
            const data = await response.json();
            updatedCart = data.cart || [];
        } catch (error) {
            console.error('Error fetching cart data:', error);
            alert('Could not update the cart at this time. Please try again later.');
            return; // Stop further execution if fetching cart data fails
        }

        // Check if a size is selected
        const selectedSize = Object.values(selectedsize).find(size => size.selected);
        if (!selectedSize) {
            alert('Please select a size before adding to the cart.');
            return;
        }

        // Check if any variation is selected with a quantity
        const selectedVariationsArray = Object.entries(selectedVariations).filter(([key, variation]) => variation.quantity > 0);
        if (selectedVariationsArray.length === 0) {
            alert('Please select at least one variation with a quantity greater than zero.');
            return;
        }

        // Add selected variations to the cart
        selectedVariationsArray.forEach(([variationKey, selectedVariation]) => {
            // Check for existing cart item with the same product, size, and variation
            const existingCartItem = updatedCart.find(item => 
                item.id === product.id && 
                item.selectedSize.name === selectedSize.name &&
                item.selectedVariation.name === selectedVariation.name
            );

            // Create or update the cart item based on existing item
            if (existingCartItem) {
                existingCartItem.quantity += selectedVariation.quantity; // Increase quantity if item already exists
            } else {
                const cartItem = {
                    ...product,
                    selectedVariation: {
                        name: variationKey, // Ensure the correct variation name is used
                        ...selectedVariation,
                    },
                    selectedSize: {
                        name: selectedSize.name, // Use the selected size name
                        ...selectedSize,
                    },
                    quantity: selectedVariation.quantity,
                };
                updatedCart.push(cartItem);
            }
        });

        // Filter out items with zero quantity
        updatedCart = updatedCart.filter(item => item.quantity > 0);

        // Send the updated cart to the server
        const updateResponse = await fetch(`http://localhost:5000/api/user/${user.uid}/cart`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: updatedCart }),
        });

        if (updateResponse.ok) {
            const responseData = await updateResponse.json();
            setUser(prevUser => ({ ...prevUser, cart: responseData.cart }));
            setSidebarOpen(false); // Close sidebar after adding to cart
        } else {
            console.error('Error updating cart:', updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    }
};


const handleVariationChange = (variation, newQuantity) => {
    setSelectedVariations(prev => ({
        ...prev,
        [variation]: {
            ...prev[variation],
            quantity: Math.max(0, newQuantity), // Ensure quantity doesn't go below 0  
        }
    }));
};

const handleVariationClick = (variation) => {
    setSelectedsize(prev => {
        const isSelected = !prev[variation]?.selected; // Determine if it's being selected or deselected
        return {
            ...prev,
            [variation]: {
                ...prev[variation],
                selected: isSelected,
                size: isSelected ? 1 : 0, // Set state to 1 if selected, otherwise 0
                variation: variation
            }
        };
    });
};


  if (!products || !Array.isArray(products)) {
    return <div>Error: Products data is not available.</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  const reviewCount = product.reviews ? product.reviews.length : 0;
  const featuredProducts = products.filter(p => p.featured);
  const mostSoldProducts = products.slice().sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 7);

  const openNewWindow = url => {
    window.open(url, '_blank');
  };

  const handleMessageClick = () => {
    navigate('/message');
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.keys(selectedVariations).forEach(variationKey => {
      const selectedVariation = selectedVariations[variationKey];
      totalPrice += selectedVariation.quantity * product.price;
      
    });
    return totalPrice;
  };

  console.log("Selected product here",product.name)

  const handleCheckout = () => {
    if (user) {
      const totalPrice = calculateTotalPrice();
      navigate('/Payments', { state: { TotalPrice: totalPrice, productdata : checkoutData} });
    } else if (!user.shippingAddress) {
      alert('Please provide your shipping address to proceed with checkout.');
    } else {
      alert('Proceeding to checkout...');
    }
  };


  const checkoutData =  ({
    name : product.name,
    id: "76832",
    //name: item.name,
    price:productId,
    quantity: 29,
    variation: "green",
    size: "small",
    //image: product.image
});

  

  return (
    <div className="product-details-container">
      <div className="section">
        <div className="left-images">
          <div className="product-info-section">
            <h2 className="product-name">{product.name}</h2>
            <a href="#review-section">Review Count ({reviewCount})</a>
            {user && <a href="/vendor-store">Visit Vendor Store</a>}
          </div>
          <div className="product-main-section">
            <div className="product-gallery">
              {(product.images || [product.image]).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`product-img-${index}`}
                  onClick={() => setSelectedImage(img)}
                  className={`thumbnail ${selectedImage === img ? 'selected' : ''}`}
                />
              ))}
            </div>
            <div className="main-image-container">
              <img src={selectedImage} alt={product.name} className="main-image" />
            </div>
          </div>
        </div>

        <div className="product-info-card">
          <div className="price-range">
            <p>Price :  {`R$${product.price} `}</p>
          </div>

          {product.variations && (
            <div className="variations">
              <h5>Variations</h5>
              {product.variations.colors && product.variations.colors.length > 0 && (
                <div className="colors" onClick={() => setSidebarOpen(true)}>
                  {product.variations.colors.map((color, index) => (
                    <img
                      key={index}
                      src={color.imageUrl}
                      alt={`Color ${index + 1}`}
                      className={`color-thumbnail ${selectedsize[color.name]?.selected ? 'selected' : ''}`}
                      onClick={() => handleVariationClick(color.name, 'color')}
                    />
                  ))}
                </div>
              )}
              {product.variations.sizes && product.variations.sizes.length > 0 && (
                <div className="sizes" onClick={() => setSidebarOpen(true)}>
                  {product.variations.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-button ${selectedVariations[size]?.selected ? 'selected' : ''}`}
                      onClick={() => handleVariationClick(size, 'size')}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="shipping">
            <p>Shipping solutions for the selected quantity are currently unavailable, contact the seller...</p>
            
            <div className='buttons'>
              <button id='order' onClick={() => setSidebarOpen(true)}>Start order </button>
              <button className="add-to-cart" onClick={() => setSidebarOpen(true)}>Add to Cart</button>
              <p onClick={handleMessageClick}><MdOutlineMessage/></p>
             </div>
          </div>

          <div className="protections">
            <h5>Protections for this product</h5>
            <p><strong>Secure payments:</strong> Every payment you make on Alibaba.com is secured with strict SSL encryption and PCI DSS data protection protocols</p>
            <p><strong>Refund policy & Easy Return:</strong> Claim a refund if your order doesn't ship, is missing, or arrives with product issues, plus free local returns for defects</p>
          </div>
        </div>

      </div>
      <div className="product-details-section" id="review-section">
        <h3>Details</h3>
        <p>{product.description}</p>
        <h3>Specifications</h3>
        <ul>
          {product.specifications.map((spec, index) => (
            <li key={index}>{spec}</li>
          ))}
        </ul>
        <h3>Reviews</h3>
        <p>No reviews yet.</p>
      </div>
      <div className="featured-products">
        <h3>Featured Products</h3>
        <div className="product-list">
          {featuredProducts.map(product => (
            <div
              key={product.id}
              className="product"
              onClick={() => openNewWindow(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="most-sold-products">
        <h3>Most Sold Products</h3>
        <div className="product-list">
          {mostSoldProducts.map(product => (
            <div
              key={product.id}
              className="product"
              onClick={() => openNewWindow(`/product/${product.id}`)}
            >
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {sidebarOpen && (
        <div className="order-sidebar">
          <div className="order-sidebar-content">
            <div className="sidebar-header">
              <h3>Select variations and quantity</h3>
              <button className="close-button" onClick={() => setSidebarOpen(false)}>X</button>
            </div>
            <div className="order-options">
              {product.variations && product.variations.colors && (
                <div className="variation-selection">
                  <h4>Colors:</h4>
                  <div className="variation-options">
                    {product.variations.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`color-thumbnail ${selectedsize[color.name]?.selected ? 'selected' : ''}`}
                        onClick={() => handleVariationClick(color.name, 'color')}
                      >
                        <img src={color.imageUrl} alt={`Color ${index + 1}`} />
                        <span>{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {product.variations && product.variations.sizes && (
                  <div className="variation-selection">
                      <h4>Sizes:</h4>
                      {product.variations.sizes.map((size, index) => (
                          <div
                              key={index}
                              className={`size-option ${selectedVariations[size]?.selected ? 'selected' : ''}`}
                              onClick={() => handleVariationClick(size, 'size')}
                          >
                              <span>{size}</span>
                              <div className="quantity-control">
                                  <button onClick={() => handleVariationChange(size, (selectedVariations[size]?.quantity || 0) - 1)}>−</button>
                                  <span>{selectedVariations[size]?.quantity || 0}</span>
                                  <button onClick={() => handleVariationChange(size, (selectedVariations[size]?.quantity || 0) + 1)}>+</button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
              
              <div className="total-price">
                <h4>Total Price: R${calculateTotalPrice()}</h4>
              </div>
              <div className='sidcard-buttons'>
                <button id="order" onClick={handleCheckout}>Order Now</button>
                <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
