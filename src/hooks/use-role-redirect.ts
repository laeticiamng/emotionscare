
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHomePath } from '@/utils/roleUtils';

export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated && user) {
      navigate(getRoleHomePath(user.role));
    }
  }, [isAuthenticated, user, isLoading, navigate]);
  
  return { user, isAuthenticated, isLoading };
}

export default useRoleRedirect;
