
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHomePath } from '@/utils/roleUtils';

export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't do anything while authentication is still being loaded
    if (isLoading) return;
    
    // Only redirect if user is authenticated AND currently on the login/register page or root
    // This prevents redirecting users who are already browsing the app
    const isLoginOrRegisterPage = 
      location.pathname === '/' || 
      location.pathname.includes('/login') || 
      location.pathname.includes('/register');
    
    if (isAuthenticated && user && isLoginOrRegisterPage) {
      navigate(getRoleHomePath(user.role));
    }
  }, [isAuthenticated, user, isLoading, navigate, location]);
  
  return { user, isAuthenticated, isLoading };
}

export default useRoleRedirect;
