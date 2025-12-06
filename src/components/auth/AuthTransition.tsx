import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasChecked(true);
      if (!isAuthenticated) {
        navigate('/choose-mode');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !hasChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification de l'authentification..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthTransition;
