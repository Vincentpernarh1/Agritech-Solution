const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const deleteField = require("firebase/app");


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

// Function to save user data to Firestore
async function saveUserData(userData) {
  try {
    const userDocRef = admin.firestore().collection('users').doc(userData.uid);
    await userDocRef.set(userData, { merge: true });
    console.log('User data saved to Firestore:', userData);
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error;
  }
}

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


// POST endpoint for creating a new user
app.post('/api/users', async (req, res) => {
  const { email, password, ...additionalData } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format', errorCode: 'INVALID_EMAIL' });
  }

  try {
    // Check if user already exists in Firebase Authentication
    try {
      await admin.auth().getUserByEmail(email);
      console.log('User already exists in Firebase Authentication');
      return res.status(400).json({ message: 'User already exists', errorCode: 'USER_EXISTS' });
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    // Prepare user data for Firestore
    const userData = { email, passwordh: await bcrypt.hash(password, 10), uid: userRecord.uid, ...additionalData };

    // Save user data to Firestore using the UID from Firebase Authentication
    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ message: 'User created successfully', user: { email, uid: userRecord.uid } });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.message.includes('Email already exists')) {
      res.status(400).json({ message: error.message, errorCode: 'EMAIL_EXISTS' });
    } else {
      res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
    }
  }
});

// Function to verify user credentials using Firestore
async function verifyUserCredentials(email, password) {
  if (!validateEmail(email)) {
    throw new Error('Invalid email format.');
  }

  try {
    // Retrieve user data from Firestore using the UID from Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    const userDocRef = admin.firestore().collection('users').doc(userRecord.uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log('User not found in Firestore');
      throw new Error('User not found. Please check your email.');
    }

    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.passwordh);
    if (isPasswordValid) {
      console.log('User authentication successful');
      return userData; // Return the user data if authentication is successful
    } else {
      console.log('Password mismatch');
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}


// POST endpoint for user sign-in
// POST endpoint for user sign-in
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify user credentials
    const userData = await verifyUserCredentials(email, password);

    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (error) {
    //console.error('Error signing in:', error);
    if (error.message.includes('User not found') || error.message.includes('Invalid email or password')) {
      // Return 401 Unauthorized status for user not found or invalid credentials
      res.status(401).json({ message: error.message });
    } else if (error.message.includes('User already exists')) {
      // Return 409 Conflict status for user already exists
      res.status(409).json({ message: 'User already exists' });
    } else {
      // Return 500 Internal Server Error for other errors
      res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
    }
  }
});



app.get('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log('User not found in Firestore');
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});




app.put('/api/user/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  const { cart: updatedCart } = req.body;

  if (!Array.isArray(updatedCart)) {
    return res.status(400).json({ message: 'Invalid cart format', errorCode: 'INVALID_CART_FORMAT' });
  }

  try {
    const userDocRef = admin.firestore().collection('users').doc(userId);

    // Replace the cart with the updated cart
    await userDocRef.update({ cart: updatedCart });

    res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});



app.get('/api/user/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    // Print the entire user document
    //console.log('User Document:', userDoc);

    if (!userDoc.exists) {
      console.log('User not found in Firestore');
      return res.status(404).json({ message: 'User not found' });
    }

    // Print the user data
    const userData1 = userDoc.data();

    // Print the cart data
    const cartData = userData1.cart || [];
    //console.log('Cart Data:', cartData);

    res.status(200).json({ cart: cartData });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Internal server error', errorCode: 'INTERNAL_ERROR' });
  }
});


// Endpoint to handle deletion of a product from user's cart
app.delete('/api/user/:userId/cart', async (req, res) => {
  const { productId, variation, size } = req.body;
  const { userId } = req.params;
  //console.log(`Received request to delete product ${productId} for user ${userId}`);

  console.log(`Received request to delete product ${variation} and size ${size}`);

  try {
    // Reference to the user's cart document
    const userCartRef = admin.firestore().collection('users').doc(userId);

    // Fetch the user's cart document
    const userCartDoc = await userCartRef.get();

    // Check if user exists
    if (!userCartDoc.exists) {
      console.log('User not found in Firestore');
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the current cart data
    const userData = userCartDoc.data();
    const cart = userData.cart || [];

    // Filter out the item with the specified productId, variation, and size
    const updatedCart = cart.filter(item => 
      !(item.id === productId &&  item.selectedVariation.name === variation && item.selectedSize.selected)
    );

    // Update the cart in Firestore
    await userCartRef.update({ cart: updatedCart });

    console.log(`Successfully removed product ${productId} from user ${userId}'s cart`);
    res.status(200).send({ message: 'Item removed from cart successfully' });

  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).send({ error: 'Failed to remove item from cart' });
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




