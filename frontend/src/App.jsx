import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Home from './Pages/Landing/Home';
import LoginModal from './Components/Auth/LoginModal';
import RegisterModal from './Components/Auth/RegisterModal';
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
      </Routes>
    </div>
  );
}

export default App;
