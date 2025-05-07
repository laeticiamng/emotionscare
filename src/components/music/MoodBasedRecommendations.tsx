
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlayCircle, Heart, Download, Share2, Filter } from 'lucide-react';

interface MoodTrack {
  id: string;
  title: string;
  description: string;
  mood: string;
  duration: string;
  coverUrl: string;
}

const moodCategories = [
  { id: 'happy', name: 'Heureux', emoji: '😊', color: 'from-yellow-400/80 to-amber-300/80' },
  { id: 'calm', name: 'Calme', emoji: '😌', color: 'from-blue-400/80 to-cyan-300/80' },
  { id: 'energetic', name: 'Énergique', emoji: '⚡', color: 'from-red-400/80 to-orange-300/80' },
  { id: 'focused', name: 'Concentré', emoji: '🧠', color: 'from-purple-400/80 to-violet-300/80' },
  { id: 'melancholic', name: 'Mélancolique', emoji: '🌧️', color: 'from-indigo-400/80 to-blue-300/80' },
];

const moodTracks: Record<string, MoodTrack[]> = {
  'happy': [
    {
      id: 'happy-1',
      title: 'Sunshine Vibes',
      description: 'Une mélodie joyeuse et ensoleillée pour booster votre humeur',
      mood: 'happy',
      duration: '3:24',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'happy-2',
      title: 'Joyful Morning',
      description: 'Démarrez votre journée avec cette composition légère et positive',
      mood: 'happy',
      duration: '2:45',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'happy-3',
      title: 'Positive Thinking',
      description: 'Une mélodie qui inspire des pensées positives et de la joie',
      mood: 'happy',
      duration: '3:12',
      coverUrl: '/images/music-wave.svg'
    },
  ],
  'calm': [
    {
      id: 'calm-1',
      title: 'Ocean Breeze',
      description: 'Des sons apaisants inspirés par l\'océan pour la relaxation',
      mood: 'calm',
      duration: '5:10',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'calm-2',
      title: 'Evening Meditation',
      description: 'Parfait pour méditer ou se détendre en fin de journée',
      mood: 'calm',
      duration: '6:30',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'calm-3',
      title: 'Gentle Rain',
      description: 'Le son apaisant de la pluie pour calmer l\'esprit',
      mood: 'calm',
      duration: '4:55',
      coverUrl: '/images/music-wave.svg'
    },
  ],
  'energetic': [
    {
      id: 'energetic-1',
      title: 'Power Up',
      description: 'Un rythme dynamique pour booster votre énergie',
      mood: 'energetic',
      duration: '2:40',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'energetic-2',
      title: 'Workout Beat',
      description: 'Le compagnon parfait pour vos séances d\'entraînement',
      mood: 'energetic',
      duration: '3:15',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'energetic-3',
      title: 'Morning Boost',
      description: 'Commencez votre journée avec énergie et enthousiasme',
      mood: 'energetic',
      duration: '2:50',
      coverUrl: '/images/music-wave.svg'
    },
  ],
  'focused': [
    {
      id: 'focused-1',
      title: 'Deep Concentration',
      description: 'Pour les moments qui nécessitent une attention totale',
      mood: 'focused',
      duration: '4:20',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'focused-2',
      title: 'Study Session',
      description: 'Optimisez votre temps d\'étude avec cette composition',
      mood: 'focused',
      duration: '5:15',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'focused-3',
      title: 'Clarity',
      description: 'Une musique qui aide à clarifier vos pensées',
      mood: 'focused',
      duration: '3:50',
      coverUrl: '/images/music-wave.svg'
    },
  ],
  'melancholic': [
    {
      id: 'melancholic-1',
      title: 'Rainy Day',
      description: 'Une mélodie contemplative pour les jours de pluie',
      mood: 'melancholic',
      duration: '4:05',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'melancholic-2',
      title: 'Quiet Thoughts',
      description: 'Un espace sonore pour vos moments de réflexion profonde',
      mood: 'melancholic',
      duration: '4:40',
      coverUrl: '/images/music-wave.svg'
    },
    {
      id: 'melancholic-3',
      title: 'Nostalgia',
      description: 'Une composition qui évoque les souvenirs du passé',
      mood: 'melancholic',
      duration: '3:35',
      coverUrl: '/images/music-wave.svg'
    },
  ],
};

const MoodBasedRecommendations: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, openDrawer } = useMusic();

  const handlePlayTrack = (track: MoodTrack) => {
    loadPlaylistForEmotion(track.mood);
    openDrawer();
    
    toast({
      title: "Lecture démarrée",
      description: `"${track.title}" est maintenant en lecture`,
    });
  };

  const handleToggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      if (prev.includes(trackId)) {
        toast({
          title: "Retiré des favoris",
          description: "Ce morceau a été retiré de vos favoris",
          variant: "default",
        });
        return prev.filter(id => id !== trackId);
      } else {
        toast({
          title: "Ajouté aux favoris",
          description: "Ce morceau a été ajouté à vos favoris",
          variant: "default",
        });
        return [...prev, trackId];
      }
    });
  };

  const handleGenerateCustom = () => {
    toast({
      title: "Génération personnalisée",
      description: "Utilisez l'onglet Création avancée pour personnaliser votre musique",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recommandations basées sur l'humeur</h2>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>
      
      <Tabs defaultValue={selectedMood} onValueChange={setSelectedMood} className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          {moodCategories.map((mood) => (
            <TabsTrigger key={mood.id} value={mood.id} className="px-4 py-2">
              <span className="mr-2">{mood.emoji}</span>
              {mood.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {moodCategories.map((mood) => (
          <TabsContent key={mood.id} value={mood.id} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodTracks[mood.id].map((track) => (
                <Card key={track.id} className={`overflow-hidden transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/30`}>
                  <div className={`h-28 bg-gradient-to-r ${mood.color} flex items-center justify-center p-4`}>
                    <img 
                      src={track.coverUrl} 
                      alt={track.title} 
                      className="h-full opacity-40"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription>{track.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Durée: {track.duration}</span>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleFavorite(track.id)}
                          className={favorites.includes(track.id) ? "text-red-500" : ""}
                        >
                          <Heart className="h-5 w-5" fill={favorites.includes(track.id) ? "currentColor" : "none"} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="default" 
                      className="w-full mt-2"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Vous ne trouvez pas ce que vous cherchez?</p>
              <Button onClick={handleGenerateCustom}>Générer une musique personnalisée</Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MoodBasedRecommendations;
