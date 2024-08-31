import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryPage.css';

const categories = [
  { name: 'Fertilizers', image: 'https://picsum.photos/200?random=51' },
  { name: 'Seeds', image: 'https://picsum.photos/200?random=52' },
  { name: 'Tools & Equipment', image: 'https://picsum.photos/200?random=53' },
  { name: 'Pest Control', image: 'https://picsum.photos/200?random=54' },
  { name: 'Irrigation', image: 'https://picsum.photos/200?random=55' },
  { name: 'Greenhouses', image: 'https://picsum.photos/200?random=56' },
  { name: 'Soil & Compost', image: 'https://picsum.photos/200?random=57' },
  { name: 'Plant Care', image: 'https://picsum.photos/200?random=58' },
  { name: 'Harvesting Tools', image: 'https://picsum.photos/200?random=59' },
  { name: 'Others', image: 'https://picsum.photos/200?random=60' },
];

const CategoryPage = ({ products }) => {
  return (
    <div className="cartegory-container">
      <h4>CATEGORIES</h4>
      
        <div className="category-grid"  >
          {categories.map((category) => (
            <Link to={`/category/${category.name}`} key={category.name} className="category-card">
              <img src={category.image} alt={category.name} className="category-image" />
              <h2 className="category-name">{category.name}</h2>
            </Link>
          ))}
        </div>
      </div>
  );
};

export default CategoryPage;
