
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated && user) {
      switch(user.role) {
        case 'b2b_admin':
          navigate('/b2b/admin/dashboard');
          break;
        case 'b2b_user':
          navigate('/b2b/user/dashboard');
          break;
        case 'b2c':
        default:
          navigate('/b2c/dashboard');
          break;
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);
  
  return { user, isAuthenticated, isLoading };
}

export default useRoleRedirect;
