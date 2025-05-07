
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Plus, Volume2, Lightbulb, Settings, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExpandedTabs, ExpandedTabsList, ExpandedTabsTrigger, ExpandedTabsContent } from '@/components/ui/expanded-tabs';
import { fetchLatestEmotion } from '@/lib/scanService';
import MusicPlayer from '@/components/music/MusicPlayer';
import RecommendedPresets from '@/components/music/RecommendedPresets';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AudioVisualizer from '@/components/music/AudioVisualizer';

const MusicTherapyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listen');
  const [latestEmotion, setLatestEmotion] = useState<any>(null);
  const { toast } = useToast();
  const { currentEmotion, currentTrack, isPlaying, openDrawer, loadPlaylistForEmotion } = useMusic();
  const [ambientLighting, setAmbientLighting] = useState(false);
  const [adaptiveWorkspace, setAdaptiveWorkspace] = useState(false);
  const [visualizerVariant, setVisualizerVariant] = useState<'bars' | 'circle' | 'wave'>('bars');

  useEffect(() => {
    const loadLatestEmotion = async () => {
      try {
        const emotion = await fetchLatestEmotion();
        setLatestEmotion(emotion);
        
        // Auto-load music based on emotion if available
        if (emotion?.emojis && !currentTrack) {
          // This will be handled by the preset component
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la dernière émotion:', error);
      }
    };

    loadLatestEmotion();
    
    // Rotate visualizer variant every 30 seconds for dynamic experience
    const visualizerInterval = setInterval(() => {
      setVisualizerVariant(current => {
        switch(current) {
          case 'bars': return 'wave';
          case 'wave': return 'circle';
          case 'circle': return 'bars';
          default: return 'bars';
        }
      });
    }, 30000);
    
    return () => clearInterval(visualizerInterval);
  }, [currentTrack]);

  const handleCreateMusic = () => {
    navigate('/music/create');
  };

  const handleCollectiveJam = () => {
    setActiveTab('jam');
    toast({
      title: "Fonctionnalité à venir",
      description: "L'univers sonore collaboratif sera bientôt disponible!",
    });
  };
  
  const handleAmbientLightingChange = (checked: boolean) => {
    setAmbientLighting(checked);
    
    toast({
      title: checked ? "Éclairage ambiant activé" : "Éclairage ambiant désactivé",
      description: checked 
        ? "Votre éclairage connecté est maintenant synchronisé avec votre musique" 
        : "Synchronisation de l'éclairage désactivée"
    });
    
    // Simulate integration with connected lighting
    if (checked && currentTrack) {
      toast({
        title: "Configuration de l'éclairage",
        description: `Configuration des lumières adaptée à l'ambiance ${currentEmotion || 'neutre'}`,
      });
    }
  };
  
  const handleAdaptiveWorkspaceChange = (checked: boolean) => {
    setAdaptiveWorkspace(checked);
    
    toast({
      title: checked ? "Workspace adaptatif activé" : "Workspace adaptatif désactivé",
      description: checked 
        ? "Votre environnement s'adaptera à votre état émotionnel" 
        : "Adaptation automatique désactivée"
    });
    
    // Simulate adaptation based on current emotion
    if (checked && currentEmotion) {
      setTimeout(() => {
        toast({
          title: "Environnement adapté",
          description: `Workspace optimisé pour l'état émotionnel: ${currentEmotion}`,
        });
      }, 1500);
    }
  };

  // Define the handler for selecting a music preset
  const handleSelectPreset = (preset: any) => {
    console.log('Selected preset:', preset);
    
    // Apply the selected preset to the music player
    if (preset.mood) {
      loadPlaylistForEmotion(preset.mood);
      
      toast({
        title: `Preset "${preset.name}" activé`,
        description: `Une nouvelle ambiance musicale adaptée à votre humeur a été chargée.`,
      });
      
      // If ambient lighting is on, adjust lighting too
      if (ambientLighting) {
        setTimeout(() => {
          toast({
            title: "Ambiance lumineuse ajustée",
            description: `Éclairage synchronisé avec l'ambiance "${preset.mood}"`,
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Musicothérapie IA</h1>
        <p className="text-muted-foreground mt-1">
          Écoutez et créez des morceaux musicaux adaptés à votre état émotionnel
        </p>
      </div>

      {/* Current track overview */}
      {currentTrack && (
        <Card className="bg-gradient-to-r from-indigo-600/10 to-indigo-400/10 border-none shadow-sm">
          <CardContent className="flex items-center p-6 gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              {isPlaying ? (
                <Music className="h-6 w-6 text-indigo-600" />
              ) : (
                <Music className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium">En cours d'écoute</h3>
              <p className="text-lg font-semibold">{currentTrack.title}</p>
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
          
          {/* Add audio visualizer for playing tracks */}
          {isPlaying && (
            <div className="px-6 pb-6">
              <AudioVisualizer 
                audioUrl={currentTrack.url} 
                isPlaying={isPlaying}
                variant={visualizerVariant}
                height={60}
              />
            </div>
          )}
        </Card>
      )}

      {/* Main Content */}
      <ExpandedTabs>
        <ExpandedTabsList>
          <ExpandedTabsTrigger 
            active={activeTab === 'listen'} 
            onClick={() => setActiveTab('listen')}
          >
            <Volume2 className="h-4 w-4 mr-2 inline" />
            Écouter
          </ExpandedTabsTrigger>
          <ExpandedTabsTrigger 
            active={activeTab === 'create'} 
            onClick={() => handleCreateMusic()}
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Créer ma musique
          </ExpandedTabsTrigger>
          <ExpandedTabsTrigger 
            active={activeTab === 'jam'} 
            onClick={() => handleCollectiveJam()}
          >
            <Music className="h-4 w-4 mr-2 inline" />
            Jam collective
          </ExpandedTabsTrigger>
          <ExpandedTabsTrigger 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Paramètres
          </ExpandedTabsTrigger>
        </ExpandedTabsList>
        
        <ExpandedTabsContent active={activeTab === 'listen'} className="mt-6 space-y-6">
          {/* Current emotional state and music player */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                Votre lecteur musical
              </CardTitle>
              <CardDescription>
                {currentEmotion 
                  ? `Musique adaptée à votre humeur : ${currentEmotion}` 
                  : "Écoutez des morceaux de musique adaptés à votre humeur"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MusicPlayer />
            </CardContent>
          </Card>

          {/* Recommended music presets based on emotions */}
          <RecommendedPresets 
            onSelectPreset={handleSelectPreset} 
            emotion={latestEmotion} 
          />
          
          {/* Ambient Workspace Control */}
          <Card className="border-t-4" style={{ borderTopColor: 'var(--primary)' }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                Ambiance Adaptive Workspace
              </CardTitle>
              <CardDescription>
                Contrôle intelligent de votre environnement de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="mb-4">
                Synchronisez votre éclairage connecté avec votre musique et votre état émotionnel pour une expérience immersive complète.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ambient-lighting">Éclairage ambiant</Label>
                    <p className="text-sm text-muted-foreground">
                      Synchronise votre éclairage connecté avec la musique
                    </p>
                  </div>
                  <Switch
                    id="ambient-lighting"
                    checked={ambientLighting}
                    onCheckedChange={handleAmbientLightingChange}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="adaptive-workspace">Mode adaptatif</Label>
                    <p className="text-sm text-muted-foreground">
                      Adapte l'éclairage à votre état émotionnel
                    </p>
                  </div>
                  <Switch
                    id="adaptive-workspace"
                    checked={adaptiveWorkspace}
                    onCheckedChange={handleAdaptiveWorkspaceChange}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Connecter mon éclairage
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compatible avec Philips Hue, LIFX et Nanoleaf</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'create'} className="mt-6">
          {/* This tab will redirect to the creation page */}
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'jam'} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Univers sonore collaboratif</CardTitle>
              <CardDescription>
                Créez des jams musicales en temps réel avec votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <Music className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">Fonctionnalité en développement</h3>
              <p className="text-muted-foreground max-w-md">
                Nous travaillons actuellement sur cette innovation qui permettra de créer de la musique collaborative avec votre équipe en temps réel.
              </p>
              <Button variant="outline" onClick={() => toast({
                title: "En développement",
                description: "Nous vous informerons dès que cette fonctionnalité sera disponible!"
              })}>
                Me notifier à la sortie
              </Button>
            </CardContent>
          </Card>
        </ExpandedTabsContent>
        
        <ExpandedTabsContent active={activeTab === 'settings'} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de musicothérapie</CardTitle>
              <CardDescription>
                Personnalisez votre expérience musicale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options générales</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-play">Lecture automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Démarrer automatiquement la lecture lors du changement de musique
                    </p>
                  </div>
                  <Switch id="auto-play" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-quality">Haute qualité audio</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser un encodage audio de meilleure qualité (utilise plus de données)
                    </p>
                  </div>
                  <Switch id="high-quality" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emotion-sync">Synchronisation émotionnelle</Label>
                    <p className="text-sm text-muted-foreground">
                      Adapter automatiquement la musique à votre état émotionnel
                    </p>
                  </div>
                  <Switch id="emotion-sync" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options avancées</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="binaural">Effets binauraux</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajouter des effets sonores binauraux pour une relaxation profonde
                    </p>
                  </div>
                  <Switch id="binaural" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications bien-être</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des rappels pour des pauses musicales régénérantes
                    </p>
                  </div>
                  <Switch id="notifications" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Enregistrer les préférences</Button>
            </CardFooter>
          </Card>
        </ExpandedTabsContent>
      </ExpandedTabs>
    </div>
  );
};

export default MusicTherapyPage;
