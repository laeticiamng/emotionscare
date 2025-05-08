
import React from 'react';
import * as DrawerModule from '@/components/ui/drawer';

// Log what's actually being imported
console.log('▶️ DrawerModule exports:', DrawerModule);

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Drawer component that contains the music player
 */
const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      data-testid="music-drawer-stub"
      className="fixed inset-0 bg-white dark:bg-gray-900 p-8 z-50 flex flex-col items-center justify-center"
    >
      <h1 className="text-2xl font-bold">🎵 Music Drawer Stub 🎵</h1>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Close
      </button>
    </div>
  );
};

export default MusicDrawer;
