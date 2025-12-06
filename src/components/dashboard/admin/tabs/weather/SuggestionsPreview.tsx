// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CloudSun, Cloud, CloudRain, Sun, Droplets, ThermometerSun, ThermometerSnowflake } from 'lucide-react';

// Types pour la simulation météo
interface WeatherSimulation {
  condition: string;
  temperature: number;
  humidity: number;
  wind: number;
  rainProbability: number;
}

// Types pour les activités suggérées
interface SuggestedActivity {
  id: string;
  name: string;
  type: string;
  description: string;
  score: number; // Score de correspondance avec les conditions météo simulées
}

// Composant qui simule l'apparence de la carte pour les utilisateurs
const UserSuggestionPreview: React.FC<{ activity: SuggestedActivity; weather: WeatherSimulation }> = ({ activity, weather }) => {
  const getWeatherIcon = () => {
    if (weather.condition === 'sunny') return <Sun className="w-8 h-8 text-yellow-500" />;
    if (weather.condition === 'cloudy') return <CloudSun className="w-8 h-8 text-gray-500" />;
    if (weather.condition === 'rainy') return <CloudRain className="w-8 h-8 text-blue-500" />;
    return <CloudSun className="w-8 h-8" />;
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {getWeatherIcon()}
          <span className="ml-2">Suggestion du jour</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Basé sur la météo actuelle à Paris
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {activity.description}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <span className="flex items-center">
              <ThermometerSun className="w-4 h-4 mr-1" /> {weather.temperature}°C
            </span>
            <span className="flex items-center">
              <Droplets className="w-4 h-4 mr-1" /> {weather.rainProbability}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Liste des conditions météo disponibles
const weatherConditions = [
  { value: 'sunny', label: 'Ensoleillé' },
  { value: 'cloudy', label: 'Nuageux' },
  { value: 'rainy', label: 'Pluvieux' },
  { value: 'cold', label: 'Froid' },
];

// Activités disponibles pour démo
const availableActivities = [
  { 
    id: '1', 
    name: 'Yoga en plein air', 
    type: 'Extérieur',
    description: 'Session de yoga à l\'extérieur pour profiter du beau temps et se reconnecter avec la nature.',
    score: 95
  },
  { 
    id: '3', 
    name: 'Séance de lecture', 
    type: 'Intérieur',
    description: 'Moment de détente avec un livre pour stimuler l\'esprit et réduire le stress.',
    score: 85 
  },
  { 
    id: '2', 
    name: 'Méditation guidée', 
    type: 'Intérieur',
    description: 'Session de méditation guidée pour favoriser le calme et la concentration.',
    score: 75
  },
];

const SuggestionsPreview: React.FC = () => {
  const [weatherSim, setWeatherSim] = useState<WeatherSimulation>({
    condition: 'sunny',
    temperature: 22,
    humidity: 40,
    wind: 5,
    rainProbability: 10
  });

  // La logique pour déterminer l'activité à suggérer serait normalement plus complexe
  // Ici on simule simplement que l'activité suggérée change en fonction des conditions météo
  const getSuggestedActivity = (): SuggestedActivity => {
    if (weatherSim.condition === 'sunny' && weatherSim.temperature > 20) {
      return availableActivities[0]; // Yoga en plein air
    } else if (weatherSim.condition === 'rainy' || weatherSim.rainProbability > 50) {
      return availableActivities[1]; // Séance de lecture
    } else {
      return availableActivities[2]; // Méditation guidée
    }
  };

  const getWeatherIcon = () => {
    switch (weatherSim.condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      default:
        return <CloudSun className="w-8 h-8 text-gray-400" />;
    }
  };

  // Formatage de la température
  const formatTemperature = (temp: number) => {
    if (temp < 10) return { value: temp, label: 'Froid', icon: <ThermometerSnowflake className="text-blue-500" /> };
    if (temp < 20) return { value: temp, label: 'Frais', icon: <ThermometerSun className="text-yellow-300" /> };
    if (temp < 25) return { value: temp, label: 'Agréable', icon: <ThermometerSun className="text-yellow-500" /> };
    return { value: temp, label: 'Chaud', icon: <ThermometerSun className="text-orange-500" /> };
  };

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>Simulateur de suggestions</CardTitle>
          <CardDescription>
            Simulez différentes conditions météorologiques pour voir quelles activités seraient suggérées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Conditions météorologiques</h3>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Type de conditions</Label>
                  <Select 
                    value={weatherSim.condition} 
                    onValueChange={(value) => setWeatherSim({ ...weatherSim, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {weatherConditions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Température</Label>
                    <span className="flex items-center">
                      {formatTemperature(weatherSim.temperature).icon}
                      <span className="ml-1">{weatherSim.temperature}°C - {formatTemperature(weatherSim.temperature).label}</span>
                    </span>
                  </div>
                  <Slider 
                    min={0} 
                    max={35} 
                    step={1}
                    value={[weatherSim.temperature]} 
                    onValueChange={([value]) => setWeatherSim({ ...weatherSim, temperature: value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Probabilité de pluie</Label>
                    <span className="flex items-center">
                      <Droplets className={`w-4 h-4 ${weatherSim.rainProbability > 50 ? 'text-blue-500' : 'text-blue-300'}`} />
                      <span className="ml-1">{weatherSim.rainProbability}%</span>
                    </span>
                  </div>
                  <Slider 
                    min={0} 
                    max={100} 
                    step={5}
                    value={[weatherSim.rainProbability]} 
                    onValueChange={([value]) => setWeatherSim({ ...weatherSim, rainProbability: value })}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label htmlFor="user-location">Utiliser la localisation de l'utilisateur</Label>
                  <Switch id="user-location" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Si activé, les suggestions seront basées sur la météo à la localisation réelle de l'utilisateur plutôt que celle par défaut.
                </p>
              </div>
            </div>
            
            <div className="bg-secondary/20 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Aperçu de la suggestion</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Voici comment l'utilisateur verra la suggestion sur son tableau de bord :
              </p>
              
              <UserSuggestionPreview 
                activity={getSuggestedActivity()} 
                weather={weatherSim} 
              />
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Cette activité a été sélectionnée en fonction des règles configurées et des conditions météorologiques simulées.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsPreview;
