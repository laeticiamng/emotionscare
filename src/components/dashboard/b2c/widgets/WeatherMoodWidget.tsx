import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSun, Heart } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { getVibeEmoji, getVibeLabel, type MoodVibe } from '@/utils/moodVibes';

export const WeatherMoodWidget: React.FC = () => {
  const { currentMood } = useMood();

  const vibeVisuals: Record<MoodVibe, {
    icon: React.ComponentType<{ className?: string }>;
    weather: string;
    description: string;
    accent: string;
  }> = {
    calm: { icon: CloudSun, weather: 'Ciel pastel', description: 'Respiration fluide et douceur.', accent: 'text-blue-500' },
    bright: { icon: Sun, weather: 'Grand soleil', description: 'Éclat lumineux et énergie positive.', accent: 'text-amber-500' },
    focus: { icon: Cloud, weather: 'Ciel clair', description: 'Clarté d\'esprit et cap maintenu.', accent: 'text-purple-500' },
    reset: { icon: CloudRain, weather: 'Bruine légère', description: 'Temps de pause pour se régénérer.', accent: 'text-indigo-500' },
  };

  const visuals = vibeVisuals[currentMood.vibe] ?? vibeVisuals.calm;
  const WeatherIcon = visuals.icon;
  const vibeLabel = getVibeLabel(currentMood.vibe);
  const vibeEmoji = getVibeEmoji(currentMood.vibe);

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
            <WeatherIcon className={`h-8 w-8 ${visuals.accent}`} />
            <div>
              <p className="font-medium">{visuals.weather}</p>
              <p className="text-sm text-muted-foreground">{visuals.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">Humeur actuelle</p>
            <p className="text-2xl" aria-label={vibeLabel} title={vibeLabel}>
              {vibeEmoji}
            </p>
            <p className="text-sm text-muted-foreground capitalize">{vibeLabel}</p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            🌟 {currentMood.vibe === 'bright'
              ? 'Moment parfait pour partager ton énergie.'
              : currentMood.vibe === 'focus'
                ? 'Garde le cap sur ce qui compte pour toi.'
                : currentMood.vibe === 'reset'
                  ? 'Offre-toi un instant de récupération.'
                  : 'Savoure cette douceur intérieure.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
