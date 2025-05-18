
import { useContext } from 'react';
import MusicContext from '@/contexts/music';

export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};

export default useMusic;
