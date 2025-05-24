
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Play, Pause, Download, Loader2, Heart, Brain, Zap, Leaf } from 'lucide-react';
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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const moods = [
    { value: 'relaxing', label: 'Relaxant', icon: <Leaf className="h-4 w-4" /> },
    { value: 'energetic', label: 'Énergique', icon: <Zap className="h-4 w-4" /> },
    { value: 'peaceful', label: 'Paisible', icon: <Heart className="h-4 w-4" /> },
    { value: 'focus', label: 'Concentration', icon: <Brain className="h-4 w-4" /> }
  ];

  const presetPrompts = [
    "Musique douce pour méditation avec sons de la nature",
    "Mélodie piano apaisante pour dormir",
    "Musique énergique pour sport et motivation",
    "Sons binauraux pour concentration au travail",
    "Ambiance zen avec instruments traditionnels"
  ];

  const generateMusic = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez décrire la musique que vous souhaitez');
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

      if (data.success) {
        setGeneratedMusic(data);
        toast.success('Musique générée avec succès !');
      } else {
        throw new Error(data.error || 'Erreur lors de la génération');
      }
    } catch (error: any) {
      console.error('Erreur génération musique:', error);
      toast.error('Erreur lors de la génération: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!generatedMusic) return;

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // For demo, we'll simulate audio playback
      if (!audio) {
        const newAudio = new Audio(generatedMusic.audio_url);
        newAudio.onended = () => setIsPlaying(false);
        newAudio.onerror = () => {
          toast.error('Erreur de lecture audio');
          setIsPlaying(false);
        };
        setAudio(newAudio);
        newAudio.play().then(() => setIsPlaying(true)).catch(() => {
          toast.error('Impossible de lire l\'audio');
        });
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          toast.error('Impossible de lire l\'audio');
        });
      }
    }
  };

  const downloadMusic = () => {
    if (!generatedMusic) return;
    
    // Simulate download for demo
    toast.success('Téléchargement démarré !');
    
    // In a real implementation, you would trigger the actual download:
    // const link = document.createElement('a');
    // link.href = generatedMusic.audio_url;
    // link.download = `music-${Date.now()}.mp3`;
    // link.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Music className="h-8 w-8 text-purple-600" />
          Thérapie Musicale IA
        </h1>
        <p className="text-muted-foreground">
          Créez de la musique personnalisée pour votre bien-être émotionnel
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Créer votre musique</CardTitle>
            <CardDescription>
              Décrivez la musique que vous souhaitez et laissez l'IA la composer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Description de la musique</label>
              <Textarea
                placeholder="Décrivez l'ambiance, les instruments, le style musical..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Suggestions rapides</label>
              <div className="grid grid-cols-1 gap-2">
                {presetPrompts.slice(0, 3).map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(preset)}
                    className="text-left justify-start text-xs"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Ambiance émotionnelle</label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((moodOption) => (
                    <SelectItem key={moodOption.value} value={moodOption.value}>
                      <div className="flex items-center gap-2">
                        {moodOption.icon}
                        {moodOption.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">
                Durée: {duration[0]} secondes
              </label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                max={120}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            <Button 
              onClick={generateMusic} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-4 w-4" />
                  Générer la musique
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Playback Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Votre musique</CardTitle>
            <CardDescription>
              Écoutez et téléchargez votre création musicale
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedMusic ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">Musique générée</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {generatedMusic.prompt.substring(0, 60)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Ambiance: {moods.find(m => m.value === generatedMusic.mood)?.label}</span>
                    <span>•</span>
                    <span>{generatedMusic.duration}s</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={togglePlayback} className="flex-1 max-w-32">
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
                  <Button onClick={downloadMusic} variant="outline" className="flex-1 max-w-32">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Conseil thérapeutique:</strong> Cette musique {generatedMusic.mood === 'relaxing' ? 'favorise la détente et réduit le stress' : 
                    generatedMusic.mood === 'energetic' ? 'booste votre énergie et motivation' :
                    generatedMusic.mood === 'peaceful' ? 'apporte calme et sérénité' :
                    'améliore la concentration et la focus'}. 
                    Écoutez-la régulièrement pour maximiser ses bienfaits.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Music className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-600">Aucune musique générée</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez votre première composition musicale personnalisée
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour une thérapie musicale efficace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Pour la relaxation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Choisissez des tempos lents (60-80 BPM)</li>
                <li>• Privilégiez les instruments doux (piano, flûte)</li>
                <li>• Intégrez des sons de la nature</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Pour la concentration</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Optez pour de la musique sans paroles</li>
                <li>• Utilisez des rythmes réguliers</li>
                <li>• Essayez les fréquences binaurales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Music;
