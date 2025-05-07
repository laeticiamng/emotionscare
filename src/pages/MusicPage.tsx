
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import ProtectedLayout from '@/components/ProtectedLayout';
import MusicPlayerCard from '@/components/music/page/MusicPlayerCard';
import MusicTabs from '@/components/music/page/MusicTabs';
import { Music } from 'lucide-react';

const MusicPage = () => {
  const { logUserAction } = useActivityLogging('music');
  const [activeTab, setActiveTab] = useState('player');
  
  useEffect(() => {
    logUserAction('visit_music_page');
  }, [logUserAction]);
  
  return (
    <ProtectedLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
        </div>
        
        <MusicPlayerCard />
        <MusicTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ProtectedLayout>
  );
};

export default MusicPage;
