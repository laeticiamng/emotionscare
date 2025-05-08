
import React from 'react';
// Commentons temporairement tous les imports qui pourraient être problématiques
// import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { X } from 'lucide-react';
// import MusicPlayer from './MusicPlayer';

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  // Ne pas rendre le Drawer si pas ouvert
  if (!open) return null;
  
  // STUB de test - version simplifiée sans dépendances externes
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      background: 'white', 
      color: 'black', 
      padding: 20, 
      zIndex: 50, 
      border: '2px solid blue',
      borderRadius: '8px 8px 0 0'
    }}>
      🎵 MusicDrawer stub OK ! Si vous voyez ce message, le problème vient des imports de UI-primitives.
      <div style={{ marginTop: 10 }}>
        <button 
          style={{ background: '#f44336', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px' }}
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default MusicDrawer;
