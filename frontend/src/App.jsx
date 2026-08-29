import React from 'react'
import {Routes, Route} from "react-router-dom";

import Home from './Pages/Landing/Home'
import './App.css'
import Hero from './Pages/Landing/Components/Hero'
import Categories from './Pages/Landing/Components/Categories'
import ProductsPreview from './Pages/Landing/Components/ProductsPreview'
import ValueProps from './Pages/Landing/Components/ValueProps'
import Footer from './Pages/Landing/Components/Footer'
import About from './Pages/About/About'
import PublicProfile from './Pages/Seller/PublicProfile'


function App() {
  return (
    <div>
        <React.Fragment>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mainhome" element={<Home />} />
            <Route path="/hero" element={<Hero />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/productspreview" element={<ProductsPreview />} />
            <Route path="/valueprops" element={<ValueProps />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/about" element={<About />} />
            <Route path="/seller-profile" element={<PublicProfile />} />
            <Route path="/chat" element={<div>Chat Page</div>} />
            </Routes>
        </React.Fragment>    
    </div>
  )
}

export default App

