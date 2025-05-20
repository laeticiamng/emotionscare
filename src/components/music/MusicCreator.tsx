
import React, { useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MusicIcon, Wand2 } from 'lucide-react';
import { MusicContextType, MusicTrack } from '@/types/music';
import { normalizeTrack } from '@/utils/musicCompatibility';

const MusicCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const music = useMusic() as MusicContextType;
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // If generateMusic isn't available, simulate music creation
      let generatedTrack: MusicTrack;
      
      if (music.generateMusic) {
        const result = await music.generateMusic(prompt);
        if (result && result.tracks && result.tracks.length > 0) {
          // Get the first track from the playlist
          generatedTrack = normalizeTrack(result.tracks[0]);
        } else {
          // Fallback if no tracks were generated
          generatedTrack = createFallbackTrack(prompt);
        }
      } else {
        // Simulation of generation
        generatedTrack = createFallbackTrack(prompt);
      }
      
      if (music.playTrack) {
        music.playTrack(generatedTrack);
      }
      
      setPrompt('');
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to create a fallback track
  const createFallbackTrack = (promptText: string): MusicTrack => {
    return {
      id: `generated-${Date.now()}`,
      title: `Musique basée sur: ${promptText.substring(0, 20)}...`,
      artist: 'IA Music Generator',
      audioUrl: '/audio/generated-sample.mp3',
      url: '/audio/generated-sample.mp3',
      cover: '/images/covers/generated.jpg',
      coverUrl: '/images/covers/generated.jpg',
      duration: 180,
    };
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MusicIcon size={18} />
          Créateur de musique IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Décrivez la musique que vous souhaitez créer... Par exemple : 'Une mélodie relaxante avec des sons de nature'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          onClick={() => setPrompt('')}
          variant="outline"
          disabled={isGenerating || !prompt}
        >
          Effacer
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicCreator;
