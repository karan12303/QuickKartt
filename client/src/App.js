import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AnimatePresence } from 'framer-motion';
import { initializeAnimations } from './utils/animations';
import './category-screen.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import InstallPWA from './components/InstallPWA';
import AuthRedirect from './components/AuthRedirect';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ProfileScreen from './pages/ProfileScreen';
import ProfilePage from './pages/ProfilePage';
import ShippingScreen from './pages/ShippingScreen';
import PaymentScreen from './pages/PaymentScreen';
import AddressListScreen from './pages/AddressListScreen';
import AddressEditScreen from './pages/AddressEditScreen';
import AddNewAddressScreen from './pages/AddNewAddressScreen';
import PlaceOrderScreen from './pages/PlaceOrderScreen';
import OrderScreen from './pages/OrderScreen';
import OrderHistoryScreen from './pages/OrderHistoryScreen';
import WishlistScreen from './pages/WishlistScreen';
import ClearStorageScreen from './pages/ClearStorageScreen';
import AdminProductListScreen from './pages/admin/ProductListScreen';
import AdminProductEditScreen from './pages/admin/ProductEditScreen';
import AdminOrderListScreen from './pages/admin/OrderListScreen';
import AdminUserListScreen from './pages/admin/UserListScreen';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import InventoryManagement from './pages/admin/InventoryManagement';
import BannerManagementScreen from './pages/admin/BannerManagementScreen';
import CategoryScreen from './pages/CategoryScreen';
import SearchScreen from './pages/SearchScreen';
import PayPalTest from './pages/PayPalTest';
import 'bootstrap/dist/css/bootstrap.min.css';
import './futuristic.css';
import './alignment-fixes.css';

function App() {
  // Initialize AOS animations
  useEffect(() => {
    const cleanup = initializeAnimations();
    return cleanup;
  }, []);

  return (
    <Router>
      <AuthRedirect />
      <Header />
      <main className="py-4 fade-in">
        <Container className="main-container">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/categories" element={<CategoryScreen />} />
              <Route path="/shop" element={<SearchScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/account" element={<ProfilePage />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/addresses" element={<AddressListScreen />} />
              <Route path="/address/new" element={<AddNewAddressScreen />} />
              <Route path="/address/:id/edit" element={<AddressEditScreen key="edit-address" />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/wishlist" element={<WishlistScreen />} />
              <Route path="/clear-storage" element={<ClearStorageScreen />} />
              <Route path="/paypal-test" element={<PayPalTest />} />

              {/* Admin Routes */}
              <Route path="/admin/productlist" element={<AdminProductListScreen />} />
              <Route path="/admin/product/:id/edit" element={<AdminProductEditScreen />} />
              <Route path="/admin/orderlist" element={<AdminOrderListScreen />} />
              <Route path="/admin/userlist" element={<AdminUserListScreen />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/inventory" element={<InventoryManagement />} />
              <Route path="/admin/banner" element={<BannerManagementScreen />} />
            </Routes>
          </AnimatePresence>
        </Container>
      </main>
      <Footer />
      <MobileNav />
      <InstallPWA />
    </Router>
  );
}

export default App;
