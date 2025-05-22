
import React, { useEffect } from 'react';
import ImmersiveHome from './ImmersiveHome';
import { useNavigate, useLocation } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is coming from elsewhere, record as a homepage visit
  useEffect(() => {
    if (location.state?.from !== '/') {
      console.log('User visited homepage');
    }
  }, [location.state]);

  return <ImmersiveHome />;
};

export default Home;
