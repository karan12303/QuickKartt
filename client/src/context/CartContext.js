import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {}
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : {}
  );

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save shipping address to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  // Save payment method to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
  }, [paymentMethod]);

  // Add item to cart
  const addToCart = async (id, qty, variations = null) => {
    try {
      // Ensure id is a string, not an object
      if (typeof id === 'object') {
        console.error('Invalid product ID type:', typeof id, id);
        if (id._id) {
          id = id._id.toString();
        } else {
          id = id.toString(); // Try to convert to string
        }
      }

      // Make sure id is a valid MongoDB ObjectId (24 hex characters)
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        console.error('Invalid MongoDB ObjectId format:', id);
        throw new Error('Invalid product ID format');
      }

      console.log('Adding to cart, product ID:', id);
      const { data } = await axios.get(`/api/products/${id}`);
      console.log('Product data for cart:', data);

      // Ensure imageUrl exists
      if (!data.imageUrl) {
        console.warn(`Product ${data.name} is missing imageUrl, using placeholder`);
      }

      // Create a unique key for the cart item based on product ID and variations
      let cartItemKey = id;
      let variationDetails = {};

      // If the product has variations, create a unique key and store variation details
      if (variations && variations.hasVariations) {
        if (variations.footwearSize) {
          cartItemKey = `${id}_uk${variations.footwearSize.ukSize}_us${variations.footwearSize.usSize}`;
          variationDetails = {
            hasVariations: true,
            footwearSize: {
              ukSize: variations.footwearSize.ukSize,
              usSize: variations.footwearSize.usSize
            }
          };
        } else if (variations.smartphoneSpec) {
          cartItemKey = `${id}_${variations.smartphoneSpec.model}_${variations.smartphoneSpec.storage}_${variations.smartphoneSpec.ram}`;
          variationDetails = {
            hasVariations: true,
            smartphoneSpec: {
              model: variations.smartphoneSpec.model,
              storage: variations.smartphoneSpec.storage,
              ram: variations.smartphoneSpec.ram
            }
          };
        }
      }

      setCartItems((prevItems) => {
        // Find if this exact item (with variations) exists in cart
        const existItem = prevItems.find((item) =>
          variations && variations.hasVariations
            ? item.cartItemKey === cartItemKey
            : item.product === id
        );

        if (existItem) {
          return prevItems.map((item) =>
            (variations && variations.hasVariations
              ? item.cartItemKey === cartItemKey
              : item.product === id)
            ? {
              ...item,
              qty,
              // Ensure imageUrl is always set
              imageUrl: item.imageUrl || data.imageUrl || 'https://via.placeholder.com/150'
            } : item
          );
        } else {
          // Determine available stock based on variations
          let availableStock = data.countInStock;

          if (variations && variations.hasVariations) {
            if (variations.footwearSize) {
              availableStock = variations.footwearSize.countInStock;
            } else if (variations.smartphoneSpec) {
              availableStock = variations.smartphoneSpec.countInStock;
            }
          }

          return [
            ...prevItems,
            {
              product: data._id,
              cartItemKey,
              name: data.name,
              imageUrl: data.imageUrl || 'https://via.placeholder.com/150', // Provide a default if missing
              price: data.price,
              countInStock: availableStock,
              qty,
              ...variationDetails
            },
          ];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = (id, isCartItemKey = false) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => isCartItemKey ? item.cartItemKey !== id : item.product !== id)
    );
  };

  // Save shipping address
  const saveShippingAddress = (data) => {
    console.log('Saving shipping address to context:', data);
    setShippingAddress(data);
    // Make sure the data is immediately available in localStorage
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Save payment method
  const savePaymentMethod = (data) => {
    console.log('Saving payment method to context:', data);
    setPaymentMethod(data);
    // Make sure the data is immediately available in localStorage
    localStorage.setItem('paymentMethod', JSON.stringify(data));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
