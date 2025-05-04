import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
// Import API_ENDPOINTS but don't use it directly since we're using axios with relative paths
// import API_ENDPOINTS from '../config/apiConfig';

const FuturisticHero = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const particlesRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from API
  // Default hero slides as fallback using useMemo to prevent re-creation on each render
  const defaultHeroSlides = useMemo(() => [
    // These slides will be used if the API fails or returns no suitable products
    {
      id: "default1",
      title: "Premium Collection",
      subtitle: "Discover luxury timepieces for every occasion.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productName: "Premium Watch",
      productPrice: "₹12,999",
      color: "primary"
    },
    {
      id: "default2",
      title: "Sound Perfection",
      subtitle: "Experience immersive audio with noise cancellation.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productName: "Wireless Headphones",
      productPrice: "₹8,499",
      color: "secondary"
    },
    {
      id: "default3",
      title: "Performance Footwear",
      subtitle: "Engineered for comfort and athletic excellence.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      productName: "Running Shoes",
      productPrice: "₹5,999",
      color: "info"
    }
  ], []);

  useEffect(() => {
    const fetchBannerProducts = async () => {
      try {
        setLoading(true);

        // Fetch banner settings from API
        const { data: bannerData } = await axios.get('/api/banner');

        // If no banner settings found, fall back to default slides
        if (!bannerData || bannerData.length === 0) {
          console.log('No banner settings found, using default slides');
          setFeaturedProducts(defaultHeroSlides);
          setLoading(false);
          return;
        }

        // Transform banner settings into hero slides format
        const slides = bannerData.map(banner => {
          return {
            id: banner.productId._id,
            title: banner.title,
            subtitle: banner.subtitle,
            image: banner.productId.imageUrl,
            productName: banner.productId.name,
            productPrice: `₹${banner.productId.price.toLocaleString('en-IN')}`,
            color: banner.color || "primary"
          };
        });

        setFeaturedProducts(slides);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching banner products:', error);
        // Fallback to default slides if API fails
        setFeaturedProducts(defaultHeroSlides);
        setLoading(false);
      }
    };

    fetchBannerProducts();
  }, [defaultHeroSlides]);

  // Handle navigation to product page
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Navigation functions for slides
  const goToPrevSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? featuredProducts.length - 1 : prev - 1
    );
    setProgress(0); // Reset progress when changing slides manually
  };

  const goToNextSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) =>
      (prev + 1) % featuredProducts.length
    );
    setProgress(0); // Reset progress when changing slides manually
  };



  // Auto-advance slides every 4 seconds with progress animation
  useEffect(() => {
    // Only set up intervals if we have products and user isn't hovering
    if (!isHovering && featuredProducts && featuredProducts.length > 0) {
      // Reset progress when slide changes
      setProgress(0);

      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            return prev + 1;
          }
          return 0;
        });
      }, 40); // 40ms * 100 steps = 4000ms (4 seconds)

      // Slide change interval
      const slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        setProgress(0); // Reset progress when slide changes
      }, 4000);

      return () => {
        clearInterval(slideInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isHovering, featuredProducts, currentSlide]);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.2');

    // Create minimal animated particles
    const createParticles = () => {
      const particlesContainer = particlesRef.current;
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      // Create new particles - reduced number for minimalism
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';

        // Consistent small size for minimalism
        const size = 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Strategic positioning rather than random
        particle.style.left = `${(i * 5) % 100}%`;
        particle.style.top = `${(i * 7) % 100}%`;

        // Subtle opacity
        particle.style.opacity = 0.15;

        // Slow, subtle animation
        const duration = 30;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;

        // Staggered animation delay
        particle.style.animationDelay = `${i * 0.5}s`;

        // Monochromatic color scheme
        particle.style.backgroundColor = 'var(--primary)';

        particlesContainer.appendChild(particle);
      }
    };

    createParticles();

    // Recreate particles on window resize
    window.addEventListener('resize', createParticles);

    return () => {
      window.removeEventListener('resize', createParticles);
    };
  }, []);

  return (
    <div
      className="hero-futuristic"
      ref={heroRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Minimal background with subtle particles */}
      <div className="hero-particles" ref={particlesRef}></div>

      {/* Clean gradient overlay */}
      <div className="hero-gradient-overlay"></div>

      {/* Minimal grid lines - just enough for structure */}
      <div className="hero-grid-lines">
        <div className="hero-grid-line horizontal"></div>
        <div className="hero-grid-line horizontal"></div>
        <div className="hero-grid-line vertical"></div>
        <div className="hero-grid-line vertical"></div>
      </div>

      <Container>
        {loading ? (
          <div className="banner-loading-container">
            <div className="banner-loading-spinner"></div>
          </div>
        ) : (
          <Row className="align-items-center min-vh-80">
            <Col lg={6} className="hero-content">
              <AnimatePresence mode="wait">
                {featuredProducts.length > 0 && (
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h1
                      ref={titleRef}
                      className="hero-title display-text"
                    >
                      <span className="hero-title-highlight">
                        {featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].title : "Featured Products"}
                      </span>
                    </motion.h1>

                    <motion.p
                      ref={subtitleRef}
                      className="hero-subtitle"
                    >
                      {featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].subtitle : "Discover our premium selection."}
                    </motion.p>

                    <motion.p className="product-badge">
                      <span className="badge-highlight">Featured Product</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                ref={ctaRef}
                className="hero-cta d-flex flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="me-3 mb-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {featuredProducts.length > 0 && (
                    <Button
                      variant="primary"
                      size="lg"
                      className="btn-minimal-primary"
                      onClick={() => handleViewProduct(featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].id : '')}
                    >
                      View Product <FaArrowRight className="ms-2" />
                    </Button>
                  )}
                </motion.div>
              </motion.div>

              {/* Slide navigation */}
              {featuredProducts.length > 0 && (
                <div className="hero-navigation mt-4 d-flex align-items-center">
                  {/* Slide indicators with progress */}
                  <div className="hero-indicators d-flex">
                    {featuredProducts.map((_, index) => (
                      <div key={index} className="hero-indicator-container">
                        <motion.button
                          className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                          onClick={() => {
                            setCurrentSlide(index);
                            setProgress(0);
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                        {index === currentSlide && (
                          <div className="hero-indicator-progress-container">
                            <div
                              className="hero-indicator-progress"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Navigation arrows */}
                  <div className="hero-arrows ms-4">
                    <motion.button
                      className="hero-arrow hero-arrow-prev"
                      onClick={goToPrevSlide}
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Previous slide"
                    >
                      <FaChevronLeft />
                    </motion.button>
                    <motion.button
                      className="hero-arrow hero-arrow-next"
                      onClick={goToNextSlide}
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Next slide"
                    >
                      <FaChevronRight />
                    </motion.button>
                  </div>
                </div>
              )}
            </Col>

            <Col lg={6} md={8} className="mx-auto">
              {featuredProducts.length > 0 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="hero-image-container"
                  >
                    <div className="position-relative">
                      <Link to={`/product/${featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].id : ''}`} className="product-link">
                        <motion.div
                          className="product-showcase"
                          animate={{
                            y: [0, -5, 0], // Reduced movement for more static appearance
                          }}
                          transition={{
                            duration: 8, // Slower animation for more subtle effect
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="product-image-wrapper">
                            <img
                              src={featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].image : ''}
                              alt={featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].productName : 'Product'}
                              className="img-fluid product-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/product-placeholder.svg";
                              }}
                            />

                            {/* Product details overlay - cleaner, more professional */}
                            <div className="product-details">
                              <h4>{featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].productName : 'Product'}</h4>
                              <p className="product-price">{featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].productPrice : ''}</p>
                              <motion.button
                                className="btn-view-product"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleViewProduct(featuredProducts && featuredProducts[currentSlide] ? featuredProducts[currentSlide].id : '');
                                }}
                              >
                                View Details
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>

                      {/* Minimalist decorative elements */}
                      <div className="hero-decorative-line hero-decorative-line-minimal"></div>

                      {/* Single subtle animated ring */}
                      <motion.div
                        className="hero-ring-minimal"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                        }}
                      ></motion.div>

                      {/* Product navigation arrows */}
                      <motion.button
                        className="product-arrow product-arrow-prev"
                        onClick={goToPrevSlide}
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Previous product"
                      >
                        <FaChevronLeft />
                      </motion.button>
                      <motion.button
                        className="product-arrow product-arrow-next"
                        onClick={goToNextSlide}
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Next product"
                      >
                        <FaChevronRight />
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </Col>
          </Row>
        )}

        {/* Minimalist feature highlights - single line */}
        <motion.div
          className="hero-features-minimal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className={`text-center py-4 border-top border-bottom ${darkMode ? 'border-dark' : 'border-light'}`}>
            <p className="mb-0" style={{ color: darkMode ? 'var(--gray)' : 'var(--gray)' }}>
              <span className="mx-3">Free Shipping</span>
              <span className="mx-3">•</span>
              <span className="mx-3">Secure Payments</span>
              <span className="mx-3">•</span>
              <span className="mx-3">30-Day Returns</span>
            </p>
          </div>
        </motion.div>
      </Container>

      {/* Hero wave shape divider */}
      <div className="hero-wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={darkMode ? '#121212' : '#ffffff'} fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <style jsx>{`
        .hero-futuristic {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background-color: ${darkMode ? 'var(--dark-surface)' : '#ffffff'};
          color: ${darkMode ? 'var(--dark-text)' : '#333333'};
          padding: 3rem 0 2rem;
        }

        .banner-loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .banner-loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 50%;
          border-top-color: ${darkMode ? '#e0e0e0' : '#333'};
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          opacity: 0.2; /* Even more subtle particles for static look */
        }

        .hero-particle {
          position: absolute;
          border-radius: 50%;
          z-index: 1;
        }

        .hero-gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(250, 250, 250, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
          z-index: 0;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        /* Minimal grid lines */
        .hero-grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          opacity: 0.3;
        }

        .hero-grid-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
        }

        .hero-grid-line.horizontal {
          height: 1px;
          width: 100%;
          left: 0;
        }

        .hero-grid-line.horizontal:nth-child(1) {
          top: 25%;
        }

        .hero-grid-line.horizontal:nth-child(2) {
          top: 75%;
        }

        .hero-grid-line.horizontal:nth-child(3) {
          display: none;
        }

        .hero-grid-line.vertical {
          width: 1px;
          height: 100%;
          top: 0;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.05), transparent);
        }

        .hero-grid-line.vertical:nth-child(4) {
          left: 25%;
        }

        .hero-grid-line.vertical:nth-child(5) {
          left: 75%;
        }

        .hero-grid-line.vertical:nth-child(6) {
          display: none;
        }

        /* Removed floating badges for minimalism */

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          line-height: 1.2;
          text-align: left;
          color: ${darkMode ? '#ffffff' : '#000'};
          letter-spacing: -0.5px;
          text-shadow: ${darkMode ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none'};
        }

        .hero-title-highlight {
          position: relative;
          display: inline-block;
          padding: 0 0.2rem;
          background: ${darkMode ?
            'linear-gradient(to bottom, transparent 80%, rgba(255, 255, 255, 0.1) 20%)' :
            'linear-gradient(to bottom, transparent 80%, rgba(0, 0, 0, 0.05) 20%)'};
          border-bottom: 2px solid ${darkMode ? '#ffffff' : '#000'};
        }

        .hero-subtitle {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          opacity: ${darkMode ? '1' : '0.85'};
          text-align: left;
          font-weight: 500;
          letter-spacing: 0.2px;
          color: ${darkMode ? '#e0e0e0' : '#333'};
          text-shadow: ${darkMode ? '0 1px 2px rgba(0, 0, 0, 0.5)' : 'none'};
        }

        .product-badge {
          margin-bottom: 1.5rem;
        }

        .badge-highlight {
          background-color: ${darkMode ? 'rgba(255, 107, 0, 0.2)' : '#f8f8f8'};
          border: 1px solid ${darkMode ? 'rgba(255, 107, 0, 0.5)' : '#e0e0e0'};
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: ${darkMode ? '#ffffff' : '#333'};
          border-radius: 2px;
          text-shadow: ${darkMode ? '0 1px 2px rgba(0, 0, 0, 0.5)' : 'none'};
        }

        .hero-cta {
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .btn-minimal-primary {
          background: ${darkMode ? 'var(--primary)' : '#333'};
          color: white;
          border: none;
          border-radius: 2px;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: ${darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'};
        }

        .btn-minimal-primary:hover {
          background: ${darkMode ? 'var(--primary-dark)' : '#000'};
          transform: translateY(-2px);
          box-shadow: ${darkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : 'none'};
        }

        /* Slide navigation - improved visibility */
        .hero-navigation {
          display: flex;
          align-items: center;
        }

        /* Minimal slide indicators with progress */
        .hero-indicators {
          display: flex;
          gap: 12px;
        }

        .hero-indicator-container {
          position: relative;
          height: 10px;
          display: flex;
          align-items: center;
        }

        .hero-indicator {
          width: 24px;
          height: 3px;
          border-radius: 0;
          background-color: ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
          position: relative;
          z-index: 2;
        }

        .hero-indicator.active {
          background-color: ${darkMode ? '#ffffff' : '#000'};
          width: 32px;
        }

        .hero-indicator-progress-container {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          overflow: hidden;
          border-radius: 0;
        }

        .hero-indicator-progress {
          height: 100%;
          background-color: ${darkMode ? '#ffffff' : '#000'};
          width: 0;
          transition: width 0.1s linear;
        }

        /* Navigation arrows - more visible */
        .hero-arrows {
          display: flex;
          gap: 12px;
        }

        .hero-arrow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: ${darkMode ? 'var(--dark-surface)' : '#fff'};
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: ${darkMode ? '#fff' : '#333'};
          box-shadow: ${darkMode ? '0 2px 5px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.08)'};
          padding: 0;
        }

        .hero-arrow:hover {
          background-color: ${darkMode ? 'var(--primary)' : '#f8f8f8'};
          box-shadow: ${darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.12)'};
          color: ${darkMode ? '#fff' : '#000'};
        }

        .hero-arrow:focus {
          outline: none;
          box-shadow: ${darkMode ? '0 0 0 2px rgba(255, 255, 255, 0.1)' : '0 0 0 2px rgba(0, 0, 0, 0.08)'};
        }

        .hero-image-container {
          position: relative;
          padding: 2rem;
        }

        /* Product showcase styling */
        .product-showcase {
          position: relative;
          z-index: 1;
          margin-bottom: 1rem;
        }

        /* Product navigation arrows - more visible */
        .product-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: ${darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: ${darkMode ? '#fff' : '#333'};
          box-shadow: ${darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.12)'};
          z-index: 10;
          padding: 0;
        }

        .product-arrow-prev {
          left: -10px;
        }

        .product-arrow-next {
          right: -10px;
        }

        .product-arrow:hover {
          background-color: ${darkMode ? 'var(--primary)' : '#fff'};
          box-shadow: ${darkMode ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
          color: ${darkMode ? '#fff' : '#000'};
        }

        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          box-shadow: ${darkMode ? '0 5px 20px rgba(0, 0, 0, 0.2)' : '0 5px 20px rgba(0, 0, 0, 0.06)'};
          background: ${darkMode ? 'var(--dark-surface)' : '#fff'};
          transition: all 0.3s ease;
          height: 400px; /* Fixed height for consistency */
        }

        .product-image-wrapper:hover {
          box-shadow: ${darkMode ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)'};
        }

        .product-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }

        .product-image-wrapper:hover .product-img {
          transform: scale(1.02);
        }

        .product-details {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: ${darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          padding: 1.2rem;
          transform: translateY(0);
          transition: all 0.3s ease;
          border-top: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        }

        .product-details h4 {
          margin: 0 0 0.4rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: ${darkMode ? '#ffffff' : '#000'};
          letter-spacing: -0.3px;
        }

        .product-price {
          font-size: 1.3rem;
          font-weight: 700;
          color: ${darkMode ? 'var(--primary-light)' : '#000'};
          margin-bottom: 0.8rem;
          letter-spacing: -0.3px;
        }

        .btn-view-product {
          background: ${darkMode ? 'var(--primary)' : '#000'};
          color: white;
          border: none;
          padding: 0.5rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: ${darkMode ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.08)'};
          width: 100%; /* Full width button */
          text-align: center;
        }

        .btn-view-product:hover {
          background: ${darkMode ? 'var(--primary-dark)' : '#333'};
          transform: translateY(-2px);
          box-shadow: ${darkMode ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.12)'};
        }

        /* Minimalist decorative elements */
        .hero-decorative-line-minimal {
          position: absolute;
          background: ${darkMode ? 'rgba(255, 255, 255, 0.1)' : '#f0f0f0'};
          height: 1px;
          width: 40%;
          z-index: 0;
          top: 50%;
          right: -10%;
        }

        /* Single minimal ring */
        .hero-ring-minimal {
          position: absolute;
          width: 250px;
          height: 250px;
          border: 1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }

        .hero-wave-divider {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 1;
          line-height: 0;
          display: none; /* Hide for minimalist design */
        }

        /* Minimalist feature highlights */
        .hero-features-minimal {
          margin-top: 2rem;
          position: relative;
          z-index: 2;
        }

        .hero-features-minimal p {
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
        }

        .pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.5rem;
            text-align: center;
            text-shadow: 0 1px 1px rgba(255, 255, 255, 1);
          }

          .hero-subtitle {
            font-size: 1.1rem;
            text-align: center;
            font-weight: 500;
            max-width: 90%;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-cta {
            justify-content: center;
          }

          .hero-futuristic {
            min-height: 60vh;
          }
        }

        @media (max-width: 768px) {
          .hero-features-minimal {
            margin-top: 1.5rem;
          }

          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0 1rem;
          }

          .hero-image-container {
            padding: 1rem;
          }

          .product-showcase {
            margin: 2rem auto;
            max-width: 80%;
          }

          .product-arrow {
            width: 35px;
            height: 35px;
          }

          .product-arrow-prev {
            left: -10px;
          }

          .product-arrow-next {
            right: -10px;
          }

          .product-details {
            padding: 1rem;
          }

          .product-details h4 {
            font-size: 1.1rem;
          }

          .product-price {
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
            text-align: center;
            line-height: 1.3;
            margin-bottom: 0.75rem;
            text-shadow: ${darkMode ? '0 1px 1px rgba(0, 0, 0, 0.5)' : '0 1px 1px rgba(255, 255, 255, 0.5)'};
          }

          .hero-subtitle {
            font-size: 1rem;
            text-align: center;
            line-height: 1.5;
            max-width: 95%;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-futuristic {
            padding: 3rem 0 2rem;
            min-height: 50vh;
          }

          .hero-cta {
            width: 100%;
          }

          .hero-cta .btn {
            width: 100%;
          }

          .hero-navigation {
            justify-content: center;
            flex-wrap: wrap;
          }

          .hero-indicators {
            justify-content: center;
            margin-bottom: 1rem;
          }

          .hero-arrows {
            margin-left: 0;
          }

          .product-showcase {
            max-width: 100%;
            margin: 1.5rem auto;
          }

          .product-arrow {
            width: 30px;
            height: 30px;
            font-size: 0.8rem;
          }

          .product-arrow-prev {
            left: 0;
          }

          .product-arrow-next {
            right: 0;
          }

          .product-details {
            padding: 1rem;
            background: ${darkMode ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
          }

          .product-details h4 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.4rem;
          }

          .product-price {
            font-size: 1.3rem;
            margin-bottom: 0.75rem;
            font-weight: 700;
          }

          .btn-view-product {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            width: 100%;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .hero-features-minimal span {
            display: block;
            margin: 0.5rem 0;
          }

          .hero-features-minimal span.mx-3:nth-child(even) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticHero;
