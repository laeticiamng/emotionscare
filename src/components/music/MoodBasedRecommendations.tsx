
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Music, Sparkles, HeadphonesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusicalCreation } from '@/hooks/useMusicalCreation';
import { useMusic } from '@/contexts/MusicContext';
import { Progress } from '@/components/ui/progress';

const moodTemplates = {
  happy: {
    title: "Mélodie Joyeuse",
    prompt: "Une chanson pop entraînante avec des accords majeurs, une mélodie positive et des rythmes dynamiques",
    genre: "pop",
    tempo: 80,
    instrumental: false,
    lyrics: "La vie est belle sous le soleil\nChaque jour est une nouvelle chance\nDe sourire et d'être heureux\nEmbrasse le moment présent"
  },
  calm: {
    title: "Tranquillité Sonore",
    prompt: "Une composition ambient avec des nappes de synthé relaxantes, des mélodies douces et une ambiance zen",
    genre: "ambient",
    tempo: 30,
    instrumental: true,
    lyrics: ""
  },
  focused: {
    title: "Concentration Profonde",
    prompt: "Une musique électronique minimaliste avec des rythmes subtils et des sonorités cristallines propices à la concentration",
    genre: "electronic",
    tempo: 50,
    instrumental: true,
    lyrics: ""
  },
  energetic: {
    title: "Boost d'Énergie",
    prompt: "Un morceau électronique rythmé avec des percussions énergiques, des montées et des drops dynamiques",
    genre: "electronic",
    tempo: 90,
    instrumental: true,
    lyrics: ""
  },
  melancholic: {
    title: "Mélancolie Poétique",
    prompt: "Une ballade piano-voix mélancolique avec des harmonies mineurs et une ambiance intime",
    genre: "piano",
    tempo: 40,
    instrumental: false,
    lyrics: "Les souvenirs s'effacent comme des traces dans le sable\nMais ton image reste gravée dans mon cœur\nLe temps passe mais certaines choses demeurent\nComme cette douce mélancolie qui m'habite"
  }
};

const genres = [
  { value: "pop", label: "Pop" },
  { value: "rock", label: "Rock" },
  { value: "electronic", label: "Électronique" },
  { value: "ambient", label: "Ambient" },
  { value: "classical", label: "Classique" },
  { value: "jazz", label: "Jazz" },
  { value: "piano", label: "Piano solo" },
  { value: "hiphop", label: "Hip-Hop" }
];

const MoodBasedRecommendations = ({ currentEmotion }: { currentEmotion?: string }) => {
  const [selectedMood, setSelectedMood] = useState(currentEmotion || "happy");
  const [customTitle, setCustomTitle] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customGenre, setCustomGenre] = useState("pop");
  const [customTempo, setCustomTempo] = useState(50);
  const [customInstrumental, setCustomInstrumental] = useState(false);
  const [customLyrics, setCustomLyrics] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const { toast } = useToast();
  const { createMusicTrack, isLoading, isProcessing, progress } = useMusicalCreation();
  
  // Map detected emotion to our mood types
  const getMoodFromEmotion = (emotion?: string) => {
    if (!emotion) return "happy";
    
    const emotionLower = emotion.toLowerCase();
    if (emotionLower.includes("happy") || emotionLower.includes("joy")) return "happy";
    if (emotionLower.includes("calm") || emotionLower.includes("peaceful")) return "calm";
    if (emotionLower.includes("focus") || emotionLower.includes("concentr")) return "focused";
    if (emotionLower.includes("energ") || emotionLower.includes("activ")) return "energetic";
    if (emotionLower.includes("sad") || emotionLower.includes("melanch")) return "melancholic";
    
    return "happy"; // default
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setIsCustomMode(false);
  };
  
  // Handle custom mode toggle
  const handleCustomModeToggle = () => {
    if (!isCustomMode) {
      // Initialize with selected mood template
      const template = moodTemplates[selectedMood as keyof typeof moodTemplates];
      setCustomTitle(template.title);
      setCustomPrompt(template.prompt);
      setCustomGenre(template.genre);
      setCustomTempo(template.tempo);
      setCustomInstrumental(template.instrumental);
      setCustomLyrics(template.lyrics);
    }
    setIsCustomMode(!isCustomMode);
  };
  
  // Generate music based on selected mood or custom settings
  const handleGenerateMusic = async () => {
    try {
      if (isCustomMode) {
        // Use custom settings
        await createMusicTrack({
          title: customTitle || `Création ${new Date().toLocaleDateString()}`,
          prompt: `${customPrompt} dans le style ${customGenre} avec un tempo ${customTempo > 70 ? 'rapide' : customTempo > 40 ? 'modéré' : 'lent'}`,
          lyrics: customInstrumental ? undefined : customLyrics,
          instrumental: customInstrumental
        });
      } else {
        // Use template settings
        const template = moodTemplates[selectedMood as keyof typeof moodTemplates];
        await createMusicTrack({
          title: template.title,
          prompt: template.prompt,
          lyrics: template.instrumental ? undefined : template.lyrics,
          instrumental: template.instrumental
        });
      }
      
      toast({
        title: "Génération musicale lancée",
        description: "Votre musique est en cours de création, cela peut prendre quelques minutes.",
      });
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la génération de la musique.",
        variant: "destructive"
      });
    }
  };
  
  // Define recommended mood based on currentEmotion
  const recommendedMood = getMoodFromEmotion(currentEmotion);
  
  return (
    <div className="space-y-6">
      {currentEmotion && (
        <div className="flex items-center p-3 bg-primary/10 rounded-lg">
          <AlertCircle className="mr-2 h-4 w-4 text-primary" />
          <p className="text-sm">
            Basé sur votre émotion actuelle (<span className="font-medium">{currentEmotion}</span>), 
            nous recommandons une musique de type <span className="font-medium">{recommendedMood}</span>
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="font-medium">Sélectionnez une ambiance musicale</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.keys(moodTemplates).map((mood) => (
            <Button
              key={mood}
              variant={selectedMood === mood ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-20 transition-all"
              onClick={() => handleMoodSelect(mood)}
            >
              <span className="text-lg mb-1">
                {mood === 'happy' ? '😊' : 
                 mood === 'calm' ? '😌' : 
                 mood === 'focused' ? '🧠' : 
                 mood === 'energetic' ? '⚡' : 
                 mood === 'melancholic' ? '🌧️' : '🎵'}
              </span>
              <span className="text-xs capitalize">{mood}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="font-medium">
          {isCustomMode ? "Mode personnalisé" : `Template: ${selectedMood}`}
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleCustomModeToggle}
        >
          {isCustomMode ? "Utiliser le template" : "Personnaliser"}
        </Button>
      </div>
      
      {isCustomMode ? (
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titre</label>
              <Input
                id="title"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Titre de votre création"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">Description musicale</label>
              <Input
                id="prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Décrivez l'ambiance, les instruments, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="genre" className="text-sm font-medium">Genre musical</label>
                <Select value={customGenre} onValueChange={setCustomGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="tempo" className="text-sm font-medium">Tempo</label>
                  <span className="text-xs">
                    {customTempo < 40 ? "Lent" : customTempo < 70 ? "Modéré" : "Rapide"}
                  </span>
                </div>
                <Slider
                  id="tempo"
                  value={[customTempo]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(values) => setCustomTempo(values[0])}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mode instrumental</span>
              <Button 
                variant={customInstrumental ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomInstrumental(!customInstrumental)}
              >
                {customInstrumental ? "Activé" : "Désactivé"}
              </Button>
            </div>
            
            {!customInstrumental && (
              <div className="space-y-2">
                <label htmlFor="lyrics" className="text-sm font-medium">Paroles</label>
                <textarea
                  id="lyrics"
                  value={customLyrics}
                  onChange={(e) => setCustomLyrics(e.target.value)}
                  placeholder="Entrez les paroles de votre chanson"
                  className="w-full h-24 p-2 border rounded-md bg-background resize-none"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {selectedMood && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Titre</span>
                    <span>{moodTemplates[selectedMood as keyof typeof moodTemplates].title}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Genre</span>
                    <Badge variant="outline">
                      {genres.find(g => g.value === moodTemplates[selectedMood as keyof typeof moodTemplates].genre)?.label || "Autre"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tempo</span>
                    <span>
                      {moodTemplates[selectedMood as keyof typeof moodTemplates].tempo < 40 ? "Lent" : 
                       moodTemplates[selectedMood as keyof typeof moodTemplates].tempo < 70 ? "Modéré" : "Rapide"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Type</span>
                    <span>
                      {moodTemplates[selectedMood as keyof typeof moodTemplates].instrumental ? 
                        "Instrumental" : "Avec paroles"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Progress indicator */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Génération en cours...</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="pt-2">
        <Button 
          onClick={handleGenerateMusic} 
          disabled={isLoading || isProcessing}
          className="w-full"
        >
          {isLoading || isProcessing ? (
            <>
              <HeadphonesIcon className="mr-2 h-4 w-4 animate-pulse" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer ma musique
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MoodBasedRecommendations;
