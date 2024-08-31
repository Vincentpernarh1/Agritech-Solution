import React, { useState } from 'react';

function ProductForm({ addProduct }) {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isNew, setIsNew] = useState(true); // New or Used
  const [productImages, setProductImages] = useState([]);
  const [mainImage, setMainImage] = useState(null); // To track the main image
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [discount, setDiscount] = useState('');
  const [variations, setVariations] = useState('');

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductDescriptionChange = (e) => {
    setProductDescription(e.target.value);
  };

  const handleProductPriceChange = (e) => {
    setProductPrice(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
    setMainImage(files[0]); // Set the first uploaded image as the main image
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const handleDiscountChange = (e) => {
    setDiscount(e.target.value);
  };

  const handleVariationsChange = (e) => {
    setVariations(e.target.value);
  };

  const handleMainImageSelect = (image) => {
    setMainImage(image); // Set the selected image as the main image
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      name: productName,
      description: productDescription,
      price: productPrice,
      images: productImages,
      category,
      size,
      discount,
      variations,
      condition: isNew ? 'New' : 'Used',
      mainImage: mainImage, // Include the main image in the product data
    };
    addProduct(product);
    // Reset form fields
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductImages([]);
    setMainImage(null);
    setCategory('');
    setSize('');
    setDiscount('');
    setVariations('');
    setIsNew(true); // Reset to default
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Add a Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={handleProductNameChange}
        className="product-input"
      />
      <textarea
        placeholder="Product Description"
        value={productDescription}
        onChange={handleProductDescriptionChange}
        className="product-textarea"
      />
      <input
        type="number"
        placeholder="Product Price"
        value={productPrice}
        onChange={handleProductPriceChange}
        className="product-input"
      />
      <select value={category} onChange={handleCategoryChange} className="product-input">
        <option value="">Select Category</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="home">Home</option>
        {/* Add more categories as needed */}
      </select>
      <div>
        <label>
          <input
            type="radio"
            value="new"
            checked={isNew}
            onChange={() => setIsNew(true)}
          /> New
        </label>
        <label>
          <input
            type="radio"
            value="used"
            checked={!isNew}
            onChange={() => setIsNew(false)}
          /> Used
        </label>
      </div>
      <textarea
        placeholder="Size (if applicable)"
        value={size}
        onChange={handleSizeChange}
        className="product-textarea"
      />
      <input
        type="text"
        placeholder="Discount (if any)"
        value={discount}
        onChange={handleDiscountChange}
        className="product-input"
      />
      <input
        type="text"
        placeholder="Variations (if any)"
        value={variations}
        onChange={handleVariationsChange}
        className="product-input"
      />
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="product-file-input"
      />
      
      {/* Image Preview Section */}
      <div className="image-preview-container">
        <h3>Image Previews:</h3>
        <div className="image-thumbnails">
          {productImages.length > 0 && (
            <>
              <div className="main-image">
                <h4>Main Image:</h4>
                {mainImage && <img src={URL.createObjectURL(mainImage)} alt="Main" />}
              </div>
              {productImages.map((image, index) => (
                <div key={index} className="thumbnail" onClick={() => handleMainImageSelect(image)}>
                  <img src={URL.createObjectURL(image)} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
      <button type="submit" className="product-submit-button">Add Product</button>
    </form>
  );
}

export default ProductForm;
