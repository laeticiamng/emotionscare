import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import RecommendedPresets from '@/components/music/RecommendedPresets';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { 
  Play, Pause, Wand2, Save, Download, ArrowRight, RefreshCcw, 
  Timer, Volume2, Zap, Layers, FileAudio, MusicIcon, History
} from 'lucide-react';

const genres = [
  { value: "ambient", label: "Ambient" },
  { value: "classical", label: "Classique" },
  { value: "jazz", label: "Jazz" },
  { value: "electronic", label: "Électronique" },
  { value: "lofi", label: "Lo-Fi" },
  { value: "meditation", label: "Méditation" },
  { value: "nature", label: "Sons de la nature" },
  { value: "cinematic", label: "Cinématique" },
];

const moods = [
  { value: "happy", label: "Joyeux" },
  { value: "calm", label: "Calme" },
  { value: "energetic", label: "Énergique" },
  { value: "focused", label: "Concentré" },
  { value: "melancholic", label: "Mélancolique" },
];

const instruments = [
  { value: "piano", label: "Piano" },
  { value: "guitar", label: "Guitare" },
  { value: "strings", label: "Cordes" },
  { value: "synth", label: "Synthétiseur" },
  { value: "percussion", label: "Percussions" },
  { value: "flute", label: "Flûte" },
  { value: "saxophone", label: "Saxophone" },
  { value: "trumpet", label: "Trompette" },
];

const MusicCreator: React.FC = () => {
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedTrackUrl, setGeneratedTrackUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { playTrack, openDrawer } = useMusic();

  // Form states
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("ambient");
  const [mood, setMood] = useState("calm");
  const [description, setDescription] = useState("");
  const [tempo, setTempo] = useState([90]);
  const [duration, setDuration] = useState([120]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(["piano"]);
  const [useAI, setUseAI] = useState(true);

  // Simulate generation process
  useEffect(() => {
    let interval: number | null = null;
    
    if (isGenerating) {
      interval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsGenerating(false);
            clearInterval(interval!);
            
            // Simulate a generated track URL
            setGeneratedTrackUrl("/path/to/generated-music.mp3");
            
            toast({
              title: "Musique générée avec succès",
              description: `"${title || 'Nouvelle composition'}" est maintenant disponible`
            });
            
            return 0;
          }
          return prev + 5;
        });
      }, 300);
    } else {
      setProgress(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, toast, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && mode === 'advanced') {
      toast({
        title: "Titre requis",
        description: "Veuillez donner un titre à votre composition",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
  };

  const handlePlayGenerated = () => {
    if (!generatedTrackUrl) return;
    
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Créer un objet de piste compatible et le jouer directement
      const generatedTrack = {
        id: "generated-track",
        title: title || "Nouvelle composition",
        artist: "IA Compositeur",
        duration: duration[0], // Utiliser la durée définie dans le formulaire
        audioUrl: generatedTrackUrl,
        coverUrl: "/images/music-wave.svg"
      };
      
      playTrack(generatedTrack);
      openDrawer();
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setGenre("ambient");
    setMood("calm");
    setDescription("");
    setTempo([90]);
    setDuration([120]);
    setSelectedInstruments(["piano"]);
    setGeneratedTrackUrl(null);
    
    toast({
      title: "Formulaire réinitialisé",
      description: "Toutes les options ont été réinitialisées",
    });
  };

  const toggleInstrument = (value: string) => {
    setSelectedInstruments(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Création de musique personnalisée</h2>
          <p className="text-muted-foreground">Générez des compositions uniques selon vos préférences</p>
        </div>
        
        <div className="flex items-center border rounded-md">
          <Button 
            variant={mode === 'simple' ? "default" : "ghost"} 
            onClick={() => setMode('simple')}
            className="rounded-r-none"
          >
            Mode Simple
          </Button>
          <Button 
            variant={mode === 'advanced' ? "default" : "ghost"} 
            onClick={() => setMode('advanced')}
            className="rounded-l-none"
          >
            Mode Avancé
          </Button>
        </div>
      </div>
      
      {/* Form grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left Side - Configuration Form */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Paramètres de composition</CardTitle>
            <CardDescription>Personnalisez votre musique selon vos préférences</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="simple">
                <TabsList>
                  <TabsTrigger value="simple">Simple</TabsTrigger>
                  <TabsTrigger value="advanced">Avancé</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map(genre => (
                            <SelectItem key={genre.value} value={genre.value}>{genre.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="mood">Ambiance</Label>
                      <Select value={mood} onValueChange={setMood}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une ambiance" />
                        </SelectTrigger>
                        <SelectContent>
                          {moods.map(mood => (
                            <SelectItem key={mood.value} value={mood.value}>{mood.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Durée (secondes)</Label>
                    <Slider
                      value={duration}
                      min={30}
                      max={300}
                      step={30}
                      onValueChange={setDuration}
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDuration(duration[0])}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre de la composition</Label>
                    <Input 
                      type="text" 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Nommez votre chef-d'œuvre" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Décrivez l'ambiance de votre musique" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tempo">Tempo (BPM)</Label>
                      <Slider
                        value={tempo}
                        min={60}
                        max={180}
                        step={1}
                        onValueChange={setTempo}
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {tempo[0]} BPM
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Durée (secondes)</Label>
                      <Slider
                        value={duration}
                        min={30}
                        max={300}
                        step={30}
                        onValueChange={setDuration}
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        {formatDuration(duration[0])}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Instruments</Label>
                    <div className="flex flex-wrap gap-2">
                      {instruments.map(instrument => (
                        <Button
                          key={instrument.value}
                          variant={selectedInstruments.includes(instrument.value) ? "default" : "outline"}
                          onClick={() => toggleInstrument(instrument.value)}
                        >
                          {instrument.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="ai-switch" checked={useAI} onCheckedChange={setUseAI} />
                    <Label htmlFor="ai-switch">
                      Utiliser l'IA pour améliorer la composition
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleResetForm}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                
                <div className="flex gap-2">
                  {generatedTrackUrl && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handlePlayGenerated}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Écouter
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Générer la musique
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Right Side - Presets & Generation Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Présets recommandés</CardTitle>
            <CardDescription>Inspirations pour démarrer rapidement</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RecommendedPresets onSelectPreset={(preset) => {
              setGenre(preset.genre);
              setMood(preset.mood);
              setTempo([preset.tempo]);
              setDuration([preset.duration]);
              if (preset.instruments) {
                setSelectedInstruments(preset.instruments);
              }
              
              toast({
                title: "Preset appliqué",
                description: `${preset.name} a été appliqué avec succès`,
              });
            }} />
            
            {/* Generation progress indicator */}
            {isGenerating && (
              <div className="space-y-2 mt-6">
                <h4 className="font-medium flex items-center">
                  <Zap className="h-4 w-4 mr-2 animate-pulse text-yellow-500" />
                  Génération en cours
                </h4>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Analyse des paramètres</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}
            
            {/* Generated music actions */}
            {generatedTrackUrl && !isGenerating && (
              <div className="space-y-4 mt-6">
                <h4 className="font-medium flex items-center">
                  <FileAudio className="h-4 w-4 mr-2 text-green-500" />
                  Musique générée
                </h4>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer dans la bibliothèque
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le fichier
                  </Button>
                </div>
              </div>
            )}
            
            {/* Generation history */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium flex items-center">
                <History className="h-4 w-4 mr-2" />
                Dernières générations
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Méditation matinale</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2:45</span>
                </div>
                
                <div className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Ambiance de travail</span>
                  </div>
                  <span className="text-xs text-muted-foreground">3:12</span>
                </div>
                
                <div className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded-md cursor-pointer">
                  <div className="flex items-center">
                    <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Relaxation nocturne</span>
                  </div>
                  <span className="text-xs text-muted-foreground">4:05</span>
                </div>
              </div>
              
              <Button variant="link" size="sm" className="w-full">
                Voir l'historique complet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MusicCreator;
