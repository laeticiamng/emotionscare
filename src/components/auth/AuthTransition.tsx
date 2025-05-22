
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PostLoginTransition from './PostLoginTransition';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const [showTransition, setShowTransition] = useState(false);
  const location = useLocation();
  
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

  // This is a mock user for demonstration
  const mockUser = {
    name: 'Utilisateur'
  };
  
  return (
    <>
      {children}
      {showTransition && (
        <PostLoginTransition 
          show={showTransition} 
          onComplete={handleTransitionComplete}
          userName={mockUser?.name}
        />
      )}
    </>
  );
};

export default AuthTransition;
