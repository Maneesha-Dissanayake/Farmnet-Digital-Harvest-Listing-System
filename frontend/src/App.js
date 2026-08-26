import React from 'react'
import {Routes, Route} from "react-router-dom";

import Home from './Pages/Landing/Home'
import Dashboard from './Pages/Seller/Dashboard'
import PostAdvertesetment from './Pages/Seller/PostAdvertesetment';
import './App.css'
import Marketplace from './Pages/Marketplace';


function App() {
  return (
    <div>
        <React.Fragment>
            <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/mainhome" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-advertisement" element={<PostAdvertesetment />} />
            <Route path="/market" element={<Marketplace />} />
            
            </Routes>
        </React.Fragment>    
    </div>
  )
}

export default App

