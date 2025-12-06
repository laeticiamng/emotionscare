/**
 * Custom router hook - Wrapper unifié pour react-router-dom
 */

import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const back = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const push = useCallback((path: string, state?: unknown) => {
    navigate(path, { state });
  }, [navigate]);

  const replace = useCallback((path: string, state?: unknown) => {
    navigate(path, { replace: true, state });
  }, [navigate]);

  return {
    navigate,
    back,
    push,
    replace,
    location,
    pathname: location.pathname,
    params,
    searchParams,
    setSearchParams,
    query: Object.fromEntries(searchParams.entries()),
  };
}

export default useRouter;