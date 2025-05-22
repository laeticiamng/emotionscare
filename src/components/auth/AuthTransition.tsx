
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PostLoginTransition from './PostLoginTransition';
import { useAuth } from '@/contexts/AuthContext';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const [showTransition, setShowTransition] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Detect when user has just logged in
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    
    if (justLoggedIn) {
      setShowTransition(true);
      sessionStorage.removeItem('just_logged_in');
    }
  }, [location.pathname]);
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
  };
  
  return (
    <>
      {children}
      {showTransition && (
        <PostLoginTransition 
          show={showTransition} 
          onComplete={handleTransitionComplete}
        />
      )}
    </>
  );
};

export default AuthTransition;
