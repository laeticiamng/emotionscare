import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Type, Download, Share2, Heart } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useMusicFavorites } from '@/hooks/useMusicFavorites';
import { cn } from '@/lib/utils';

interface LyricLine {
  time: number;
  text: string;
  translation?: string;
}

interface LyricsDisplayProps {
  className?: string;
}

// Mock lyrics data
const mockLyrics: LyricLine[] = [
  { time: 0, text: "Dans le silence de la nuit", translation: "In the silence of the night" },
  { time: 5, text: "Je cherche ma voie", translation: "I search for my way" },
  { time: 10, text: "Les étoiles me guident", translation: "The stars guide me" },
  { time: 15, text: "Vers un monde meilleur", translation: "Towards a better world" },
  { time: 20, text: "La musique résonne", translation: "The music resonates" },
  { time: 25, text: "Dans mon cœur", translation: "In my heart" },
  { time: 30, text: "Chaque note me porte", translation: "Each note carries me" },
  { time: 35, text: "Vers l'infini", translation: "Towards infinity" },
  { time: 40, text: "Je ferme les yeux", translation: "I close my eyes" },
  { time: 45, text: "Et je me laisse aller", translation: "And I let myself go" },
  { time: 50, text: "Dans cette mélodie", translation: "In this melody" },
  { time: 55, text: "Qui me fait rêver", translation: "That makes me dream" }
];

// Generate lyrics based on track mood/title when no real lyrics available
const generateTherapeuticLyrics = (track: { title: string; mood?: string; artist?: string }): LyricLine[] => {
  const moods: Record<string, LyricLine[]> = {
    calm: [
      { time: 0, text: "Respire doucement...", translation: "Breathe slowly..." },
      { time: 8, text: "Laisse le calme t'envahir", translation: "Let calmness fill you" },
      { time: 16, text: "Chaque souffle apaise ton esprit", translation: "Each breath soothes your mind" },
      { time: 24, text: "Tu es en paix, ici et maintenant", translation: "You are at peace, here and now" },
    ],
    energetic: [
      { time: 0, text: "♪ Énergie pure ♪", translation: "♪ Pure energy ♪" },
      { time: 8, text: "Sens la force monter en toi", translation: "Feel the strength rising in you" },
      { time: 16, text: "Chaque battement te propulse", translation: "Each beat propels you" },
      { time: 24, text: "Tu es invincible", translation: "You are invincible" },
    ],
    focus: [
      { time: 0, text: "Concentration absolue", translation: "Absolute focus" },
      { time: 10, text: "Ton esprit est clair et précis", translation: "Your mind is clear and precise" },
      { time: 20, text: "Chaque pensée trouve sa place", translation: "Every thought finds its place" },
      { time: 30, text: "Tu atteins tes objectifs", translation: "You achieve your goals" },
    ],
    healing: [
      { time: 0, text: "♪ Sons de guérison ♪", translation: "♪ Healing sounds ♪" },
      { time: 10, text: "Laisse les fréquences te réparer", translation: "Let frequencies heal you" },
      { time: 20, text: "Corps et esprit s'harmonisent", translation: "Body and mind harmonize" },
      { time: 30, text: "Tu renais à chaque instant", translation: "You are reborn each moment" },
    ],
  };
  
  const moodKey = track.mood?.toLowerCase().includes('calm') ? 'calm'
    : track.mood?.toLowerCase().includes('energ') ? 'energetic'
    : track.mood?.toLowerCase().includes('focus') || track.mood?.toLowerCase().includes('concent') ? 'focus'
    : 'healing';
    
  return moods[moodKey] || moods.healing;
};

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ className }) => {
  const { state } = useMusic();
  const { isFavorite, toggleFavorite } = useMusicFavorites();
  const { currentTrack, isPlaying, currentTime: playerTime } = state;
  const [showTranslation, setShowTranslation] = useState(false);
  const [fontSize, setFontSize] = useState('md');

  // Use real player time instead of simulated time
  const currentTime = playerTime || 0;
  
  // Check if current track is liked via favorites system
  const isLiked = currentTrack ? isFavorite(currentTrack.id) : false;

  // Generate lyrics based on current track
  const lyrics = currentTrack ? generateTherapeuticLyrics(currentTrack) : mockLyrics;

  const getCurrentLyricIndex = () => {
    return lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });
  };

  const currentLyricIndex = getCurrentLyricIndex();

  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune piste sélectionnée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Paroles
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => currentTrack && toggleFavorite(currentTrack)}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Track Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          <div className="flex gap-2">
            <Badge variant="secondary">Synchronisées</Badge>
            {showTranslation && <Badge variant="outline">Traduction</Badge>}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={fontSize === 'sm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('sm')}
            >
              A
            </Button>
            <Button
              variant={fontSize === 'md' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('md')}
            >
              A
            </Button>
            <Button
              variant={fontSize === 'lg' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('lg')}
            >
              A
            </Button>
          </div>
          
          <Button
            variant={showTranslation ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            Traduction
          </Button>
        </div>
        
        {/* Lyrics */}
        <ScrollArea className="h-80">
          <div className="space-y-4 p-2">
            {lyrics.map((lyric, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-300 p-3 rounded-lg",
                  index === currentLyricIndex
                    ? "bg-primary/10 border border-primary/20 scale-105"
                    : "opacity-60 hover:opacity-80",
                  fontSizeClasses[fontSize as keyof typeof fontSizeClasses]
                )}
              >
                <p className={cn(
                  "font-medium leading-relaxed",
                  index === currentLyricIndex && "text-primary font-semibold"
                )}>
                  {lyric.text}
                </p>
                {showTranslation && lyric.translation && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {lyric.translation}
                  </p>
                )}
              </div>
            ))}
            
            {/* End spacing */}
            <div className="h-20" />
          </div>
        </ScrollArea>
        
        {/* Progress indicator */}
        <div className="text-xs text-muted-foreground text-center">
          Ligne {currentLyricIndex + 1} sur {lyrics.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default LyricsDisplay;
