// @ts-nocheck
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { logger } from '@/lib/logger';

export interface B2BModeGuardProps {
  children: React.ReactNode;
  requiredMode?: 'b2b_user' | 'b2b_admin';
}

const B2BModeGuard: React.FC<B2BModeGuardProps> = ({ children, requiredMode }) => {
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const normalized = normalizeUserMode(userMode);
    const expected = requiredMode || (location.pathname.includes('/b2b/admin') ? 'b2b_admin' : 'b2b_user');
    if (normalized !== expected) {
      logger.warn('B2BModeGuard access blocked without valid selection', {
        path: location.pathname,
        userMode,
        expected
      });
      navigate('/entreprise', { replace: true });
    }
  }, [userMode, requiredMode, navigate, location.pathname]);

  return <>{children}</>;
};

export default B2BModeGuard;
