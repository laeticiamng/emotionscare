import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Activity, 
  TrendingUp, 
  Calendar, 
  Clock,
  Smile,
  Frown,
  Meh,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Target,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react';

interface EmotionEntry {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: Date;
  context?: string;
  triggers?: string[];
  color: string;
}

interface EmotionPattern {
  emotion: string;
  frequency: number;
  avgIntensity: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

const EmotionTracking: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState(5);
  const [recentEntries, setRecentEntries] = useState<EmotionEntry[]>([
    {
      id: '1',
      emotion: 'Joie',
      intensity: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      context: 'Réunion réussie',
      triggers: ['accomplissement', 'reconnaissance'],
      color: 'text-yellow-500'
    },
    {
      id: '2',
      emotion: 'Calme',
      intensity: 6,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      context: 'Méditation matinale',
      triggers: ['routine', 'respiration'],
      color: 'text-green-500'
    },
    {
      id: '3',
      emotion: 'Anxiété',
      intensity: 4,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      context: 'Présentation importante',
      triggers: ['performance', 'jugement'],
      color: 'text-orange-500'
    }
  ]);

  const emotions = [
    { name: 'Joie', icon: Smile, color: 'text-yellow-500 bg-yellow-100', description: 'Bonheur, satisfaction' },
    { name: 'Calme', icon: Sun, color: 'text-green-500 bg-green-100', description: 'Sérénité, paix' },
    { name: 'Énergie', icon: Zap, color: 'text-blue-500 bg-blue-100', description: 'Dynamisme, motivation' },
    { name: 'Anxiété', icon: Cloud, color: 'text-orange-500 bg-orange-100', description: 'Inquiétude, stress' },
    { name: 'Tristesse', icon: CloudRain, color: 'text-blue-600 bg-blue-50', description: 'Mélancolie, peine' },
    { name: 'Colère', icon: Frown, color: 'text-red-500 bg-red-100', description: 'Frustration, irritation' },
    { name: 'Neutre', icon: Meh, color: 'text-gray-500 bg-gray-100', description: 'Équilibre, stabilité' },
    { name: 'Excitation', icon: Activity, color: 'text-purple-500 bg-purple-100', description: 'Enthousiasme, anticipation' }
  ];

  const patterns: EmotionPattern[] = [
    {
      emotion: 'Joie',
      frequency: 65,
      avgIntensity: 7.2,
      trend: 'up',
      icon: Smile,
      color: 'text-yellow-500'
    },
    {
      emotion: 'Calme',
      frequency: 45,
      avgIntensity: 6.8,
      trend: 'stable',
      icon: Sun,
      color: 'text-green-500'
    },
    {
      emotion: 'Anxiété',
      frequency: 25,
      avgIntensity: 4.3,
      trend: 'down',
      icon: Cloud,
      color: 'text-orange-500'
    }
  ];

  const handleEmotionSubmit = () => {
    if (!selectedEmotion) return;

    const emotion = emotions.find(e => e.name === selectedEmotion);
    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      intensity: selectedIntensity,
      timestamp: new Date(),
      color: emotion?.color.split(' ')[0] || 'text-gray-500'
    };

    setRecentEntries(prev => [newEntry, ...prev.slice(0, 9)]);
    setSelectedEmotion(null);
    setSelectedIntensity(5);
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'text-red-500 bg-red-100';
    if (intensity <= 6) return 'text-yellow-500 bg-yellow-100';
    return 'text-green-500 bg-green-100';
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <div className="space-y-6">
      {/* Sélection d'émotion */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Enregistrer mon état émotionnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grille d'émotions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {emotions.map((emotion) => (
              <Button
                key={emotion.name}
                variant={selectedEmotion === emotion.name ? 'default' : 'outline'}
                onClick={() => setSelectedEmotion(emotion.name)}
                className="flex flex-col items-center gap-2 h-auto p-4"
              >
                <emotion.icon className={`h-6 w-6 ${selectedEmotion === emotion.name ? 'text-primary-foreground' : emotion.color.split(' ')[0]}`} />
                <div className="text-center">
                  <div className="font-medium text-sm">{emotion.name}</div>
                  <div className="text-xs opacity-75">{emotion.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Intensité */}
          {selectedEmotion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">
                    Intensité de {selectedEmotion.toLowerCase()}
                  </h4>
                  <Badge className={getIntensityColor(selectedIntensity)}>
                    {selectedIntensity}/10
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Faible</span>
                    <span>Modérée</span>
                    <span>Intense</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <Button
                        key={i}
                        variant={i + 1 <= selectedIntensity ? 'default' : 'outline'}
                        size="sm"
                        className="w-full h-8 text-xs"
                        onClick={() => setSelectedIntensity(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleEmotionSubmit}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Enregistrer cette émotion
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Patterns émotionnels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patterns.map((pattern, index) => (
          <motion.div
            key={pattern.emotion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <pattern.icon className={`h-5 w-5 ${pattern.color}`} />
                    <CardTitle className="text-base">{pattern.emotion}</CardTitle>
                  </div>
                  <Badge variant={pattern.trend === 'up' ? 'default' : pattern.trend === 'down' ? 'destructive' : 'secondary'}>
                    {pattern.trend === 'up' ? '↗' : pattern.trend === 'down' ? '↘' : '→'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fréquence</span>
                    <span className="font-medium">{pattern.frequency}%</span>
                  </div>
                  <Progress value={pattern.frequency} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Intensité moyenne</span>
                    <span className="font-medium">{pattern.avgIntensity}/10</span>
                  </div>
                  <Progress value={pattern.avgIntensity * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Historique récent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Historique Récent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${entry.color.replace('text-', 'bg-').replace('500', '100')}`}>
                    {React.createElement(
                      emotions.find(e => e.name === entry.emotion)?.icon || Heart,
                      { className: `h-4 w-4 ${entry.color}` }
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{entry.emotion}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.context || 'Aucun contexte'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={getIntensityColor(entry.intensity)}>
                    {entry.intensity}/10
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getTimeAgo(entry.timestamp)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {recentEntries.length === 0 && (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Aucune émotion enregistrée récemment
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-16 flex flex-col gap-1">
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">Analyse Détaillée</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-1">
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Voir Calendrier</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-1">
          <Target className="h-5 w-5" />
          <span className="text-xs">Définir Objectifs</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-1">
          <Eye className="h-5 w-5" />
          <span className="text-xs">Insights IA</span>
        </Button>
      </div>
    </div>
  );
};

export default EmotionTracking;