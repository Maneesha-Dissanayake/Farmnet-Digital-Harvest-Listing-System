import React from 'react';
import Nav from '../../Components/Nav';
import Hero from './Components/Hero';
import Categories from './Components/Categories';
import ProductsPreview from './Components/ProductsPreview'; 
import ValueProps from './Components/ValueProps';
import SubscribeSection from './Components/SubscribeSection';
import Footer from './Components/Footer';

function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <Categories />
      <ProductsPreview />
      <ValueProps />
      <SubscribeSection />
      <Footer />
    </div>
  );
}

export default Home;