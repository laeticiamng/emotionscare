
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  return {
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    hash: location.hash,
    params,
    navigate,
    push: navigate,
    back: () => navigate(-1),
    forward: () => navigate(1),
  };
};

export default useRouter;
