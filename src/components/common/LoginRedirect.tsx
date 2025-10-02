import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeLoginPath } from '@/utils/userModeHelpers';

interface LoginRedirectProps {
  redirectPath?: string;
}

const LoginRedirect: React.FC<LoginRedirectProps> = ({ redirectPath }) => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  
  useEffect(() => {
    const loginPath = getModeLoginPath(userMode as any);
    navigate(redirectPath || loginPath, { replace: true });
  }, [navigate, userMode, redirectPath]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirection vers la page de connexion...</p>
      </div>
    </div>
  );
};

export default LoginRedirect;
