import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CombinedHomePage from './components/CombinedHomePage';
import AccountCreation from './components/AccountCreation';
import ProfilePage from './components/ProfilePage';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';
import ProductDetails from './components/ProductDetails';
import Message from './components/Message';
import CategoryPage from './components/CategoryPage';
import Payments from './components/Payments';
import './index.css';
import { AuthContext } from './AuthContext';
import StoreCreation from './Seller/Components/StoreCreation';
// import ProductForm from './Seller/styles/ProductForm';


function App() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const { user: authUser, setUser: setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${authUser.uid}/cart`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const data = await response.json();
        setCart(data.cart);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      }
    };

    if (authUser) {
      fetchCartData();
    } else {
      setLoading(false); // Stop loading if there's no authenticated user
    }
  }, [authUser]);

  const handleSearch = (searchQuery) => {
    console.log('Search query:', searchQuery);
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  const product_home = [
    {
      id: 1,
      name: 'Organic Fertilizer',
      price: 19.99,
      image: 'https://picsum.photos/200?random=21',
      description: 'Natural organic fertilizer for healthy plant growth and soil enrichment.',
      specifications: ['Organic', 'Nutrient-rich', 'Environmentally friendly'],
      category: 'Fertilizers',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=1' },
          { name: 'Brown', imageUrl: 'https://picsum.photos/50?random=2' },
        ],
        sizes: ['1kg', '5kg', '10kg'],
      },
    },
    {
      id: 2,
      name: 'Garden Tools Set',
      price: 29.99,
      image: 'https://picsum.photos/200?random=22',
      description: 'Complete set of essential garden tools for gardening enthusiasts and professionals.',
      specifications: ['Durable construction', 'Ergonomic design', 'Includes shovel, rake, pruner, and more'],
      category: 'Tools & Equipment',
      variations: {
        colors: [
          { name: 'Red', imageUrl: 'https://picsum.photos/50?random=3' },
          { name: 'Blue', imageUrl: 'https://picsum.photos/50?random=4' },
        ],
        sizes: ['Small', 'Medium', 'Large'],
      },
    },
    {
      id: 3,
      name: 'Vegetable Seeds Pack',
      price: 9.99,
      image: 'https://picsum.photos/200?random=23',
      description: 'Assorted pack of high-quality vegetable seeds for home gardening and urban farming.',
      specifications: ['Variety of vegetable seeds', 'Non-GMO', 'Suitable for all climates'],
      category: 'Seeds',
      variations: {
        colors: [
          { name: 'Assorted', imageUrl: 'https://picsum.photos/50?random=5' },
        ],
        sizes: ['Small pack', 'Medium pack', 'Large pack'],
      },
    },
    {
      id: 4,
      name: 'Automatic Irrigation System',
      price: 79.99,
      image: 'https://picsum.photos/200?random=24',
      description: 'Efficient automatic irrigation system with customizable settings for watering plants and lawns.',
      specifications: ['Programmable timer', 'Adjustable drip emitters', 'Easy installation'],
      category: 'Irrigation',
      variations: {
        colors: [
          { name: 'Black', imageUrl: 'https://picsum.photos/50?random=6' },
          { name: 'White', imageUrl: 'https://picsum.photos/50?random=7' },
        ],
        sizes: ['50ft', '100ft', '150ft'],
      },
    },
    {
      id: 5,
      name: 'Greenhouse Kit',
      price: 249.99,
      image: 'https://picsum.photos/200?random=25',
      description: 'Complete greenhouse kit for cultivating plants year-round, featuring durable construction and UV-resistant panels.',
      specifications: ['Sturdy aluminum frame', 'Polycarbonate panels', 'Ventilation windows'],
      category: 'Greenhouses',
      variations: {
        colors: [
          { name: 'Silver', imageUrl: 'https://picsum.photos/50?random=8' },
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=9' },
        ],
        sizes: ['6x6', '8x10', '10x12'],
      },
    },
    {
      id: 6,
      name: 'Organic Pest Control Spray',
      price: 14.99,
      image: 'https://picsum.photos/200?random=26',
      description: 'Natural and eco-friendly pest control spray for protecting plants from insects and pests.',
      specifications: ['Safe for plants', 'Biodegradable', 'Easy-to-use spray bottle'],
      category: 'Pest Control',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=10' },
          { name: 'Yellow', imageUrl: 'https://picsum.photos/50?random=11' },
        ],
        sizes: ['500ml', '1L', '2L'],
      },
    },
    {
      id: 7,
      name: 'Compost Bin',
      price: 39.99,
      image: 'https://picsum.photos/200?random=27',
      description: 'Large capacity compost bin for recycling kitchen and garden waste into nutrient-rich compost.',
      specifications: ['Durable plastic construction', 'Aeration holes', 'Easy-access lid'],
      category: 'Composting',
      variations: {
        colors: [
          { name: 'Black', imageUrl: 'https://picsum.photos/50?random=12' },
          { name: 'Brown', imageUrl: 'https://picsum.photos/50?random=13' },
        ],
        sizes: ['50L', '100L', '200L'],
      },
    },
    {
      id: 8,
      name: 'Seedling Starter Trays',
      price: 12.99,
      image: 'https://picsum.photos/200?random=28',
      description: 'Reusable seedling starter trays for germinating seeds and growing seedlings indoors or outdoors.',
      specifications: ['Sturdy construction', 'Multiple cells', 'Drainage holes'],
      category: 'Propagation',
      variations: {
        colors: [
          { name: 'Black', imageUrl: 'https://picsum.photos/50?random=14' },
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=15' },
        ],
        sizes: ['6 cells', '12 cells', '24 cells'],
      },
    },
    {
      id: 9,
      name: 'Pruning Shears',
      price: 16.99,
      image: 'https://picsum.photos/200?random=29',
      description: 'Sharp and durable pruning shears for trimming branches, cutting stems, and shaping plants.',
      specifications: ['High-carbon steel blades', 'Comfortable grip handles', 'Safety lock mechanism'],
      category: 'Tools & Equipment',
      variations: {
        colors: [
          { name: 'Red', imageUrl: 'https://picsum.photos/50?random=16' },
          { name: 'Black', imageUrl: 'https://picsum.photos/50?random=17' },
        ],
        sizes: ['Small', 'Medium', 'Large'],
      },
    },
    {
      id: 10,
      name: 'Soil pH Tester',
      price: 8.99,
      image: 'https://picsum.photos/200?random=30',
      description: 'Handheld soil pH tester for measuring the acidity or alkalinity of soil to ensure optimal conditions for plant growth.',
      specifications: ['Easy-to-read display', 'Simple operation', 'No batteries required'],
      category: 'Testing & Monitoring',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=18' },
          { name: 'Yellow', imageUrl: 'https://picsum.photos/50?random=19' },
        ],
        sizes: ['10cm probe', '20cm probe', '30cm probe'],
      },
    },
    {
      id: 11,
      name: 'Plant Growth Stimulant',
      price: 17.99,
      image: 'https://picsum.photos/200?random=31',
      description: 'Liquid plant growth stimulant formulated to promote vigorous growth, flowering, and fruiting.',
      specifications: ['Fast-acting formula', 'Rich in nutrients', 'Enhances root development'],
      category: 'Fertilizers',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=20' },
          { name: 'Clear', imageUrl: 'https://picsum.photos/50?random=21' },
        ],
        sizes: ['500ml', '1L', '2L'],
      },
    },
    {
      id: 12,
      name: 'Insect Traps',
      price: 6.99,
      image: 'https://picsum.photos/200?random=32',
      description: 'Sticky insect traps for capturing and monitoring flying pests in greenhouses, gardens, and orchards.',
      specifications: ['Non-toxic adhesive', 'Attracts various insects', 'Weatherproof'],
      category: 'Pest Control',
      variations: {
        colors: [
          { name: 'Yellow', imageUrl: 'https://picsum.photos/50?random=22' },
          { name: 'Blue', imageUrl: 'https://picsum.photos/50?random=23' },
        ],
        sizes: ['Pack of 5', 'Pack of 10', 'Pack of 20'],
      },
    },
    {
      id: 13,
      name: 'Mulch Film',
      price: 34.99,
      image: 'https://picsum.photos/200?random=33',
      description: 'Black mulch film for weed suppression, moisture retention, and temperature regulation in agricultural fields and gardens.',
      specifications: ['UV-stabilized polyethylene', 'Reduces weed growth', 'Improves soil structure'],
      category: 'Mulching',
      variations: {
        colors: [
          { name: 'Black', imageUrl: 'https://picsum.photos/50?random=24' },
          { name: 'Silver', imageUrl: 'https://picsum.photos/50?random=25' },
        ],
        sizes: ['100m', '200m', '300m'],
      },
    },
    {
      id: 14,
      name: 'Grafting Tape',
      price: 5.99,
      image: 'https://picsum.photos/200?random=34',
      description: 'Flexible and stretchable grafting tape for securely binding plant grafts, protecting wounds, and promoting healing.',
      specifications: ['Self-adhesive', 'Waterproof', 'Resistant to sunlight'],
      category: 'Propagation',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=26' },
          { name: 'Clear', imageUrl: 'https://picsum.photos/50?random=27' },
        ],
        sizes: ['10m', '20m', '30m'],
      },
    },
    {
      id: 15,
      name: 'Hydroponic Nutrient Solution',
      price: 24.99,
      image: 'https://picsum.photos/200?random=35',
      description: 'Complete hydroponic nutrient solution for optimal growth and yield of hydroponically grown plants.',
      specifications: ['Balanced nutrient mix', 'Promotes healthy growth', 'Easy to use'],
      category: 'Hydroponics',
      variations: {
        colors: [
          { name: 'Clear', imageUrl: 'https://picsum.photos/50?random=28' },
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=29' },
        ],
        sizes: ['1L', '2L', '5L'],
      },
    },
    {
      id: 16,
      name: 'Plant Support Stakes',
      price: 11.99,
      image: 'https://picsum.photos/200?random=36',
      description: 'Sturdy plant support stakes for providing support to growing plants, vines, and flowers.',
      specifications: ['Durable metal', 'Rust-resistant coating', 'Easy to install'],
      category: 'Support Structures',
      variations: {
        colors: [
          { name: 'Green', imageUrl: 'https://picsum.photos/50?random=30' },
          { name: 'Brown', imageUrl: 'https://picsum.photos/50?random=31' },
        ],
        sizes: ['2ft', '4ft', '6ft'],
      },
    },
  ];
  
  const products = product_home; // Assuming 'products' is the same as 'product_home'
  
  return (
    <Router>
      <div>
          <Header
            user={authUser}
            cartItems={cart}
            onSearch={handleSearch}
            setUser={setAuthUser}
          />
          <main>
            <Routes>
              <Route path="/" element={<CombinedHomePage product_home={product_home} products={products} user={authUser} setUser={setAuthUser} />} /> 
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-account" element={<AccountCreation />} />
              <Route path="/cart" element={<Cart user={authUser} setUser={setAuthUser} />} />
              <Route path="/UserProfile" element={<UserProfile user={authUser} setUser={setAuthUser} />} />
              <Route path="/product/:productId" element={<ProductDetails products={products} />} />
              <Route path="/Message" element={<Message />} />
              <Route path="/categories" element={<CategoryPage products={products} />} />
              <Route path="/Payments" element={<Payments />} />
              console.log(StoreCreation);
              <Route path="/StoreCreation" element={<StoreCreation/>} />
              {/* <Route path="/category/:categoryName" element={<ProductList products={products} user={authUser} setUser={setAuthUser} />} /> */}
            </Routes>
          </main>
      </div>
    </Router>
  );
}

export default App;