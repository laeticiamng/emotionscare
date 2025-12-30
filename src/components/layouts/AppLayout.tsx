import React from 'react';
import { Outlet } from 'react-router-dom';
import { InAppNotificationCenter } from '@/components/InAppNotificationCenter';
import GlobalAudioPlayer from '@/components/audio/GlobalAudioPlayer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <InAppNotificationCenter />
      <GlobalAudioPlayer />
    </div>
  );
};

export default AppLayout;