
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import PostLoginTransition from './PostLoginTransition';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const [showTransition, setShowTransition] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Detect when user has just logged in
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    
    if (justLoggedIn && !location.pathname.includes('/dashboard')) {
      setShowTransition(true);
      sessionStorage.removeItem('just_logged_in');
    }
  }, [location.pathname]);
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate('/dashboard');
  };

  // This is a mock user for demonstration
  const mockUser = {
    name: 'User'
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
