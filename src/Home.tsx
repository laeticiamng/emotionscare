
import React, { useEffect, Suspense } from 'react';
import MusicDrawer from '@/components/music/player/MusicDrawer';
import MiniPlayer from '@/components/music/player/MiniPlayer';
import { useNavigate, useLocation } from 'react-router-dom';
import { logModeSelection } from './utils/modeSelectionLogger';
import { ImmersiveHome } from '@/utils/lazyRoutes';
import { ComponentLoadingFallback } from '@/components/ui/loading-fallback';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If user is coming from elsewhere, record as a homepage visit
  useEffect(() => {
    if (location.state?.from !== '/') {
      logModeSelection('home_view');
    }
  }, [location.state]);

  return (
    <div className="relative">
      <Suspense fallback={<ComponentLoadingFallback />}>
        <ImmersiveHome />
      </Suspense>
      
      {/* Mini Player fixe en bas à droite */}
      <MiniPlayer onExpand={() => {}} />
      
      {/* Drawer musical accessible depuis le bouton en bas à gauche */}
      <MusicDrawer />
    </div>
  );
};

export default Home;
