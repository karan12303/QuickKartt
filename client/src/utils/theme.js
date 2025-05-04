// Futuristic theme configuration for QuickKart

// Color palette
export const colors = {
  // Primary colors
  primary: {
    main: '#3a86ff', // Bright blue
    light: '#61a0ff',
    dark: '#0066cc',
    gradient: 'linear-gradient(135deg, #3a86ff 0%, #5e60ce 100%)',
  },
  // Secondary colors
  secondary: {
    main: '#ff006e', // Vibrant pink
    light: '#ff4d94',
    dark: '#c80057',
    gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
  },
  // Accent colors
  accent: {
    main: '#fb5607', // Bright orange
    light: '#ff7a38',
    dark: '#d44000',
    gradient: 'linear-gradient(135deg, #fb5607 0%, #ffbe0b 100%)',
  },
  // Neutral colors
  neutral: {
    white: '#ffffff',
    lightGray: '#f8f9fa',
    gray: '#6c757d',
    darkGray: '#343a40',
    black: '#121212',
  },
  // UI feedback colors
  feedback: {
    success: '#00b894',
    warning: '#fdcb6e',
    error: '#ff7675',
    info: '#0984e3',
  },
  // Dark mode colors
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    border: '#333333',
    text: '#e0e0e0',
  },
  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdrop: 'blur(10px)',
  },
};

// Typography
export const typography = {
  fontFamily: {
    primary: "'Poppins', sans-serif",
    secondary: "'Montserrat', sans-serif",
    display: "'Orbitron', sans-serif", // Futuristic display font
    mono: "'Space Mono', monospace", // Futuristic monospace font
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem',  // 36px
    '4xl': '3rem',     // 48px
    '5xl': '4rem',     // 64px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// Spacing
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

// Borders
export const borders = {
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',   // Fully rounded
  },
  width: {
    none: '0',
    thin: '1px',
    thick: '2px',
    thicker: '4px',
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  lg: '0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 40px rgba(0, 0, 0, 0.1)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(58, 134, 255, 0.5)',
  neon: '0 0 10px rgba(58, 134, 255, 0.8), 0 0 20px rgba(58, 134, 255, 0.6), 0 0 30px rgba(58, 134, 255, 0.4)',
  glow: '0 0 15px rgba(255, 0, 110, 0.7)',
};

// Z-index
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
};

// Transitions
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '1000ms',
  },
  timing: {
    ease: 'ease',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  '2xl': '1400px',
};

// Glassmorphism styles
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  dark: {
    background: 'rgba(18, 18, 18, 0.75)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
};

// Neumorphism styles
export const neumorphism = {
  light: {
    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
    background: '#f0f0f0',
    borderRadius: '24px',
  },
  dark: {
    boxShadow: '20px 20px 60px #0f0f0f, -20px -20px 60px #1d1d1d',
    background: '#161616',
    borderRadius: '24px',
  },
};

// Gradient styles
export const gradients = {
  primary: 'linear-gradient(135deg, #3a86ff 0%, #5e60ce 100%)',
  secondary: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
  accent: 'linear-gradient(135deg, #fb5607 0%, #ffbe0b 100%)',
  futuristic: 'linear-gradient(135deg, #00F5A0 0%, #00D9F5 100%)',
  neon: 'linear-gradient(135deg, #f5005e 0%, #b300ff 100%)',
  cyber: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
  holographic: 'linear-gradient(135deg, #8a2be2 0%, #ffa500 25%, #f5005e 50%, #00d9f5 75%, #8a2be2 100%)',
};

// Export the complete theme
export const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  glassmorphism,
  neumorphism,
  gradients,
};
