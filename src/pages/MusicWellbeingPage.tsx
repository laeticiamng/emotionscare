
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, PlayCircle, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

// Music therapy playlists with descriptions
const musicTherapyPlaylists = [
  {
    id: 'calm',
    name: 'Calme et Sérénité',
    description: 'Mélodies apaisantes pour réduire le stress et l\'anxiété',
    benefits: [
      'Diminution de l\'anxiété',
      'Réduction des tensions musculaires',
      'Aide à l\'endormissement',
    ],
    coverImage: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=2574&auto=format'
  },
  {
    id: 'focus',
    name: 'Concentration',
    description: 'Compositions pour améliorer la concentration et la productivité',
    benefits: [
      'Amélioration de la concentration',
      'Augmentation de la productivité',
      'Réduction des distractions',
    ],
    coverImage: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2670&auto=format'
  },
  {
    id: 'energetic',
    name: 'Énergie Positive',
    description: 'Rythmes dynamisants pour stimuler la motivation et l\'énergie',
    benefits: [
      'Stimulation de la motivation',
      'Amélioration de l\'humeur',
      'Augmentation du dynamisme',
    ],
    coverImage: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=2671&auto=format'
  },
  {
    id: 'happy',
    name: 'Bonheur et Joie',
    description: 'Musiques joyeuses pour élever l\'humeur et générer des émotions positives',
    benefits: [
      'Stimulation des sentiments positifs',
      'Réduction des pensées négatives',
      'Libération de dopamine',
    ],
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format'
  },
];

const MusicWellbeingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    loadPlaylistForEmotion, 
    openDrawer, 
    currentTrack, 
    isPlaying,
    currentEmotion 
  } = useMusic();
  const [activeTab, setActiveTab] = useState('playlists');

  const handlePlayMusic = (playlistId: string) => {
    loadPlaylistForEmotion(playlistId);
    openDrawer();
    
    toast({
      title: "Playlist activée",
      description: `Votre séance musicale "${playlistId}" est prête à être écoutée`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Musicothérapie</h1>
          <p className="text-muted-foreground">
            Le pouvoir réparateur de la musique pour votre bien-être
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Button>
      </div>
      
      {/* Current playing overview */}
      {currentTrack && (
        <Card className="bg-gradient-to-r from-indigo-600/10 to-indigo-400/10">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              {isPlaying ? (
                <Music className="h-8 w-8 text-indigo-600" />
              ) : (
                <Music className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Actuellement</h3>
              <p className="text-xl font-semibold">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentTrack.artist} • Playlist {currentEmotion}
              </p>
            </div>
            <Button 
              className="ml-auto"
              variant={isPlaying ? "default" : "outline"}
              onClick={openDrawer}
            >
              <Headphones className="mr-2 h-4 w-4" />
              {isPlaying ? "Contrôler" : "Reprendre"}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Main Content */}
      <Tabs defaultValue="playlists" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="playlists">Playlists Thérapeutiques</TabsTrigger>
          <TabsTrigger value="science">Science & Bienfaits</TabsTrigger>
        </TabsList>
        
        {/* Playlists Tab */}
        <TabsContent value="playlists" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {musicTherapyPlaylists.map(playlist => (
              <Card key={playlist.id} className="overflow-hidden flex flex-col h-full">
                <div 
                  className="h-40 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${playlist.coverImage})` }}
                />
                <CardHeader>
                  <CardTitle>{playlist.name}</CardTitle>
                  <CardDescription>{playlist.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-medium mb-2 text-sm">Bienfaits:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
                    {playlist.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => handlePlayMusic(playlist.id)}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Écouter cette playlist
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Science Tab */}
        <TabsContent value="science" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Les bienfaits scientifiques de la musicothérapie</CardTitle>
              <CardDescription>
                Comment la musique agit sur notre cerveau et notre corps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Effets neurophysiologiques</h3>
                <p className="text-muted-foreground">
                  La musique stimule la libération de dopamine et d'endorphines, des 
                  neurotransmetteurs liés au plaisir et à la réduction de la douleur. 
                  Elle active également diverses zones du cerveau impliquées dans la 
                  régulation des émotions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Régulation du stress</h3>
                <p className="text-muted-foreground">
                  Des études montrent que l'écoute de musique apaisante peut réduire 
                  les niveaux de cortisol (hormone du stress) dans le sang et diminuer 
                  la tension artérielle et le rythme cardiaque.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Amélioration de la cognition</h3>
                <p className="text-muted-foreground">
                  Certains types de musique peuvent améliorer la concentration, la mémoire 
                  et les performances cognitives grâce à un phénomène connu sous le nom 
                  d'"effet Mozart", bien que ses bénéfices s'appliquent à diverses formes 
                  de musique.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Recommandations d'utilisation</h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Pour la relaxation: musiques à tempo lent (60-80 BPM)</li>
                  <li>Pour la concentration: musique classique ou instrumentale sans paroles</li>
                  <li>Pour l'énergie: musiques à tempo modéré (90-120 BPM)</li>
                  <li>Pour l'humeur: musiques avec valence positive et familières</li>
                </ul>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="italic text-sm text-muted-foreground">
                  "La musique est l'un des moyens les plus puissants d'influencer directement 
                  notre état émotionnel sans recourir à des substances externes. Elle active 
                  les mêmes circuits de récompense du cerveau que ceux impliqués dans les 
                  expériences naturellement plaisantes comme manger ou socialiser."
                </p>
                <p className="text-sm font-medium mt-2">- Dr. Robert Zatorre, Neuroscientifique</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicWellbeingPage;
