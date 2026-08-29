import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Pages/Landing/Home';
import LoginModal from './Components/Auth/LoginModal';
import RegisterModal from './Components/Auth/RegisterModal';
import Dashboard from './Pages/Seller/Dashboard'
import PostAdvertesetment from './Pages/Seller/PostAdvertesetment';
import Marketplace from './Pages/Marketplace';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/register"
          element={
            <RegisterModal 
              isOpen={true} 
              onClose={() => navigate('/')} 
              onSwitchToLogin={() => navigate('/login')} 
            />
          } 
        />
        <Route
          path="/login"
          element={
            <LoginModal
              isOpen={true}
              onClose={() => navigate('/')}
              onSwitchToRegister={() => navigate('/register')}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-advertisement" element={<PostAdvertesetment />} />
        <Route path="/market" element={<Marketplace />} />
        
      </Routes>
    </div>
  );
}

export default App;
