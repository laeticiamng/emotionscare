import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Smile, Frown, Meh, Angry, Surprised, Disgusted,
  TrendingUp, Calendar, Clock, Zap, Star, Award, Target, Activity,
  BarChart3, Sparkles, Timer, Trophy, Eye, Camera, Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PremiumBackground from '@/components/premium/PremiumBackground';
import ImmersiveExperience from '@/components/premium/ImmersiveExperience';
import EnhancedCard from '@/components/premium/EnhancedCard';
import AnimatedButton from '@/components/premium/AnimatedButton';
import GamificationSystem from '@/components/premium/GamificationSystem';
import SmartRecommendations from '@/components/premium/SmartRecommendations';
import { cn } from '@/lib/utils';

interface Emotion {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  intensity: number;
  timestamp: Date;
  context?: string;
}

interface EmotionStats {
  dominant: string;
  balance: number;
  weeklyTrend: number;
  dailyAverage: number;
}

const B2CEmotionsPage: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [emotionHistory, setEmotionHistory] = useState<Emotion[]>([]);
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({
    dominant: 'Joy',
    balance: 75,
    weeklyTrend: 12,
    dailyAverage: 6.8
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const emotions = [
    { id: 'joy', name: 'Joie', icon: <Smile className="w-6 h-6" />, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { id: 'sadness', name: 'Tristesse', icon: <Frown className="w-6 h-6" />, color: 'bg-blue-500', textColor: 'text-blue-600' },
    { id: 'anger', name: 'Colère', icon: <Angry className="w-6 h-6" />, color: 'bg-red-500', textColor: 'text-red-600' },
    { id: 'fear', name: 'Peur', icon: <Surprised className="w-6 h-6" />, color: 'bg-purple-500', textColor: 'text-purple-600' },
    { id: 'disgust', name: 'Dégoût', icon: <Disgusted className="w-6 h-6" />, color: 'bg-green-500', textColor: 'text-green-600' },
    { id: 'neutral', name: 'Neutre', icon: <Meh className="w-6 h-6" />, color: 'bg-gray-500', textColor: 'text-gray-600' }
  ];

  const handleEmotionSelect = (emotionId: string) => {
    setCurrentEmotion(emotionId);
    const emotion = emotions.find(e => e.id === emotionId);
    if (emotion) {
      const newEmotion: Emotion = {
        id: emotionId,
        name: emotion.name,
        icon: emotion.icon,
        color: emotion.color,
        intensity: Math.random() * 100,
        timestamp: new Date(),
        context: 'Manuel'
      };
      setEmotionHistory(prev => [newEmotion, ...prev.slice(0, 9)]);
    }
  };

  const startAIAnalysis = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowAnalysis(true);
      setEmotionStats(prev => ({
        ...prev,
        balance: Math.random() * 100,
        weeklyTrend: (Math.random() - 0.5) * 40,
        dailyAverage: 3 + Math.random() * 5
      }));
    }, 3000);
  };

  const quickActions = [
    {
      title: "Scan Émotionnel IA",
      description: "Analyse faciale en temps réel",
      icon: <Camera className="w-5 h-5" />,
      action: startAIAnalysis,
      color: "bg-blue-500"
    },
    {
      title: "Journal Vocal",
      description: "Analysez vos émotions par la voix",
      icon: <Mic className="w-5 h-5" />,
      action: () => window.open('/app/voice-journal', '_blank'),
      color: "bg-purple-500"
    },
    {
      title: "Exercice de Régulation",
      description: "Techniques de gestion émotionnelle",
      icon: <Heart className="w-5 h-5" />,
      action: () => window.open('/app/breath', '_blank'),
      color: "bg-pink-500"
    },
    {
      title: "Suivi Détaillé",
      description: "Voir l'analyse complète",
      icon: <BarChart3 className="w-5 h-5" />,
      action: () => setShowAnalysis(!showAnalysis),
      color: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen relative" data-testid="page-root">
      <PremiumBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        <ImmersiveExperience
          title="Centre Émotionnel IA"
          subtitle="Explorez et comprenez vos émotions avec l'intelligence artificielle avancée"
          variant="emotions"
        />

        <div className="grid gap-8 mt-8">
          {/* Interface de sélection d'émotion */}
          <EnhancedCard title="Comment vous sentez-vous maintenant ?" icon={Heart}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {emotions.map(emotion => (
                <motion.div
                  key={emotion.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-scale",
                    currentEmotion === emotion.id
                      ? `${emotion.color} text-white border-white shadow-lg shadow-${emotion.color.split('-')[1]}-500/25`
                      : "bg-card hover:bg-accent border-border hover:border-primary/30"
                  )}
                  onClick={() => handleEmotionSelect(emotion.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={currentEmotion === emotion.id ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {emotion.icon}
                    </motion.div>
                    <span className="text-sm font-medium">{emotion.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scan IA en cours */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                    />
                    <Brain className="w-8 h-8 text-blue-500 ml-4" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-blue-700 mb-2">Analyse IA en cours...</h3>
                    <p className="text-sm text-blue-600">L'IA analyse vos expressions et patterns émotionnels</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions rapides */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedButton
                    onClick={action.action}
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-center gap-2 hover-scale"
                    disabled={isScanning && index === 0}
                  >
                    <div className={cn("p-2 rounded-full text-white", action.color)}>
                      {action.icon}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </AnimatedButton>
                </motion.div>
              ))}
            </div>
          </EnhancedCard>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Statistiques émotionnelles */}
            <EnhancedCard title="Équilibre Émotionnel" icon={Brain} className="lg:col-span-2">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div 
                    className="text-center p-4 rounded-lg bg-primary/5"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-primary">{emotionStats.balance}%</div>
                    <div className="text-sm text-muted-foreground">Équilibre</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-lg bg-green-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-green-600">+{emotionStats.weeklyTrend}%</div>
                    <div className="text-sm text-muted-foreground">Cette semaine</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-lg bg-blue-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">{emotionStats.dailyAverage}</div>
                    <div className="text-sm text-muted-foreground">Moy. quotidienne</div>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 rounded-lg bg-purple-50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl font-bold text-purple-600">{emotionStats.dominant}</div>
                    <div className="text-sm text-muted-foreground">Dominante</div>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progression hebdomadaire</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 animate-pulse">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Amélioration
                    </Badge>
                  </div>
                  <Progress value={emotionStats.balance} className="h-3" />
                </div>
              </div>
            </EnhancedCard>

            {/* Gamification */}
            <div className="space-y-6">
              <GamificationSystem 
                currentXP={1250}
                level={8}
                nextLevelXP={1500}
                achievements={[
                  { name: "Explorateur Émotionnel", description: "100 scans réalisés", icon: "🔍" },
                  { name: "Maître Zen", description: "30 jours consécutifs", icon: "🧘" }
                ]}
                compact
              />

              <SmartRecommendations 
                recommendations={[
                  {
                    title: "Méditation Guidée",
                    description: "Basée sur votre profil émotionnel",
                    confidence: 92,
                    action: () => window.open('/app/coach', '_blank')
                  },
                  {
                    title: "Exercice de Respiration",
                    description: "Pour réguler votre stress",
                    confidence: 87,
                    action: () => window.open('/app/breath', '_blank')
                  }
                ]}
                compact
              />
            </div>
          </div>

          {/* Historique récent */}
          <EnhancedCard title="Historique Récent" icon={Clock}>
            <AnimatePresence>
              {emotionHistory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {emotionHistory.map((emotion, index) => (
                    <motion.div
                      key={`${emotion.id}-${emotion.timestamp.getTime()}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-accent/30 border border-border hover-scale"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {emotion.icon}
                        </motion.div>
                        <span className="font-medium text-sm">{emotion.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {emotion.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="mt-2">
                        <Progress value={emotion.intensity} className="h-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Commencez à enregistrer vos émotions pour voir l'historique</p>
                </motion.div>
              )}
            </AnimatePresence>
          </EnhancedCard>

          {/* Analyse IA détaillée */}
          <AnimatePresence>
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="animate-fade-in"
              >
                <EnhancedCard title="Analyse IA Personnalisée" icon={Zap} className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Insights Personnalisés
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                          <span>Votre équilibre émotionnel s'améliore de <strong>12%</strong> cette semaine</span>
                        </motion.li>
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                          <span>Les moments de <strong>joie</strong> sont plus fréquents l'après-midi</span>
                        </motion.li>
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-start gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                          <span>Nous recommandons des exercices de <strong>respiration</strong> le matin</span>
                        </motion.li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        Actions Recommandées
                      </h4>
                      <div className="space-y-2">
                        {['Méditation matinale', 'Journaling émotionnel', 'Exercices de gratitude', 'Respiration guidée'].map((rec, i) => (
                          <motion.div
                            key={rec}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Badge variant="outline" className="mr-2 mb-2 hover-scale cursor-pointer">{rec}</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default B2CEmotionsPage;