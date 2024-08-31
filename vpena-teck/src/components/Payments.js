import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Payments.css'; // Import the CSS file

const Payment = () => {
  const location = useLocation();
  const { TotalPrice: totalPrice, productdata, shipping } = location.state || {}; // Get additional data from state
  const [TotalPrice, setTotalPrice] = useState(totalPrice || '');
  const [currency, setCurrency] = useState('Vpena tech'); // Default currency, change if necessary
  const [payer, setPayer] = useState('');
  const [payerMessage, setPayerMessage] = useState('');
  const [payeeNote, setPayeeNote] = useState('');
  const [referenceId, setReferenceId] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(true); // State to toggle product visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/momo/payment', {
        TotalPrice,
        payer,
        payerMessage,
        payeeNote
      });

      setReferenceId(response.data.referenceId);
      setStatus('Payment request initiated successfully.');
    } catch (error) {
      setError('Error initiating payment request. Please try again.');
    }
  };

  const checkPaymentStatus = async () => {
    if (!referenceId) {
      setError('No reference ID found. Please initiate a payment first.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/momo/payment/${referenceId}`);
      setStatus(`Payment status: ${response.data.paymentStatus.status}`);
    } catch (error) {
      setError('Error checking payment status. Please try again.');
    }
  };

  const toggleProducts = () => {
    setShowProducts(!showProducts);
  };

  return (
    <div className="page">
      <div className="payment-form-container">
        <h2>MTN MoMo Payment</h2>
        <button onClick={toggleProducts}>
          {showProducts ? 'Hide Products' : 'Show Products'}
        </button>
        {showProducts && (
          <div className="product-name">
            <div className='product-details'>
              {productdata && productdata.length > 0 ? (
                productdata.map((item, index) => (
                  <div key={index} className="product-item">
                    <img src={item.image} alt={item.name} className="product-image" />
                    <p><strong>Product Name:</strong> {item.name} , <strong>Price:</strong> {item.price}, <strong>Quantity:</strong> {item.quantity}, <strong>Variation:</strong> {item.variation} ,<strong>Size:</strong> {item.size}</p>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        )}

      <div className='total-amount'>
        <label>Total Amount:</label>
        <h5>GH₵{totalPrice}</h5>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Currency:</label>
            <input
              type="text"
              placeholder={currency}
              className="form-input"
              onChange={(e) => setCurrency(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Payer (phone number):</label>
            <input
              type="text"
              value={payer}
              className="form-input"
              onChange={(e) => setPayer(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Ghana Card ID:</label>
            <input
              type="text"
              value={payeeNote}
              className="form-input"
              onChange={(e) => setPayeeNote(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Payer Message:</label>
            <input
              type="text"
              value={payerMessage}
              className="form-input"
              onChange={(e) => setPayerMessage(e.target.value)}
            />
          </div>
          <button type="submit">Pay Now</button>
        </form>

        {status && <p className="status">{status}</p>}
        {error && <p className="error">{error}</p>}

        {referenceId && (
          <div>
            <button onClick={checkPaymentStatus}>Check Payment Status</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
