
import React, { useState } from 'react';
import { useMusic } from '@/contexts/music';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

const MusicCreator: React.FC = () => {
  const { playTrack } = useMusic();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt requis',
        description: 'Veuillez entrer une description pour générer de la musique',
        variant: 'warning'
      });
      return;
    }
    
    setGenerating(true);
    
    // Demo: Mock generation that takes 2 seconds
    setTimeout(() => {
      // Create a mock track
      const track: MusicTrack = {
        id: `gen-${Date.now()}`,
        title: `Musique basée sur "${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}"`,
        artist: 'IA Compositeur',
        duration: 180,
        url: '/sounds/ambient-calm.mp3',
        audioUrl: '/sounds/ambient-calm.mp3', 
        coverUrl: '/images/tracks/generated.jpg',
        emotionalTone: 'calm'
      };
      
      // Play the generated track
      playTrack(track);
      
      toast({
        title: 'Musique générée',
        description: 'Votre musique personnalisée est maintenant en lecture',
        variant: 'success'
      });
      
      setGenerating(false);
      setPrompt('');
    }, 2000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer de la Musique avec l'IA</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Décrivez la musique que vous souhaitez créer... Par exemple : 'Une mélodie relaxante avec des sons de pluie et de piano doux'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px]"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          className="w-full" 
          disabled={generating}
        >
          {generating ? 'Génération en cours...' : 'Générer une musique'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicCreator;
