import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load compare list from localStorage on component mount
  useEffect(() => {
    const savedList = localStorage.getItem('compareList');
    if (savedList) {
      const parsedList = JSON.parse(savedList);

      // If we have product IDs but not full product data, fetch the products
      if (parsedList.length > 0 && typeof parsedList[0] === 'string') {
        fetchProducts(parsedList);
      } else {
        setCompareList(parsedList);
      }
    }
  }, []);

  // Fetch product details for IDs in compare list
  const fetchProducts = async (productIds) => {
    setLoading(true);
    try {
      const products = [];

      for (const id of productIds) {
        const { data } = await axios.get(`/api/products/${id}`);
        products.push(data);
      }

      setCompareList(products);
      localStorage.setItem('compareList', JSON.stringify(products));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products for comparison:', error);
      setError('Failed to load products for comparison');
      setLoading(false);
    }
  };

  // Add a product to compare list
  const addToCompare = (product) => {
    try {
      // Validate product
      if (!product || !product._id) {
        console.error('Invalid product data for comparison');
        return false;
      }

      // Check if product is already in compare list
      if (compareList.some(item => item._id === product._id)) {
        console.log('Product already in compare list:', product._id);
        return false;
      }

      // Limit to 4 products for comparison
      if (compareList.length >= 4) {
        alert('You can compare up to 4 products at a time. Please remove a product before adding a new one.');
        return false;
      }

      const updatedList = [...compareList, product];
      setCompareList(updatedList);
      localStorage.setItem('compareList', JSON.stringify(updatedList));
      console.log('Product added to compare list:', product._id);
      return true;
    } catch (error) {
      console.error('Error adding product to compare list:', error);
      return false;
    }
  };

  // Remove a product from compare list
  const removeFromCompare = (productId) => {
    const updatedList = compareList.filter(product => product._id !== productId);
    setCompareList(updatedList);
    localStorage.setItem('compareList', JSON.stringify(updatedList));
  };

  // Clear all products from compare list
  const clearCompareList = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
  };

  // Check if a product is in the compare list
  const isInCompareList = (productId) => {
    if (!productId || !compareList || compareList.length === 0) {
      return false;
    }
    return compareList.some(item => item._id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        loading,
        error,
        addToCompare,
        removeFromCompare,
        clearCompareList,
        isInCompareList
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
