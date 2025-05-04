import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  return (
    <Button 
      variant={darkMode ? "dark" : "light"}
      className="theme-toggle-btn d-flex align-items-center justify-content-center"
      onClick={toggleTheme}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="toggle-container">
        <motion.div 
          className="toggle-circle"
          layout
          transition={spring}
          initial={false}
        >
          {darkMode ? <FaMoon className="moon-icon" /> : <FaSun className="sun-icon" />}
        </motion.div>
      </div>
    </Button>
  );
};

export default ThemeToggle;
