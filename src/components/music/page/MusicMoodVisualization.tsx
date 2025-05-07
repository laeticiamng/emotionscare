
import React from 'react';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';

interface MusicMoodVisualizationProps {
  mood: string;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ mood }) => {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 p-4">
      <h3 className="font-medium mb-3">Visualisation pour ambiance "{mood}"</h3>
      <div className="h-[180px]">
        <EnhancedMusicVisualizer 
          emotion={mood}
          height={160}
          showControls={false}
        />
      </div>
    </div>
  );
};

export default MusicMoodVisualization;
