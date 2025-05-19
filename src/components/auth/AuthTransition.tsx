
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PostLoginTransition from './PostLoginTransition';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const [showTransition, setShowTransition] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // On détecte si l'utilisateur vient de se connecter
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    
    if (justLoggedIn && isAuthenticated && !location.pathname.includes('/dashboard')) {
      setShowTransition(true);
      sessionStorage.removeItem('just_logged_in');
    }
  }, [isAuthenticated, location.pathname]);
  
  const handleTransitionComplete = () => {
    setShowTransition(false);
    navigate('/dashboard');
  };
  
  return (
    <>
      {children}
      <PostLoginTransition 
        show={showTransition} 
        onComplete={handleTransitionComplete}
        userName={user?.name}
      />
    </>
  );
};

export default AuthTransition;
