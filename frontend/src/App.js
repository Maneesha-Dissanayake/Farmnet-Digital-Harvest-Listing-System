import React from 'react'
import {Routes, Route} from "react-router-dom";

import Home from './Pages/Landing/Home'
import Dashboard from './Pages/Seller/Dashboard'
import './App.css'

function App() {
  return (
    <div>
        <React.Fragment>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mainhome" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </React.Fragment>    
    </div>
  )
}

export default App

