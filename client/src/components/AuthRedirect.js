import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component doesn't render anything, it just handles authentication redirects
const AuthRedirect = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of routes that require authentication
    const protectedRoutes = [
      '/profile',
      '/shipping',
      '/payment',
      '/placeorder',
      '/addresses',
      '/address/',
      '/orderhistory',
      '/admin/'
    ];

    // Check if current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
      location.pathname.startsWith(route)
    );

    // If user is not logged in and trying to access a protected route, redirect to login
    if (!userInfo && isProtectedRoute) {
      navigate('/login');
    }

    // If user is logged in but not an admin and trying to access admin routes
    if (userInfo && userInfo.role !== 'admin' && location.pathname.startsWith('/admin/')) {
      navigate('/');
    }
  }, [userInfo, location.pathname, navigate]);

  // This component doesn't render anything
  return null;
};

export default AuthRedirect;
