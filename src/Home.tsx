
import React, { useEffect } from 'react';
import ImmersiveHome from './pages/ImmersiveHome';
import { useNavigate, useLocation } from 'react-router-dom';
import { logModeSelection } from './utils/modeSelectionLogger';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is coming from elsewhere, record as a homepage visit
  useEffect(() => {
    if (location.state?.from !== '/') {
      logModeSelection('home_view');
    }
  }, [location.state]);

  return <ImmersiveHome />;
};

export default Home;
