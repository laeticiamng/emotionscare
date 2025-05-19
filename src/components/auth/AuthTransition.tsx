
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeMessage from '@/components/transitions/WelcomeMessage';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the timestamp of the last login from session storage
  const getLastLoginTimestamp = useCallback(() => {
    return sessionStorage.getItem('last_login_timestamp');
  }, []);
  
  // Set the timestamp of the current login in session storage
  const setLoginTimestamp = useCallback(() => {
    sessionStorage.setItem('last_login_timestamp', Date.now().toString());
  }, []);
  
  // Check if this is a fresh login
  const isFreshLogin = useCallback(() => {
    const lastLogin = getLastLoginTimestamp();
    const currentTime = Date.now();
    
    // If no last login or login was more than 5 seconds ago
    if (!lastLogin || currentTime - parseInt(lastLogin) > 5000) {
      setLoginTimestamp();
      return true;
    }
    
    return false;
  }, [getLastLoginTimestamp, setLoginTimestamp]);
  
  useEffect(() => {
    // If user is authenticated and just logged in
    if (isAuthenticated && user) {
      const path = location.pathname;
      
      // If on login or register page
      if (path === '/b2c/login' || path === '/b2c/register') {
        // Check if this is a fresh login
        if (isFreshLogin()) {
          // Show welcome message
          setShowWelcome(true);
        } else {
          // Just redirect
          navigate('/b2c/dashboard');
        }
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate, isFreshLogin]);
  
  // Handle completion of welcome message
  const handleWelcomeComplete = () => {
    navigate('/b2c/dashboard');
  };
  
  return (
    <>
      {children}
      
      {/* Welcome message overlay */}
      {showWelcome && (
        <WelcomeMessage onComplete={handleWelcomeComplete} />
      )}
    </>
  );
};

export default AuthTransition;
