import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS animation library
export const initializeAnimations = () => {
  // Initialize AOS
  AOS.init({
    duration: 800,
    once: false,
    mirror: true,
    offset: 50,
    easing: 'ease-out-cubic',
  });

  // Refresh AOS on window resize
  const handleResize = () => {
    AOS.refresh();
  };

  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
};

// Framer Motion variants for common animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const slideDown = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2, ease: "easeInOut" }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
  },
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

// Loader animation
export const loaderVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    borderRadius: ["20%", "50%", "20%"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation for notifications or highlights
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating animation for 3D objects or featured elements
export const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
