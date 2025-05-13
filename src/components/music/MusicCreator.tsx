import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music, Save, Sparkles, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicTrack } from '@/types/music';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { topMediaMusicService } from '@/services/music/topMediaService';
import { useAuth } from '@/contexts/AuthContext';

const MusicCreator: React.FC = () => {
  const { toast } = useToast();
  const { playTrack } = useMusic();
  const { user } = useAuth();
  
  const [emotion, setEmotion] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [generationStep, setGenerationStep] = useState<'input' | 'generating' | 'checking' | 'complete'>('input');
  const [songId, setSongId] = useState<string | null>(null);
  const [lyricsEnabled, setLyricsEnabled] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);

  const emotions = [
    { value: 'happy', label: 'Joie' },
    { value: 'calm', label: 'Calme' },
    { value: 'energetic', label: 'Énergique' },
    { value: 'focused', label: 'Concentration' },
    { value: 'melancholic', label: 'Mélancolie' },
    { value: 'relaxed', label: 'Relaxation' }
  ];

  useEffect(() => {
    // Clear interval when component unmounts
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Effect to update emotion suggestion when selecting an emotion
  useEffect(() => {
    if (selectedEmotion) {
      const suggestion = topMediaMusicService.getMoodSuggestions(selectedEmotion);
      setPrompt(suggestion.prompt);
      
      if (suggestion.lyrics && suggestion.lyrics.length > 0) {
        setLyrics(suggestion.lyrics);
      }
      
      if (!title) {
        setTitle(suggestion.title);
      }
      
      setLyricsEnabled(!suggestion.instrumental);
    }
  }, [selectedEmotion, title]);

  const generateLyrics = async () => {
    if (!selectedEmotion && !prompt) {
      toast({
        title: "Information manquante",
        description: "Veuillez sélectionner une émotion ou décrire le style souhaité",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const generatedLyrics = await topMediaMusicService.generateLyrics(
        prompt || `Lyrics for a ${selectedEmotion} song`
      );
      
      setLyrics(generatedLyrics);
      
      toast({
        title: "Paroles générées",
        description: "Les paroles ont été générées avec succès.",
      });
    } catch (error) {
      console.error("Error generating lyrics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les paroles. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTrack = async () => {
    if (!selectedEmotion && !prompt) {
      toast({
        title: "Information manquante",
        description: "Veuillez sélectionner une émotion ou décrire la musique souhaitée",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setGenerationStep('generating');
    
    try {
      // Use the TopMedia API to generate a song
      const params = {
        is_auto: 1,
        prompt: prompt || `A ${selectedEmotion} mood music`,
        lyrics: lyricsEnabled && lyrics ? lyrics : undefined,
        title: title || `${selectedEmotion || 'Custom'} Melody`,
        instrumental: lyricsEnabled ? 0 : 1,
        mood: selectedEmotion || undefined
      };
      
      const { song_id } = await topMediaMusicService.generateMusic(params);
      setSongId(song_id);
      
      toast({
        title: "Génération en cours",
        description: "Votre musique est en cours de création. Cela peut prendre quelques instants.",
      });
      
      // Start checking the status
      setGenerationStep('checking');
      const interval = setInterval(async () => {
        const status = await topMediaMusicService.checkGenerationStatus(song_id);
        
        if (status.progress) {
          setProgress(status.progress);
        }
        
        if (status.status === 'completed' && status.url) {
          clearInterval(interval);
          setStatusCheckInterval(null);
          
          // Create track object from generated song
          const track: MusicTrack = {
            id: song_id,
            title: title || `${selectedEmotion || 'Custom'} Melody`,
            artist: 'TopMedia AI',
            duration: 180, // Default duration
            url: status.url,
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            emotion: selectedEmotion || undefined
          };
          
          setGeneratedTrack(track);
          setGenerationStep('complete');
          
          toast({
            title: "Musique générée",
            description: "Votre création musicale personnalisée est prête à être écoutée",
          });
        } else if (status.status === 'failed') {
          clearInterval(interval);
          setStatusCheckInterval(null);
          setGenerationStep('input');
          
          toast({
            title: "Échec de la génération",
            description: "Une erreur s'est produite lors de la génération de la musique. Veuillez réessayer.",
            variant: "destructive"
          });
        }
      }, 5000);
      
      setStatusCheckInterval(interval);
    } catch (error) {
      console.error("Error generating music:", error);
      setGenerationStep('input');
      toast({
        title: "Erreur de génération",
        description: "Une erreur s'est produite lors de la génération de la musique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const playGeneratedTrack = () => {
    if (generatedTrack) {
      playTrack(generatedTrack);
    }
  };

  const saveToLibrary = async () => {
    if (!generatedTrack || !user?.id) return;
    
    try {
      const saved = await topMediaMusicService.saveToUserLibrary(user.id, generatedTrack);
      
      if (saved) {
        toast({
          title: "Sauvegardé",
          description: "La musique a été ajoutée à votre bibliothèque personnelle",
        });
        
        // Reset form
        setGeneratedTrack(null);
        setEmotion('');
        setPrompt('');
        setSelectedEmotion('');
        setTitle('');
        setLyrics('');
        setGenerationStep('input');
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder la musique",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving to library:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Créateur de musique IA</CardTitle>
        <CardDescription>
          Créez une musique personnalisée basée sur vos émotions ou une description textuelle
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generationStep === 'input' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emotion-select">Choisissez une émotion</Label>
              <Select 
                value={selectedEmotion}
                onValueChange={setSelectedEmotion}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une émotion" />
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
            
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la musique</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Mélodie du matin"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prompt">Description du style musical</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez l'ambiance, le style musical ou les instruments souhaités..."
                className="h-24"
                disabled={loading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable-lyrics"
                checked={lyricsEnabled}
                onChange={(e) => setLyricsEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="enable-lyrics">Inclure des paroles</Label>
            </div>
            
            {lyricsEnabled && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="lyrics">Paroles</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={generateLyrics}
                    disabled={loading}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Générer des paroles
                  </Button>
                </div>
                <Textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Entrez les paroles pour votre musique..."
                  className="h-32"
                  disabled={loading}
                />
              </div>
            )}
            
            <Button 
              onClick={generateTrack} 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Préparation en cours...
                </>
              ) : (
                <>
                  <Music className="mr-2 h-4 w-4" />
                  Générer ma musique
                </>
              )}
            </Button>
          </div>
        )}
        
        {(generationStep === 'generating' || generationStep === 'checking') && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 mb-4 relative">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold">
              {generationStep === 'generating' ? 'Création de votre musique...' : 'Traitement en cours...'}
            </h3>
            
            <p className="text-muted-foreground text-center max-w-sm">
              {generationStep === 'generating' 
                ? "Nous composons votre musique personnalisée. Cela peut prendre quelques instants."
                : "Votre musique est en cours de finalisation. Merci de patienter."}
            </p>
            
            {progress > 0 && (
              <div className="w-full max-w-xs">
                <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">{progress}%</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => {
                if (statusCheckInterval) {
                  clearInterval(statusCheckInterval);
                  setStatusCheckInterval(null);
                }
                setGenerationStep('input');
              }}
              className="mt-6"
            >
              Annuler
            </Button>
          </div>
        )}
        
        {generationStep === 'complete' && generatedTrack && (
          <div className="mt-2 space-y-5">
            <div className="rounded-lg overflow-hidden bg-muted/30 p-4 border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {generatedTrack.coverUrl ? (
                    <img 
                      src={generatedTrack.coverUrl} 
                      alt={generatedTrack.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Music className="h-10 w-10 text-primary/50" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{generatedTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">Par {generatedTrack.artist}</p>
                  {selectedEmotion && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {emotions.find(e => e.value === selectedEmotion)?.label || selectedEmotion}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="default" 
                  onClick={playGeneratedTrack}
                  className="flex-1"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Écouter
                </Button>
                <Button 
                  variant="outline" 
                  onClick={saveToLibrary}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Ajouter à ma bibliothèque
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                setGeneratedTrack(null);
                setEmotion('');
                setPrompt('');
                setSelectedEmotion('');
                setTitle('');
                setLyrics('');
                setGenerationStep('input');
              }}
            >
              Créer une nouvelle musique
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicCreator;
