import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeLoginPath } from '@/utils/userModeHelpers';

interface LoginRedirectProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const LoginRedirect: React.FC<LoginRedirectProps> = ({ 
  redirectTo, 
  children 
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  useEffect(() => {
    if (!isAuthenticated) {
      const loginPath = redirectTo || getModeLoginPath(userMode);
      navigate(loginPath);
    }
  }, [isAuthenticated, userMode, redirectTo, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default LoginRedirect;