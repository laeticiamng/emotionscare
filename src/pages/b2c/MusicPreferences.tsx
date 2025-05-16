
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Volume2, 
  Music, 
  Clock, 
  Mic, 
  RefreshCw, 
  Share2,
  CheckCircle,
  Headphones,
  FileAudio,
  MessageSquare,
  Lightbulb,
  Sliders
} from 'lucide-react';

const B2CMusicPreferences: React.FC = () => {
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    defaultVolume: 70,
    autoPlayMusic: true,
    enableFadeEffects: true,
    backgroundMusic: false,
    notificationSounds: true,
    emotionSync: true,
    highQualityAudio: true,
    musicInJournal: true,
    musicWhileReading: false,
    defaultDuration: 180, // seconds
    defaultEmotionTarget: 'calm',
  });
  
  const handleVolumeChange = (values: number[]) => {
    setPreferences(prev => ({ ...prev, defaultVolume: values[0] }));
  };
  
  const handleDurationChange = (values: number[]) => {
    setPreferences(prev => ({ ...prev, defaultDuration: values[0] }));
  };
  
  const handleSwitchChange = (key: string) => (checked: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: checked }));
  };
  
  const handleEmotionTargetChange = (value: string) => {
    setPreferences(prev => ({ ...prev, defaultEmotionTarget: value }));
  };
  
  const handleSavePreferences = () => {
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences musicales ont été mises à jour avec succès."
      });
    }, 500);
  };
  
  const handleResetPreferences = () => {
    setPreferences({
      defaultVolume: 70,
      autoPlayMusic: true,
      enableFadeEffects: true,
      backgroundMusic: false,
      notificationSounds: true,
      emotionSync: true,
      highQualityAudio: true,
      musicInJournal: true,
      musicWhileReading: false,
      defaultDuration: 180,
      defaultEmotionTarget: 'calm',
    });
    
    toast({
      title: "Préférences réinitialisées",
      description: "Vos préférences musicales ont été réinitialisées aux valeurs par défaut."
    });
  };
  
  // Format duration in mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Préférences musicales</h1>
        <p className="text-muted-foreground">
          Personnalisez votre expérience musicale
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="integration">Intégration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les options générales de votre expérience musicale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Volume par défaut
                  </Label>
                  <span className="text-sm text-muted-foreground">{preferences.defaultVolume}%</span>
                </div>
                <Slider
                  value={[preferences.defaultVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée par défaut
                  </Label>
                  <span className="text-sm text-muted-foreground">{formatDuration(preferences.defaultDuration)}</span>
                </div>
                <Slider
                  value={[preferences.defaultDuration]}
                  min={60}
                  max={600}
                  step={30}
                  onValueChange={handleDurationChange}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Émotion par défaut</Label>
                <Select value={preferences.defaultEmotionTarget} onValueChange={handleEmotionTargetChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une émotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="joy">Joie</SelectItem>
                    <SelectItem value="energy">Énergie</SelectItem>
                    <SelectItem value="focus">Concentration</SelectItem>
                    <SelectItem value="melancholy">Mélancolie</SelectItem>
                    <SelectItem value="motivation">Motivation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Lecture automatique
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Lancer automatiquement la musique lors de l'ouverture
                  </p>
                </div>
                <Switch
                  checked={preferences.autoPlayMusic}
                  onCheckedChange={handleSwitchChange('autoPlayMusic')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Effets de fondu
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le fondu d'entrée et de sortie pour une transition douce
                  </p>
                </div>
                <Switch
                  checked={preferences.enableFadeEffects}
                  onCheckedChange={handleSwitchChange('enableFadeEffects')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres audio</CardTitle>
              <CardDescription>
                Configurez la qualité et les options audio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <FileAudio className="h-4 w-4" />
                    Haute qualité audio
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Utiliser le streaming en haute qualité (utilise plus de données)
                  </p>
                </div>
                <Switch
                  checked={preferences.highQualityAudio}
                  onCheckedChange={handleSwitchChange('highQualityAudio')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Synchronisation émotionnelle
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adapter la musique à vos émotions détectées automatiquement
                  </p>
                </div>
                <Switch
                  checked={preferences.emotionSync}
                  onCheckedChange={handleSwitchChange('emotionSync')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Sons de notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les sons pour les notifications et événements
                  </p>
                </div>
                <Switch
                  checked={preferences.notificationSounds}
                  onCheckedChange={handleSwitchChange('notificationSounds')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Intégration avec d'autres fonctionnalités</CardTitle>
              <CardDescription>
                Configurer comment la musique s'intègre à votre expérience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    Musique de fond permanente
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activer la musique en arrière-plan sur toutes les pages
                  </p>
                </div>
                <Switch
                  checked={preferences.backgroundMusic}
                  onCheckedChange={handleSwitchChange('backgroundMusic')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Journal avec musique
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Activer automatiquement la musique adaptée lors de l'écriture du journal
                  </p>
                </div>
                <Switch
                  checked={preferences.musicInJournal}
                  onCheckedChange={handleSwitchChange('musicInJournal')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Partage sur les réseaux
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser le partage de vos créations musicales (anonyme)
                  </p>
                </div>
                <Switch
                  checked={preferences.musicWhileReading}
                  onCheckedChange={handleSwitchChange('musicWhileReading')}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleResetPreferences}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button onClick={handleSavePreferences}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Enregistrer les préférences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CMusicPreferences;
