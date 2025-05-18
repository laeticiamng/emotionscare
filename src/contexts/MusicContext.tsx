
import React from 'react';
import { MusicProvider, useMusic } from './music';

// Ce composant est utilisé comme un point d'entrée pour le contexte musical
const MusicContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MusicProvider>{children}</MusicProvider>;
};

export { useMusic };
export default MusicContext;
