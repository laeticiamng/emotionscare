import { useState } from 'react';
import { logger } from '@/lib/logger';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MusicIcon, Wand2 } from 'lucide-react';
import type {} from '@/types/music';

const MusicCreator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateMusicForEmotion, play } = useMusic();
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const generatedTrack = await generateMusicForEmotion('custom', prompt);
      
      if (generatedTrack) {
        await play(generatedTrack);
      }
      
      setPrompt('');
    } catch (error) {
      logger.error('Error generating music', error instanceof Error ? error : new Error(String(error)), 'MUSIC');
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
