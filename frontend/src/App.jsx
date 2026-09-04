import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import ProductDetails from './Pages/ProductDetails';

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

//Admin Management modules
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserManagement from './Pages/Admin/UserManagement';
import AdModeration from './Pages/Admin/AdModeration';
import ChatAudits from './Pages/Admin/ChatAudits';
import Analytics from './Pages/Admin/Analytics';
import CategorySetup from './Pages/Admin/CategorySetup';
import Settings from './Pages/Admin/Settings';
import ReportSummary from './Pages/Admin/ReportSummary';
 
function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Routes>
        {/* Landing & Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<ChatPage />} />

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
        <Route path="/products" element={<Marketplace />} />
        <Route path="/post-advertisement" element={<PostAdvertesetment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/seller-profile" element={<PublicProfile />} />
        <Route path="/seller-profile/:id" element={<PublicProfile />} />

        {/* Admin Dashboard Route */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/ads" element={<AdModeration />} />
        <Route path="/admin/chat-audits" element={<ChatAudits />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/category-setup" element={<CategorySetup />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/reports" element={<ReportSummary />} />

        {/* Component Previews */}
        <Route path="/hero" element={<Hero />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products-preview" element={<ProductsPreview />} />
        <Route path="/value-props" element={<ValueProps />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/listings/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;