import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './homePage.css';

const HomePage = ({ product_home }) => {
  return (
    <div className="homepage">
      <section className="slideshow">
        <Carousel autoPlay interval={2000} infiniteLoop showThumbs={false} showIndicators ={false} showStatus = {false} className="carousel">
          {product_home.map(product => (
            <div key={product.id}>
              <img src={product.image} alt={product.name} className="carousel-image" />
              <p className="legend">{product.name}</p>
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default HomePage;
