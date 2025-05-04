import React, { useContext, useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaUser,
  FaSearch,
  FaHome,
  FaBoxOpen,
  FaUserCog,
  FaSignOutAlt,
  FaHeart,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChartLine,
  FaBell,
  FaImages,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import SearchResults from './SearchResults';
import UserPreferences from './UserPreferences';
import ProductCompare from './ProductCompare';
import ThemeToggle from './ThemeToggle';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { darkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  const logoutHandler = () => {
    logout();
    // Navigate to homepage after logout
    navigate('/');
    // Force a page refresh to clear any cached state
    window.location.reload();
  };

  // Handle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle clicks outside the search results to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search products when search term changes
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.trim().length > 1) {
      setIsSearching(true);
      setShowResults(true);

      // Debounce search to avoid too many requests
      searchTimeout.current = setTimeout(async () => {
        try {
          const { data } = await axios.get(`/api/products/search?query=${searchTerm}`);
          setSearchResults(data);
          setIsSearching(false);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleSelectResult = (product) => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar bg-dark text-white py-2 d-none d-md-block">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="top-bar-left">
              <span className="me-3"><FaPhoneAlt className="me-1" size={12} /> +91 1234567890</span>
              <span><FaEnvelope className="me-1" size={12} /> support@quickkart.com</span>
            </div>
            <div className="top-bar-right">
              <span className="me-3"><FaMapMarkerAlt className="me-1" size={12} /> Track Order</span>
              <span><FaMapMarkerAlt className="me-1" size={12} /> Daily Deals</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar
        expand="lg"
        collapseOnSelect
        className={`py-2 navbar ${isSticky ? 'sticky-header shadow-sm' : ''} ${darkMode ? 'navbar-dark' : 'navbar-light'}`}
        fixed={isSticky ? "top" : ""}
        variant={darkMode ? "dark" : "light"}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <strong style={{ color: '#FF6B00', fontSize: '1.5rem' }}>Quick</strong>
              <span style={{ color: darkMode ? 'var(--dark-text)' : 'white', fontSize: '1.5rem' }}>Kart</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="align-items-center">
            {/* Search Form */}
            <div className="position-relative mx-auto header-search-container" ref={searchRef}>
              <Form className="d-flex my-2 my-lg-0" onSubmit={handleSearch}>
                <InputGroup className="header-search-group">
                  <Form.Control
                    type="search"
                    placeholder="Search..."
                    className="me-0 border-0 shadow-sm header-search-input"
                    style={{
                      borderRadius: '20px 0 0 20px',
                      backgroundColor: 'white',
                      color: '#333'
                    }}
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                  />
                  <Button
                    variant="light"
                    type="submit"
                    className="header-search-button"
                    style={{
                      borderRadius: '0 20px 20px 0',
                      backgroundColor: 'white',
                      color: '#1a73e8',
                      borderColor: 'white'
                    }}
                  >
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="position-absolute w-100 mt-1 z-3">
                  <SearchResults
                    results={searchResults}
                    loading={isSearching}
                    onSelectResult={handleSelectResult}
                  />
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <Nav className="ms-auto">
              <LinkContainer to="/">
                <Nav.Link className="mx-1">
                  <FaHome className="me-1" /> Home
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/categories">
                <Nav.Link className="mx-1">
                  Categories
                </Nav.Link>
              </LinkContainer>


              <LinkContainer to="/cart">
                <Nav.Link className="mx-1 position-relative">
                  <FaShoppingCart className="me-1" /> Cart
                  {cartItems.length > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle cart-badge"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/wishlist">
                <Nav.Link className="mx-1">
                  <FaHeart className="me-1" /> Wishlist
                </Nav.Link>
              </LinkContainer>

              <Nav.Item className="mx-1 d-flex align-items-center">
                <ProductCompare />
              </Nav.Item>

              <Nav.Item className="mx-1 d-flex align-items-center">
                <ThemeToggle />
              </Nav.Item>

              {userInfo ? (
                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" /> {userInfo.name}
                    </span>
                  }
                  id="username"
                  className="mx-1"
                >
                  <LinkContainer to="/account">
                    <NavDropdown.Item>
                      <FaUserCog className="me-2" /> My Account
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <FaUserCog className="me-2" /> Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/addresses">
                    <NavDropdown.Item>
                      <FaHome className="me-2" /> Addresses
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>
                      <FaBoxOpen className="me-2" /> Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/wishlist">
                    <NavDropdown.Item>
                      <FaHeart className="me-2" /> Wishlist
                    </NavDropdown.Item>
                  </LinkContainer>

                  {/* User Preferences */}
                  <NavDropdown.Item className="px-3">
                    <UserPreferences />
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="mx-1">
                    <FaUser className="me-1" /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.role === 'admin' && (
                <NavDropdown
                  title={
                    <span>
                      <FaUserCog className="me-1" /> Admin
                    </span>
                  }
                  id="adminmenu"
                  className="mx-1"
                >
                  <LinkContainer to="/admin/analytics">
                    <NavDropdown.Item>
                      <FaChartLine className="me-2" /> Analytics
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/inventory">
                    <NavDropdown.Item>
                      <FaBell className="me-2" /> Inventory Alerts
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>
                      <FaBoxOpen className="me-2" /> Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>
                      <FaBoxOpen className="me-2" /> Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>
                      <FaUser className="me-2" /> Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/banner">
                    <NavDropdown.Item>
                      <FaImages className="me-2" /> Banner Management
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
