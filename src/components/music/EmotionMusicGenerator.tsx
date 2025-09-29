
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { useMusicControls } from '@/hooks/useMusicControls';

const EmotionMusicGenerator: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [customPrompt, setCustomPrompt] = useState('');
  const { generateMusic, isGenerating, error } = useMusicGeneration();
  const { playTrack } = useMusicControls();

  const emotions = [
    { value: 'calm', label: 'Calme' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'happy', label: 'Joyeux' },
    { value: 'focused', label: 'Concentré' },
    { value: 'relaxed', label: 'Détendu' },
    { value: 'motivated', label: 'Motivé' }
  ];

  const handleGenerate = async () => {
    const track = await generateMusic(selectedEmotion, customPrompt);
    if (track) {
      playTrack(track);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Générer de la musique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="emotion">Émotion</Label>
          <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une émotion" />
            </SelectTrigger>
            <SelectContent>
              {emotions.map((emotion) => (
                <SelectItem key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="prompt">Description personnalisée (optionnel)</Label>
          <Input
            id="prompt"
            placeholder="ex: musique douce avec piano..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer la musique
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicGenerator;
