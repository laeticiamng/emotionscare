
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music as MusicIcon, Play, Pause, Download, Loader2, Heart, Brain, Zap, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedMusic {
  audio_url: string;
  duration: number;
  prompt: string;
  mood: string;
  timestamp: string;
}

const Music: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('relaxing');
  const [duration, setDuration] = useState([30]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<GeneratedMusic | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description pour générer de la musique');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-music', {
        body: {
          prompt: prompt.trim(),
          mood,
          duration: duration[0]
        }
      });

      if (error) throw error;

      if (data?.success) {
        setGeneratedMusic(data);
        toast.success('Musique générée avec succès !');
      } else {
        throw new Error(data?.error || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération de musique');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? 'Lecture en pause' : 'Lecture en cours');
  };

  const handleDownload = () => {
    if (generatedMusic?.audio_url) {
      toast.success('Téléchargement initié');
      // Simulate download
      const link = document.createElement('a');
      link.href = generatedMusic.audio_url;
      link.download = `musique-${Date.now()}.mp3`;
      link.click();
    }
  };

  const moodEmojis = {
    relaxing: '😌',
    energetic: '⚡',
    peaceful: '🕊️',
    mysterious: '🌙',
    uplifting: '☀️'
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <MusicIcon className="h-8 w-8 text-primary" />
          Génération de Musique IA
        </h1>
        <p className="text-muted-foreground">
          Créez de la musique personnalisée basée sur vos émotions et préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description musicale</Label>
              <Textarea
                id="prompt"
                placeholder="Décrivez le type de musique que vous souhaitez... (ex: 'Une mélodie douce et apaisante avec des sons de nature')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mood">Humeur {mood && moodEmojis[mood as keyof typeof moodEmojis]}</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une humeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relaxing">😌 Relaxant</SelectItem>
                  <SelectItem value="energetic">⚡ Énergique</SelectItem>
                  <SelectItem value="peaceful">🕊️ Paisible</SelectItem>
                  <SelectItem value="mysterious">🌙 Mystérieux</SelectItem>
                  <SelectItem value="uplifting">☀️ Inspirant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durée: {duration[0]} secondes</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={120}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10s</span>
                <span>120s</span>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Générer la musique
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MusicIcon className="h-5 w-5" />
              Résultat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedMusic ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-medium">Musique générée</h3>
                  <p className="text-sm text-muted-foreground">{generatedMusic.prompt}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      {generatedMusic.mood}
                    </span>
                    <span>{generatedMusic.duration}s</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={togglePlayback} className="flex-1">
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Écouter
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>0:00</span>
                    <span>{Math.floor(generatedMusic.duration / 60)}:{(generatedMusic.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: isPlaying ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MusicIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Aucune musique générée</p>
                <p className="text-sm">Configurez vos paramètres et cliquez sur "Générer"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Préréglages rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Méditation', prompt: 'Sons apaisants avec bols tibétains et nature', mood: 'peaceful', emoji: '🧘' },
              { name: 'Concentration', prompt: 'Musique ambiante pour le travail et la concentration', mood: 'relaxing', emoji: '🎯' },
              { name: 'Motivation', prompt: 'Rythmes énergiques et motivants', mood: 'energetic', emoji: '💪' }
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto p-4 flex flex-col gap-2"
                onClick={() => {
                  setPrompt(preset.prompt);
                  setMood(preset.mood);
                }}
              >
                <span className="text-2xl">{preset.emoji}</span>
                <span className="font-medium">{preset.name}</span>
                <span className="text-sm text-muted-foreground text-center">
                  {preset.prompt.slice(0, 40)}...
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Music;
