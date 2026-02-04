/**
 * VREnvironmentCreator - Créateur d'environnements VR personnalisés
 * Permet aux utilisateurs de personnaliser leur espace de méditation VR
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, Sun, Moon, Cloud, Trees, Mountain, 
  Waves, Sparkles, Save, Eye, RotateCcw, Volume2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnvironmentSettings {
  name: string;
  baseTheme: 'forest' | 'beach' | 'mountain' | 'space' | 'garden';
  timeOfDay: 'dawn' | 'day' | 'sunset' | 'night';
  weather: 'clear' | 'cloudy' | 'rain' | 'fog' | 'snow';
  skyColor: string;
  ambientColor: string;
  groundColor: string;
  fogDensity: number;
  particlesEnabled: boolean;
  particleType: 'none' | 'fireflies' | 'stars' | 'leaves' | 'snow';
  ambientSound: string;
  ambientVolume: number;
}

const THEMES = [
  { id: 'forest', name: 'Forêt', icon: Trees, color: 'bg-green-500' },
  { id: 'beach', name: 'Plage', icon: Waves, color: 'bg-blue-500' },
  { id: 'mountain', name: 'Montagne', icon: Mountain, color: 'bg-gray-500' },
  { id: 'space', name: 'Espace', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'garden', name: 'Jardin', icon: Trees, color: 'bg-pink-500' }
];

const TIME_OPTIONS = [
  { id: 'dawn', name: 'Aube', icon: Sun, gradient: 'from-orange-300 to-pink-400' },
  { id: 'day', name: 'Jour', icon: Sun, gradient: 'from-blue-400 to-cyan-300' },
  { id: 'sunset', name: 'Coucher', icon: Sun, gradient: 'from-orange-500 to-red-500' },
  { id: 'night', name: 'Nuit', icon: Moon, gradient: 'from-indigo-900 to-purple-900' }
];

const WEATHER_OPTIONS = [
  { id: 'clear', name: 'Clair' },
  { id: 'cloudy', name: 'Nuageux' },
  { id: 'rain', name: 'Pluie' },
  { id: 'fog', name: 'Brouillard' },
  { id: 'snow', name: 'Neige' }
];

const PARTICLE_OPTIONS = [
  { id: 'none', name: 'Aucune' },
  { id: 'fireflies', name: 'Lucioles' },
  { id: 'stars', name: 'Étoiles' },
  { id: 'leaves', name: 'Feuilles' },
  { id: 'snow', name: 'Flocons' }
];

const AMBIENT_SOUNDS = [
  { id: 'silence', name: 'Silence' },
  { id: 'birds', name: 'Chants d\'oiseaux' },
  { id: 'waves', name: 'Vagues' },
  { id: 'rain', name: 'Pluie' },
  { id: 'wind', name: 'Vent' },
  { id: 'fire', name: 'Feu de camp' },
  { id: 'stream', name: 'Ruisseau' }
];

const DEFAULT_SETTINGS: EnvironmentSettings = {
  name: 'Mon Environnement',
  baseTheme: 'forest',
  timeOfDay: 'sunset',
  weather: 'clear',
  skyColor: '#87CEEB',
  ambientColor: '#FFF5E6',
  groundColor: '#228B22',
  fogDensity: 20,
  particlesEnabled: true,
  particleType: 'fireflies',
  ambientSound: 'birds',
  ambientVolume: 50
};

const VREnvironmentCreator = memo(() => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<EnvironmentSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof EnvironmentSettings>(
    key: K, 
    value: EnvironmentSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Environnement sauvegardé',
      description: `"${settings.name}" est prêt à être utilisé`
    });
    setIsSaving(false);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast({ title: 'Paramètres réinitialisés' });
  };

  const handlePreview = () => {
    toast({
      title: 'Prévisualisation',
      description: 'Ouverture de l\'aperçu VR...'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Créateur d'Environnement VR
        </CardTitle>
        <CardDescription>
          Personnalisez votre espace de méditation virtuel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="theme">Thème</TabsTrigger>
            <TabsTrigger value="atmosphere">Atmosphère</TabsTrigger>
            <TabsTrigger value="colors">Couleurs</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          {/* Thème de base */}
          <TabsContent value="theme" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom de l'environnement</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
                placeholder="Mon environnement zen"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Environnement de base</label>
              <div className="grid grid-cols-5 gap-2">
                {THEMES.map(theme => {
                  const Icon = theme.icon;
                  const isSelected = settings.baseTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => updateSetting('baseTheme', theme.id as EnvironmentSettings['baseTheme'])}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/10' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-8 w-8 mx-auto rounded-full ${theme.color} flex items-center justify-center mb-1`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs font-medium">{theme.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Moment de la journée</label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_OPTIONS.map(time => {
                  const Icon = time.icon;
                  const isSelected = settings.timeOfDay === time.id;
                  return (
                    <button
                      key={time.id}
                      onClick={() => updateSetting('timeOfDay', time.id as EnvironmentSettings['timeOfDay'])}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-primary' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className={`h-8 w-full rounded bg-gradient-to-r ${time.gradient} flex items-center justify-center mb-1`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-xs font-medium">{time.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Atmosphère */}
          <TabsContent value="atmosphere" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Météo</label>
              <div className="flex flex-wrap gap-2">
                {WEATHER_OPTIONS.map(weather => (
                  <Badge
                    key={weather.id}
                    variant={settings.weather === weather.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateSetting('weather', weather.id as EnvironmentSettings['weather'])}
                  >
                    {weather.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Densité du brouillard: {settings.fogDensity}%
              </label>
              <Slider
                value={[settings.fogDensity]}
                onValueChange={([v]) => updateSetting('fogDensity', v)}
                min={0}
                max={100}
                step={5}
                aria-label="Densité du brouillard"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Particules</label>
              <div className="flex flex-wrap gap-2">
                {PARTICLE_OPTIONS.map(particle => (
                  <Badge
                    key={particle.id}
                    variant={settings.particleType === particle.id ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => updateSetting('particleType', particle.id as EnvironmentSettings['particleType'])}
                  >
                    {particle.name}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Couleurs */}
          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ciel</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.skyColor}
                    onChange={(e) => updateSetting('skyColor', e.target.value)}
                    className="h-10 w-full rounded cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Ambiance</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.ambientColor}
                    onChange={(e) => updateSetting('ambientColor', e.target.value)}
                    className="h-10 w-full rounded cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Sol</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.groundColor}
                    onChange={(e) => updateSetting('groundColor', e.target.value)}
                    className="h-10 w-full rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Prévisualisation couleurs */}
            <div 
              className="h-32 rounded-lg overflow-hidden relative"
              style={{
                background: `linear-gradient(to bottom, ${settings.skyColor} 0%, ${settings.ambientColor} 60%, ${settings.groundColor} 100%)`
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium bg-black/20">
                Prévisualisation des couleurs
              </div>
            </div>
          </TabsContent>

          {/* Audio */}
          <TabsContent value="audio" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Son d'ambiance</label>
              <div className="grid grid-cols-4 gap-2">
                {AMBIENT_SOUNDS.map(sound => (
                  <button
                    key={sound.id}
                    onClick={() => updateSetting('ambientSound', sound.id)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                      settings.ambientSound === sound.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {sound.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Volume: {settings.ambientVolume}%
              </label>
              <Slider
                value={[settings.ambientVolume]}
                onValueChange={([v]) => updateSetting('ambientVolume', v)}
                min={0}
                max={100}
                step={5}
                aria-label="Volume ambiant"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button onClick={handlePreview} variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button onClick={handleReset} variant="ghost">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

VREnvironmentCreator.displayName = 'VREnvironmentCreator';

export default VREnvironmentCreator;
