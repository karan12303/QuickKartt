import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const MobileNav = () => {
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  return (
    <div className="mobile-nav d-md-none">
      <Link to="/" className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}>
        <div className="mobile-nav-icon">
          <FaHome />
        </div>
        <span>Home</span>
      </Link>
      
      <Link to="/search" className={`mobile-nav-item ${isActive('/search') ? 'active' : ''}`}>
        <div className="mobile-nav-icon">
          <FaSearch />
        </div>
        <span>Search</span>
      </Link>
      
      <Link to="/cart" className={`mobile-nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <div className="mobile-nav-icon position-relative">
          <FaShoppingCart />
          {cartItemsCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                  style={{ fontSize: '0.5rem', transform: 'translate(-50%, -50%)' }}>
              {cartItemsCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </Link>
      
      <Link to="/wishlist" className={`mobile-nav-item ${isActive('/wishlist') ? 'active' : ''}`}>
        <div className="mobile-nav-icon">
          <FaHeart />
        </div>
        <span>Wishlist</span>
      </Link>
      
      <Link to={userInfo ? '/profile' : '/login'} 
            className={`mobile-nav-item ${isActive('/profile') || isActive('/login') ? 'active' : ''}`}>
        <div className="mobile-nav-icon">
          <FaUser />
        </div>
        <span>{userInfo ? 'Profile' : 'Login'}</span>
      </Link>
    </div>
  );
};

export default MobileNav;
