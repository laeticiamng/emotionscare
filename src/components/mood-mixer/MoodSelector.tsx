// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Palette,
  Music,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { MoodProfile } from '@/types/mood-mixer';

interface MoodSelectorProps {
  moods: MoodProfile[];
  selectedMood: MoodProfile | null;
  onMoodSelect: (mood: MoodProfile) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  moods, 
  selectedMood, 
  onMoodSelect 
}) => {
  const getEnergyLabel = (energy: number) => {
    if (energy <= 3) return 'Paisible';
    if (energy <= 6) return 'Modéré';
    if (energy <= 8) return 'Énergique';
    return 'Intense';
  };

  const getValenceLabel = (valence: number) => {
    if (valence <= 3) return 'Introspectif';
    if (valence <= 6) return 'Neutre';
    if (valence <= 8) return 'Positif';
    return 'Euphorique';
  };

  const getMoodGradient = (mood: MoodProfile) => {
    const baseColor = mood.color;
    return `linear-gradient(135deg, ${baseColor}15, ${baseColor}05)`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Choisissez votre humeur
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez l'état émotionnel que vous ressentez ou souhaitez atteindre
        </p>
      </div>

      {/* Sélecteur d'humeur rapide */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quick Select - Comment vous sentez-vous maintenant ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['😴 Fatigué', '😌 Détendu', '😊 Heureux', '🔥 Motivé', '🧠 Concentré', '💭 Pensif'].map((quickmood) => (
              <Button
                key={quickmood}
                variant="outline"
                size="sm"
                className="hover-scale"
                onClick={() => {
                  // Trouver l'humeur la plus proche
                  const moodMap: Record<string, string> = {
                    '😴 Fatigué': 'calm',
                    '😌 Détendu': 'calm',
                    '😊 Heureux': 'romantic',
                    '🔥 Motivé': 'energetic',
                    '🧠 Concentré': 'focused',
                    '💭 Pensif': 'melancholic'
                  };
                  const moodId = moodMap[quickmood];
                  const mood = moods.find(m => m.id === moodId);
                  if (mood) onMoodSelect(mood);
                }}
              >
                {quickmood}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grille des humeurs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedMood?.id === mood.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              style={{ 
                background: getMoodGradient(mood),
                borderColor: selectedMood?.id === mood.id ? mood.color : undefined
              }}
              onClick={() => onMoodSelect(mood)}
            >
              {/* Indicateur de sélection */}
              {selectedMood?.id === mood.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mood.icon}</span>
                    <span>{mood.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {mood.energyLevel}/10
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {mood.description}
                </p>
                
                {/* Métriques de l'humeur */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                      Énergie
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(mood.energyLevel / 10) * 100}%`,
                            backgroundColor: mood.color
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {getEnergyLabel(mood.energyLevel)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                      Sentiment
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(mood.valence / 10) * 100}%`,
                            backgroundColor: mood.color
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {getValenceLabel(mood.valence)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Genres musicaux */}
                <div className="space-y-2">
                  <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                    Genres Musicaux
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mood.musicalGenres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {mood.musicalGenres.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mood.musicalGenres.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Émotions dominantes */}
                <div className="space-y-2">
                  <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                    Émotions Clés
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mood.dominantEmotions.slice(0, 2).map((emotion) => (
                      <Badge 
                        key={emotion} 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: mood.color }}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tempo indicatif */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Music className="h-3 w-3" />
                    <span>Tempo: {mood.tempo} BPM</span>
                  </div>
                  <div className="text-muted-foreground">
                    Dernière utilisation: {mood.lastUsed ? 'Il y a 2j' : 'Jamais'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action rapide si une humeur est sélectionnée */}
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedMood.icon}</span>
                  <div>
                    <div className="font-medium">{selectedMood.name}</div>
                    <div className="text-xs text-muted-foreground">Humeur sélectionnée</div>
                  </div>
                </div>
                <Button 
                  onClick={() => onMoodSelect(selectedMood)}
                  className="animate-pulse"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Créer un Mix
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MoodSelector;