import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Heart, Zap, Smile, Frown, Meh, Sun, Moon, 
  Play, Sparkles, TrendingUp, Clock, Users 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MoodState {
  energy: number;
  valence: number; // positif/négatif
  arousal: number; // calme/excité
  dominantEmotion: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  context: string;
}

interface MusicRecommendation {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tempo: number;
  mood: string;
  matchScore: number;
  reason: string;
  duration: string;
  popularity: number;
}

interface MoodBasedRecommendationsProps {
  currentMood: MoodState;
  onMoodUpdate: (mood: Partial<MoodState>) => void;
  onPlayRecommendation: (track: MusicRecommendation) => void;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({
  currentMood,
  onMoodUpdate,
  onPlayRecommendation
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>([]);

  const emotions = [
    { id: 'happy', label: 'Joyeux', icon: <Smile className="h-4 w-4" />, color: 'bg-yellow-500' },
    { id: 'calm', label: 'Calme', icon: <Meh className="h-4 w-4" />, color: 'bg-blue-500' },
    { id: 'energetic', label: 'Énergique', icon: <Zap className="h-4 w-4" />, color: 'bg-orange-500' },
    { id: 'sad', label: 'Mélancolique', icon: <Frown className="h-4 w-4" />, color: 'bg-gray-500' },
    { id: 'focused', label: 'Concentré', icon: <Brain className="h-4 w-4" />, color: 'bg-purple-500' },
    { id: 'romantic', label: 'Romantique', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-500' }
  ];

  const contexts = [
    { id: 'work', label: 'Travail', icon: '💼' },
    { id: 'workout', label: 'Sport', icon: '🏃' },
    { id: 'relax', label: 'Détente', icon: '🧘' },
    { id: 'party', label: 'Fête', icon: '🎉' },
    { id: 'study', label: 'Étude', icon: '📚' },
    { id: 'commute', label: 'Transport', icon: '🚗' }
  ];

  const generateRecommendations = async () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecommendations: MusicRecommendation[] = [
      {
        id: '1',
        title: 'Weighted Sky',
        artist: 'Kiasmos',
        genre: 'Électronique Ambiante',
        tempo: 95,
        mood: 'Calme Énergisant',
        matchScore: 94,
        reason: 'Correspond parfaitement à votre niveau d\'énergie actuel',
        duration: '4:32',
        popularity: 87
      },
      {
        id: '2',
        title: 'On Earth As It Is In Heaven',
        artist: 'Ólafur Arnalds',
        genre: 'Néoclassique',
        tempo: 72,
        mood: 'Contemplatif',
        matchScore: 91,
        reason: 'Idéal pour votre humeur méditative du moment',
        duration: '6:18',
        popularity: 92
      },
      {
        id: '3',
        title: 'Porcelain',
        artist: 'Moby',
        genre: 'Électronique Douce',
        tempo: 85,
        mood: 'Nostalgique Positif',
        matchScore: 89,
        reason: 'Stimule la créativité tout en restant apaisant',
        duration: '4:01',
        popularity: 95
      },
      {
        id: '4',
        title: 'Experience',
        artist: 'Ludovico Einaudi',
        genre: 'Piano Moderne',
        tempo: 68,
        mood: 'Inspirant',
        matchScore: 86,
        reason: 'Parfait pour votre contexte de travail créatif',
        duration: '5:15',
        popularity: 89
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
  };

  const getTimeIcon = () => {
    switch (currentMood.timeOfDay) {
      case 'morning': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'afternoon': return <Sun className="h-4 w-4 text-orange-500" />;
      case 'evening': return <Sun className="h-4 w-4 text-red-500" />;
      case 'night': return <Moon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getMoodColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Analyse de l'humeur actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Votre État Émotionnel Actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Métriques émotionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Énergie
                </span>
                <span className="text-sm">{currentMood.energy}%</span>
              </div>
              <Progress value={currentMood.energy} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Positivité
                </span>
                <span className="text-sm">{currentMood.valence}%</span>
              </div>
              <Progress value={currentMood.valence} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Smile className="h-4 w-4 text-blue-500" />
                  Excitation
                </span>
                <span className="text-sm">{currentMood.arousal}%</span>
              </div>
              <Progress value={currentMood.arousal} className="h-2" />
            </div>
          </div>

          {/* Contexte actuel */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {getTimeIcon()}
              <div>
                <p className="font-medium">{currentMood.dominantEmotion}</p>
                <p className="text-sm text-muted-foreground">
                  {currentMood.timeOfDay === 'morning' ? 'Matinée' :
                   currentMood.timeOfDay === 'afternoon' ? 'Après-midi' :
                   currentMood.timeOfDay === 'evening' ? 'Soirée' : 'Nuit'}
                  • {currentMood.context}
                </p>
              </div>
            </div>
            <Button
              onClick={generateRecommendations}
              disabled={isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Analyse...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Recommandations IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sélecteur d'humeur rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajuster votre humeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {emotions.map((emotion) => (
              <Button
                key={emotion.id}
                variant={currentMood.dominantEmotion === emotion.label ? "default" : "outline"}
                onClick={() => onMoodUpdate({ dominantEmotion: emotion.label })}
                className="flex items-center gap-2 justify-start"
              >
                {emotion.icon}
                {emotion.label}
              </Button>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Contexte d'écoute :</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {contexts.map((context) => (
                <Button
                  key={context.id}
                  variant={currentMood.context === context.label ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onMoodUpdate({ context: context.label })}
                  className="flex items-center gap-2 justify-start"
                >
                  <span>{context.icon}</span>
                  {context.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommandations personnalisées */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommandations Personnalisées
            </CardTitle>
            <p className="text-muted-foreground">
              Basées sur votre analyse émotionnelle en temps réel
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{track.title}</h4>
                      <Badge className={getMoodColor(track.matchScore)}>
                        {track.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{track.artist} • {track.genre}</p>
                    <p className="text-xs text-blue-600 mt-1">{track.reason}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {track.duration}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {track.popularity}%
                      </div>
                    </div>
                    <Button
                      onClick={() => onPlayRecommendation(track)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Jouer
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights et tendances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Vos Tendances Musicales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Genres préférés par humeur</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Électronique ambiante</span>
                  <span className="text-sm text-muted-foreground">32%</span>
                </div>
                <Progress value={32} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Néoclassique</span>
                  <span className="text-sm text-muted-foreground">28%</span>
                </div>
                <Progress value={28} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Jazz moderne</span>
                  <span className="text-sm text-muted-foreground">21%</span>
                </div>
                <Progress value={21} className="h-2" />
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Moments d'écoute favoris</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Soirée (18h-22h)</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Après-midi (14h-18h)</span>
                  <span className="text-sm text-muted-foreground">31%</span>
                </div>
                <Progress value={31} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Matinée (8h-12h)</span>
                  <span className="text-sm text-muted-foreground">24%</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodBasedRecommendations;