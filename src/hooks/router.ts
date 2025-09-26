/**
 * Hook router pour la navigation
 */

import { useNavigate, useLocation } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    navigate: (path: string) => navigate(path),
    back: () => navigate(-1),
    location,
    pathname: location.pathname,
  };
}