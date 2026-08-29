import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// Modals
import LoginModal from './Components/Auth/LoginModal';
import RegisterModal from './Components/Auth/RegisterModal';

// Pages
import Home from './Pages/Landing/Home';
import About from './Pages/About/About';
import ChatPage from './Pages/Landing/ChatPage';
import Marketplace from './Pages/Marketplace';
import Dashboard from './Pages/Seller/Dashboard';
import PostAdvertesetment from './Pages/Seller/PostAdvertesetment';
import PublicProfile from './Pages/Seller/PublicProfile';

// Landing Previews
import Hero from './Pages/Landing/Components/Hero';
import Categories from './Pages/Landing/Components/Categories';
import ProductsPreview from './Pages/Landing/Components/ProductsPreview';
import ValueProps from './Pages/Landing/Components/ValueProps';
import Footer from './Pages/Landing/Components/Footer';

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        {/* Landing & Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/about" element={<About />} />
       

        {/* Auth Modals */}
        <Route
          path="/register"
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

        {/* Marketplace & Produce Routes */}
        <Route path="/market" element={<Marketplace />} />
        <Route path="/post-advertisement" element={<PostAdvertesetment />} />

        <Route element={<Dashboard />}>
          <Route path="/dashboard" element={ 
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Dashboard</h1>
            </div>  
          }/> 

        <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route path="/seller-profile" element={<PublicProfile />} />
        <Route path="/seller-profile/:id" element={<PublicProfile />} />

        {/* Component Previews */}
        <Route path="/hero" element={<Hero />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products-preview" element={<ProductsPreview />} />
        <Route path="/value-props" element={<ValueProps />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </div>
  );
}

export default App;