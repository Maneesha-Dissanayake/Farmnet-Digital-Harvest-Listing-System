import React from 'react'
import {Routes, Route} from "react-router-dom";

import Home from './Pages/Landing/Home'
import './App.css'

function App() {
  return (
    <div>
        <React.Fragment>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mainhome" element={<Home />} />
            </Routes>
        </React.Fragment>    
    </div>
  )
}

export default App

