
import React, { useEffect } from 'react';
import * as DrawerUI from '@/components/ui/drawer';
import MusicPlayer from './MusicPlayer';
import useLogger from "@/hooks/useLogger";

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Drawer component that contains the music player - stubbed version
 */
const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const logger = useLogger('MusicDrawer-Stub');
  
  // Debug all imports to identify undefined components
  useEffect(() => {
    console.group('🔍 Imports MusicDrawer');
    console.log('→ MusicDrawer:', typeof MusicDrawer);
    console.log('→ MusicPlayer:', typeof MusicPlayer);
    Object.entries(DrawerUI).forEach(([k, v]) =>
      console.log(`→ DrawerUI.${k}:`, typeof v)
    );
    console.groupEnd();
    
    logger.debug('MusicDrawer stub mounted', { open });
    console.log('🔍 MusicDrawer stub mounted, open=', open);
  }, [open, logger]);
  
  // Don't render anything if not open
  if (!open) return null;
  
  // Render a simple stub first to isolate the issue
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '300px',
      background: '#ddd',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
      padding: '1rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2>Lecteur de musique</h2>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{
        padding: '1rem',
        background: '#eee',
        borderRadius: '4px',
        flex: 1
      }}>
        ✅ MusicDrawer Stub OK!
      </div>
    </div>
  );
};

export default MusicDrawer;
