
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Function to determine the home path based on user role
export const getRoleHomePath = (role?: string): string => {
  switch(role) {
    case 'b2b_admin':
      return '/b2b/admin';
    case 'b2b_user':
      return '/b2b/user';
    case 'b2c':
    default:
      return '/b2c';
  }
};

export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't do anything while authentication is still being loaded
    if (isLoading) return;
    
    // Only redirect if user is authenticated AND currently on the explicit login/register page or root
    // This prevents redirecting users who are already browsing the app
    const isExplicitLoginPage = 
      location.pathname === '/' || 
      location.pathname === '/b2c/login' ||
      location.pathname === '/b2c/register' ||
      location.pathname === '/b2b/user/login' ||
      location.pathname === '/b2b/admin/login';
    
    if (isAuthenticated && user && isExplicitLoginPage) {
      navigate(getRoleHomePath(user.role));
    }
    // Never redirect just because the menu is opened
  }, [isAuthenticated, user, isLoading, navigate, location.pathname]);
  
  return { user, isAuthenticated, isLoading };
}

export default useRoleRedirect;
