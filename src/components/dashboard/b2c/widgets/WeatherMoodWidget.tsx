
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, Heart } from 'lucide-react';

export const WeatherMoodWidget: React.FC = () => {
  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain
  };

  const currentWeather = 'sunny';
  const WeatherIcon = weatherIcons[currentWeather];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Humeur & Météo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="font-medium">Ensoleillé</p>
              <p className="text-sm text-muted-foreground">22°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">Humeur actuelle</p>
            <p className="text-2xl">😊</p>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            🌟 Parfait temps pour une marche méditative !
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
