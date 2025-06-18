import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Heart, 
  Brain, 
  Mic, 
  PenTool, 
  Music, 
  Users, 
  Settings,
  X,
  ChevronUp,
  Sparkles,
  Wind,
  Coffee,
  Target
} from 'lucide-react';

interface EmotionalState {
  mood: 'excellent' | 'good' | 'neutral' | 'stressed' | 'low';
  energy: number;
  focus: number;
  wellbeing: number;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  path: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'scan',
    label: 'Scan',
    icon: Heart,
    color: 'bg-pink-500',
    path: '/scan',
    description: 'Scanner votre état émotionnel'
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: PenTool,
    color: 'bg-blue-500',
    path: '/journal',
    description: 'Écrire dans votre journal'
  },
  {
    id: 'coach',
    label: 'Coach',
    icon: Brain,
    color: 'bg-purple-500',
    path: '/coach',
    description: 'Parler avec votre coach IA'
  },
  {
    id: 'music',
    label: 'Musique',
    icon: Music,
    color: 'bg-green-500',
    path: '/music-therapy',
    description: 'Musicothérapie adaptée'
  },
  {
    id: 'community',
    label: 'Social',
    icon: Users,
    color: 'bg-orange-500',
    path: '/community',
    description: 'Rejoindre la communauté'
  },
  {
    id: 'voice',
    label: 'Voix',
    icon: Mic,
    color: 'bg-red-500',
    path: '/scan?mode=voice',
    description: 'Analyse vocale émotionnelle'
  }
];

const moodConfig = {
  excellent: { color: 'bg-green-500', text: 'Excellent', emoji: '😊' },
  good: { color: 'bg-blue-500', text: 'Bien', emoji: '🙂' },
  neutral: { color: 'bg-yellow-500', text: 'Neutre', emoji: '😐' },
  stressed: { color: 'bg-orange-500', text: 'Stressé', emoji: '😰' },
  low: { color: 'bg-red-500', text: 'Faible', emoji: '😔' }
};

const suggestions = {
  excellent: [
    { text: 'Partagez votre bonne humeur !', action: '/community' },
    { text: 'Aidez quelqu\'un aujourd\'hui', action: '/community' }
  ],
  good: [
    { text: 'Continuez sur cette lancée !', action: '/journal' },
    { text: 'Une petite méditation ?', action: '/music-therapy' }
  ],
  neutral: [
    { text: 'Que diriez-vous de parler ?', action: '/coach' },
    { text: 'Un scan rapide ?', action: '/scan' }
  ],
  stressed: [
    { text: 'Prenez une pause respiration', action: '/music-therapy' },
    { text: 'Parlez à votre coach', action: '/coach' }
  ],
  low: [
    { text: 'Vous n\'êtes pas seul(e)', action: '/coach' },
    { text: 'Écrivez vos pensées', action: '/journal' }
  ]
};

export const InstantGlowWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    mood: 'good',
    energy: 75,
    focus: 68,
    wellbeing: 82
  });

  // Simule la mise à jour de l'état émotionnel
  useEffect(() => {
    const updateEmotionalState = () => {
      const moods: EmotionalState['mood'][] = ['excellent', 'good', 'neutral', 'stressed', 'low'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      
      setEmotionalState({
        mood: randomMood,
        energy: Math.floor(Math.random() * 100),
        focus: Math.floor(Math.random() * 100),
        wellbeing: Math.floor(Math.random() * 100)
      });
    };

    const interval = setInterval(updateEmotionalState, 300000); // Mise à jour toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  const currentMood = moodConfig[emotionalState.mood];
  const currentSuggestions = suggestions[emotionalState.mood];

  const handleQuickAction = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-4"
          >
            <Card className="w-80 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="font-semibold text-sm">Instant Glow</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsExpanded(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* État émotionnel */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">État actuel</span>
                    <Badge className={`${currentMood.color} text-white`}>
                      {currentMood.emoji} {currentMood.text}
                    </Badge>
                  </div>

                  {/* Métriques rapides */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                      </div>
                      <Progress value={emotionalState.energy} className="h-1 mb-1" />
                      <span className="text-muted-foreground">Énergie {emotionalState.energy}%</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="h-3 w-3 text-blue-500" />
                      </div>
                      <Progress value={emotionalState.focus} className="h-1 mb-1" />
                      <span className="text-muted-foreground">Focus {emotionalState.focus}%</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Wind className="h-3 w-3 text-green-500" />
                      </div>
                      <Progress value={emotionalState.wellbeing} className="h-1 mb-1" />
                      <span className="text-muted-foreground">Bien-être {emotionalState.wellbeing}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions suggérées */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Actions suggérées</h4>
                  <div className="space-y-1">
                    {currentSuggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => handleQuickAction(suggestion.action)}
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        {suggestion.text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Accès rapide */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Accès rapide</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="flex flex-col gap-1 h-16 p-2 text-xs"
                        onClick={() => handleQuickAction(action.path)}
                        title={action.description}
                      >
                        <div className={`w-6 h-6 rounded-full ${action.color} flex items-center justify-center`}>
                          <action.icon className="h-3 w-3 text-white" />
                        </div>
                        <span className="truncate">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant principal */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className={`w-14 h-14 rounded-full shadow-2xl ${currentMood.color} text-white relative overflow-hidden`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Animation de fond */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          
          {/* Contenu */}
          <div className="relative z-10">
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <div className="flex flex-col items-center">
                <Sparkles className="h-5 w-5" />
                <span className="text-xs font-bold">{currentMood.emoji}</span>
              </div>
            )}
          </div>

          {/* Indicateur de notification */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
};

export default InstantGlowWidget;