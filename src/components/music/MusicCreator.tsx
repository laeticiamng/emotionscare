
import React, { useState } from 'react';
import { useMusic } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MusicIcon, Wand2 } from 'lucide-react';

const MusicCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { playTrack, generateMusic } = useMusic();
  
  const handleGenerate = async () => {
    if (!prompt.trim() || !generateMusic) return;
    
    setIsGenerating(true);
    
    try {
      const generatedTrack = await generateMusic(prompt);
      
      if (playTrack) {
        const trackWithRequiredProps = {
          id: generatedTrack.id,
          name: generatedTrack.title,
          title: generatedTrack.title,
          artist: generatedTrack.artist || 'IA Music Generator',
          url: generatedTrack.audioUrl || '',
          src: generatedTrack.audioUrl || '',
          audioUrl: generatedTrack.audioUrl || '',
          cover: generatedTrack.coverUrl || '',
          duration: generatedTrack.duration || 180, // Ajout de la durée par défaut
        };
        playTrack(trackWithRequiredProps);
      }
      
      setPrompt('');
    } catch (error) {
      console.error('Error generating music:', error);
    } finally {
      setIsGenerating(false);
    }
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
