
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Wand2 } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useMusic } from '@/contexts/MusicContext';

const MusicCreator: React.FC = () => {
  const { playTrack } = useMusic();
  const [generating, setGenerating] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [emotion, setEmotion] = useState('calm');
  
  const emotions = [
    { value: 'calm', label: 'Calme' },
    { value: 'happy', label: 'Joyeux' },
    { value: 'focus', label: 'Concentration' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'melancholic', label: 'Mélancolique' }
  ];
  
  const handleGenerate = () => {
    setGenerating(true);
    
    // Simulate AI music generation
    setTimeout(() => {
      const newTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `${emotions.find(e => e.value === emotion)?.label || 'Generated'} Music`,
        artist: 'AI Composer',
        duration: 180,
        audioUrl: '/sample-audio.mp3',
        coverUrl: '/music-cover-placeholder.jpg',
        emotionalTone: emotion
      };
      
      playTrack(newTrack);
      setGenerating(false);
    }, 2000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Créer une musique personnalisée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Émotion</label>
          <Select 
            value={emotion} 
            onValueChange={setEmotion}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisissez une émotion" />
            </SelectTrigger>
            <SelectContent>
              {emotions.map(emotion => (
                <SelectItem key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Intensité</label>
            <span className="text-sm text-muted-foreground">{intensity}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={10}
            max={100}
            step={10}
            onValueChange={(values) => setIntensity(values[0])}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleGenerate}
          disabled={generating}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {generating ? 'Génération en cours...' : 'Générer une musique'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
