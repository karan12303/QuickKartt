import React from 'react';
import { Container, Row, Col, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCreditCard,
  FaShieldAlt,
  FaTruck,
  FaUserShield,
  FaCheckCircle,
  FaCertificate,
  FaHandshake
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <Container>
        <Row className="mb-4">
          <Col md={4} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-4 text-white">
              <strong style={{ color: '#ff5722' }}>Quick</strong>Kart
            </h5>
            <p className="text-white">
              Your one-stop shop for all your shopping needs. Fast delivery, great prices, and excellent customer service.
            </p>
            <div className="d-flex mt-3">
              <Button variant="outline-light" size="sm" className="me-2" as="a" href="#" target="_blank">
                <FaFacebook />
              </Button>
              <Button variant="outline-light" size="sm" className="me-2" as="a" href="#" target="_blank">
                <FaTwitter />
              </Button>
              <Button variant="outline-light" size="sm" className="me-2" as="a" href="#" target="_blank">
                <FaInstagram />
              </Button>
              <Button variant="outline-light" size="sm" as="a" href="#" target="_blank">
                <FaLinkedin />
              </Button>
            </div>
          </Col>

          <Col md={4} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-4 text-white">Quick Links</h5>
            <ListGroup variant="flush" className="footer-links">
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/cart" className="text-white text-decoration-none">Cart</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/login" className="text-white text-decoration-none">Login</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/register" className="text-white text-decoration-none">Register</Link>
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2">
                <Link to="/clear-storage" className="text-white text-decoration-none">Reset Session</Link>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-4 text-white">Contact Us</h5>
            <ListGroup variant="flush" className="footer-links">
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2 text-white">
                <FaMapMarkerAlt className="me-2" /> 123 Shopping St, Retail City
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2 text-white">
                <FaPhone className="me-2" /> +91 1234567890
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 p-0 mb-2 text-white">
                <FaEnvelope className="me-2" /> support@quickkart.com
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>

        {/* Trust Badges Section */}
        <Row className="mb-4 text-center">
          <Col xs={12}>
            <h5 className="mb-3 text-white">Shop With Confidence</h5>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaLock size={32} className="text-success" />
              </div>
              <h6 className="text-white">Secure Payment</h6>
              <p className="text-white-50 small">Your data is protected</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaCreditCard size={32} className="text-info" />
              </div>
              <h6 className="text-white">Multiple Payment Options</h6>
              <p className="text-white-50 small">UPI, Cards, COD</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaShieldAlt size={32} className="text-warning" />
              </div>
              <h6 className="text-white">Buyer Protection</h6>
              <p className="text-white-50 small">Money back guarantee</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaTruck size={32} className="text-primary" />
              </div>
              <h6 className="text-white">Fast Delivery</h6>
              <p className="text-white-50 small">Nationwide shipping</p>
            </div>
          </Col>
        </Row>

        {/* Additional Security Badges */}
        <Row className="mb-4 text-center">
          <Col xs={12}>
            <h5 className="mb-3 text-white">Security & Certifications</h5>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaUserShield size={32} className="text-info" />
              </div>
              <h6 className="text-white">PCI DSS Compliant</h6>
              <p className="text-white-50 small">Payment Card Industry Data Security Standard</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaCheckCircle size={32} className="text-success" />
              </div>
              <h6 className="text-white">SSL Encrypted</h6>
              <p className="text-white-50 small">256-bit secure connection</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaCertificate size={32} className="text-warning" />
              </div>
              <h6 className="text-white">ISO 27001 Certified</h6>
              <p className="text-white-50 small">Information security management</p>
            </div>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <div className="d-flex flex-column align-items-center">
              <div className="trust-badge-icon mb-2">
                <FaHandshake size={32} className="text-primary" />
              </div>
              <h6 className="text-white">Trusted Partner</h6>
              <p className="text-white-50 small">Verified by industry leaders</p>
            </div>
          </Col>
        </Row>

        <hr className="my-4 bg-secondary" />

        <Row>
          <Col className="text-center">
            <div className="mb-3">
              <img src="https://cdn.pixabay.com/photo/2018/05/08/21/29/paypal-3384015_1280.png" alt="PayPal" className="trust-badge mx-2" style={{ height: '25px' }} />
              <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="Visa" className="trust-badge mx-2" style={{ height: '25px' }} />
              <img src="https://cdn.pixabay.com/photo/2013/10/01/10/29/ebay-189064_1280.png" alt="Mastercard" className="trust-badge mx-2" style={{ height: '25px' }} />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="trust-badge mx-2" style={{ height: '25px' }} />
            </div>
            <div className="mb-3">
              <img src="https://www.pngitem.com/pimgs/m/40-406527_pci-dss-compliant-logo-hd-png-download.png" alt="PCI DSS" className="trust-badge mx-2" style={{ height: '35px' }} />
              <img src="https://www.seekpng.com/png/detail/138-1387775_ssl-secure-ssl.png" alt="SSL Secure" className="trust-badge mx-2" style={{ height: '35px' }} />
              <img src="https://www.nicepng.com/png/detail/261-2619257_norton-secured-seal-norton-secured-logo-png.png" alt="Norton Secured" className="trust-badge mx-2" style={{ height: '35px' }} />
              <img src="https://www.pngkey.com/png/detail/233-2333023_mcafee-secure-logo.png" alt="McAfee Secure" className="trust-badge mx-2" style={{ height: '35px' }} />
            </div>
            <p className="mb-0 text-white">
              <strong style={{ color: '#ff5722' }}>Quick</strong>Kart &copy; {new Date().getFullYear()} - All Rights Reserved
            </p>
            <p className="text-white-50 small mt-1">
              Designed with <span className="text-danger">❤</span> by Karan for a better shopping experience
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
