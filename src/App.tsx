/**
 * App.tsx - Point d'entrée de redirection vers RouterV2
 * 
 * NOTE: Ce fichier ne devrait PAS être utilisé directement.
 * L'application principale utilise main.tsx -> RouterV2.
 * Ce fichier existe uniquement pour la compatibilité avec certains tests.
 */

import { RouterProvider } from 'react-router-dom';
import { router } from '@/routerV2';
import { RootProvider } from '@/providers';
import './index.css';

function App() {
  return (
    <RootProvider>
      <RouterProvider router={router} />
    </RootProvider>
  );
}

export default App;
