import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Product from './Product';

const RecommendationEngine = ({ currentProductId, category }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get browsing history from localStorage
    const getBrowsingHistory = () => {
      const history = localStorage.getItem('browsingHistory');
      return history ? JSON.parse(history) : [];
    };

    // Add current product to browsing history
    const addToBrowsingHistory = (productId) => {
      if (!productId) return;
      
      const history = getBrowsingHistory();
      
      // Remove the product if it already exists in history
      const filteredHistory = history.filter(id => id !== productId);
      
      // Add the product to the beginning of the array
      filteredHistory.unshift(productId);
      
      // Keep only the last 10 products
      const limitedHistory = filteredHistory.slice(0, 10);
      
      // Save to localStorage
      localStorage.setItem('browsingHistory', JSON.stringify(limitedHistory));
    };

    // Get recommendations based on browsing history and current product category
    const getRecommendations = async () => {
      try {
        setLoading(true);
        
        // Add current product to history
        if (currentProductId) {
          addToBrowsingHistory(currentProductId);
        }
        
        // Get browsing history
        const history = getBrowsingHistory();
        
        // Fetch all products
        const { data } = await axios.get('/api/products');
        
        // Filter out the current product
        let filteredProducts = data.filter(product => product._id !== currentProductId);
        
        // Scoring algorithm for recommendations
        const scoredProducts = filteredProducts.map(product => {
          let score = 0;
          
          // Score based on category match
          if (category && product.category === category) {
            score += 5;
          }
          
          // Score based on browsing history
          const historyIndex = history.indexOf(product._id);
          if (historyIndex !== -1) {
            // Higher score for more recently viewed products
            score += (10 - historyIndex);
          }
          
          // Add some randomness for discovery
          score += Math.random() * 2;
          
          return { ...product, score };
        });
        
        // Sort by score (highest first) and take top 4
        const sortedRecommendations = scoredProducts
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);
        
        setRecommendations(sortedRecommendations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };

    getRecommendations();
  }, [currentProductId, category]);

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section my-5">
      <h3 className="section-title mb-4">Recommended For You</h3>
      <Row>
        {recommendations.map(product => (
          <Col key={product._id} sm={6} md={3} className="mb-4">
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RecommendationEngine;
