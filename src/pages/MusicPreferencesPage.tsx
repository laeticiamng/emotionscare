
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { EmotionCategory } from '@/hooks/useMusicRecommendationEngine';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Music, PlayCircle, Heart, Smile, Frown, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageTitle from '@/components/ui/page-title';

const MusicPreferencesPage = () => {
  const { toast } = useToast();
  const [autoplay, setAutoplay] = useState(true);
  const [targetMood, setTargetMood] = useState<string>(EmotionCategory.CALM);
  const [intensity, setIntensity] = useState(5);
  
  const handleSavePreferences = () => {
    // Ici, on pourrait enregistrer les préférences dans le localStorage ou sur un serveur
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences musicales ont été enregistrées avec succès."
    });
  };
  
  const resetToDefaults = () => {
    setAutoplay(true);
    setTargetMood(EmotionCategory.CALM);
    setIntensity(5);
    
    toast({
      title: "Préférences réinitialisées",
      description: "Vos préférences musicales ont été remises à zéro."
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <PageTitle 
        title="Préférences musicales"
        description="Personnalisez votre expérience musicale thérapeutique"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>
              Configurez le comportement du système musical
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoplay">Lecture automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Activer la lecture automatique après un scan
                </p>
              </div>
              <Switch 
                id="autoplay" 
                checked={autoplay} 
                onCheckedChange={setAutoplay}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Objectif thérapeutique</Label>
              <Select
                value={targetMood}
                onValueChange={setTargetMood}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmotionCategory.POSITIVE}>
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-amber-500" />
                      <span>Améliorer l'humeur</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={EmotionCategory.CALM}>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-500" />
                      <span>Favoriser la détente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={EmotionCategory.FOCUS}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Augmenter la concentration</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={EmotionCategory.NEGATIVE}>
                    <div className="flex items-center gap-2">
                      <Frown className="h-4 w-4 text-purple-500" />
                      <span>Réduire les émotions négatives</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Le système musical adaptera ses recommandations pour atteindre cet objectif
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Préférences musicales
            </CardTitle>
            <CardDescription>
              Ajustez vos préférences musicales personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="intensity">Intensité musicale</Label>
                <span className="text-sm font-medium">{intensity}/10</span>
              </div>
              <Slider
                id="intensity"
                min={1}
                max={10}
                step={1}
                value={[intensity]}
                onValueChange={(values) => setIntensity(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                Ajustez l'intensité de la musique recommandée
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Styles musicaux préférés</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Music className="h-4 w-4 mr-2" />
                  Classique
                </Button>
                <Button variant="outline" className="justify-start">
                  <Music className="h-4 w-4 mr-2" />
                  Ambient
                </Button>
                <Button variant="outline" className="justify-start">
                  <Music className="h-4 w-4 mr-2" />
                  Jazz
                </Button>
                <Button variant="outline" className="justify-start">
                  <Music className="h-4 w-4 mr-2" />
                  Nature
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
        <Button 
          variant="outline" 
          onClick={resetToDefaults}
        >
          Réinitialiser
        </Button>
        <Button 
          onClick={handleSavePreferences}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Enregistrer les préférences
        </Button>
      </div>
    </div>
  );
};

export default MusicPreferencesPage;
