
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import AudioEqualizer from '@/components/music/AudioEqualizer';
import MusicMoodVisualization from './MusicMoodVisualization';

const MusicMixer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mixage audio</CardTitle>
          <CardDescription>Ajustez les paramètres audio pour une expérience personnalisée</CardDescription>
        </CardHeader>
        <CardContent>
          <AudioEqualizer />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MusicMoodVisualization mood="calm" />
        <MusicMoodVisualization mood="focused" />
      </div>
    </div>
  );
};

export default MusicMixer;
