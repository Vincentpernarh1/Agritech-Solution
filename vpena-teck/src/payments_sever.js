const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vpena-agrik-default-rtdb.firebaseio.com' // Replace with your Firebase project URL
});

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

// MoMo API credentials and endpoints
const momoConfig = {
  consumerKey: 'PXFrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxoZFY',
  consumerSecret: 'ARnrXXXXXXXXXXgupm',
  apiUserId: 'YOUR_MOMO_USER_ID', // Add your MoMo API user ID
  primaryKey: 'YOUR_MOMO_PRIMARY_KEY', // Add your MoMo primary key
  targetEnvironment: 'sandbox',
  baseUrl: 'https://sandbox.momodeveloper.mtn.com' // Change to production endpoint when ready
};

// Generate MoMo API token
async function getMomoApiToken() {
  try {
    const response = await axios.post(`${momoConfig.baseUrl}/collection/token/`, {}, {
      headers: {
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey,
        'Authorization': `Basic ${Buffer.from(`${momoConfig.consumerKey}:${momoConfig.consumerSecret}`).toString('base64')}`
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating MoMo API token:', error);
    throw error;
  }
}

// Request to pay using MoMo API
async function requestMomoPayment(amount, currency, externalId, payer, payerMessage, payeeNote) {
  try {
    const token = await getMomoApiToken();
    const response = await axios.post(`${momoConfig.baseUrl}/collection/v1_0/requesttopay`, {
      amount,
      currency,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: payer
      },
      payerMessage,
      payeeNote
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Reference-Id': externalId,
        'X-Target-Environment': momoConfig.targetEnvironment,
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting MoMo payment:', error);
    throw error;
  }
}

// Check MoMo payment status
async function checkMomoPaymentStatus(referenceId) {
  try {
    const token = await getMomoApiToken();
    const response = await axios.get(`${momoConfig.baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': momoConfig.targetEnvironment,
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking MoMo payment status:', error);
    throw error;
  }
}

// Get user name based on phone number
async function getUserName(phoneNumber) {
  try {
    const token = await getMomoApiToken();
    const response = await axios.get(`${momoConfig.baseUrl}/v1_0/account/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey,
        'Content-Type': 'application/json'
      }
    });
    // This is a placeholder endpoint. Replace it with the correct endpoint to get user details.
    return response.data;
  } catch (error) {
    console.error('Error fetching user name:', error);
    throw error;
  }
}

// POST endpoint for initiating MoMo payment
app.post('/api/momo/payment', async (req, res) => {
  const { amount, currency, payer, payerMessage, payeeNote } = req.body;
  const externalId = `txn-${Date.now()}`;

  try {
    const paymentResponse = await requestMomoPayment(amount, currency, externalId, payer, payerMessage, payeeNote);
    res.status(201).json({ message: 'Payment request initiated successfully', referenceId: externalId });
  } catch (error) {
    console.error('Error initiating payment request:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});

// GET endpoint for checking MoMo payment status
app.get('/api/momo/payment/:referenceId', async (req, res) => {
  const { referenceId } = req.params;

  try {
    const paymentStatus = await checkMomoPaymentStatus(referenceId);
    res.status(200).json({ paymentStatus });
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});

// GET endpoint for fetching user name
app.get('/api/momo/username/:phoneNumber', async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const userName = await getUserName(phoneNumber);
    res.status(200).json({ userName });
  } catch (error) {
    console.error('Error fetching user name:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
