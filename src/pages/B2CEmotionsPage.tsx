import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Smile, Frown, Meh, Angry, AlertCircle, XCircle,
  TrendingUp, Calendar, Clock, Zap, Star, Award, Target, Activity,
  BarChart3, Sparkles, Timer, Trophy, Eye, Camera, Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

/**
 * B2C EMOTIONS PAGE - EMOTIONSCARE
 * Centre émotionnel IA accessible WCAG 2.1 AA
 */
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
    { id: 'fear', name: 'Peur', icon: <AlertCircle className="w-6 h-6" />, color: 'bg-purple-500', textColor: 'text-purple-600' },
    { id: 'disgust', name: 'Dégoût', icon: <XCircle className="w-6 h-6" />, color: 'bg-green-500', textColor: 'text-green-600' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6" data-testid="page-root">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>
      <a 
        href="#emotion-selector" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au sélecteur d'émotions
      </a>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" aria-hidden="true">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Centre Émotionnel IA
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explorez et comprenez vos émotions avec l'intelligence artificielle avancée
          </p>
        </motion.header>

        <main id="main-content" role="main" className="grid gap-8">
          {/* Interface de sélection d'émotion */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl" id="emotion-selector">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" aria-hidden="true" />
                Comment vous sentez-vous maintenant ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset className="mb-6">
                <legend className="sr-only">Sélectionnez votre émotion actuelle</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" role="radiogroup" aria-label="Choisir votre émotion actuelle">
                  {emotions.map(emotion => (
                    <motion.button
                      key={emotion.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary",
                        currentEmotion === emotion.id
                          ? `${emotion.color} text-white border-white shadow-lg`
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-blue-300"
                      )}
                      onClick={() => handleEmotionSelect(emotion.id)}
                      role="radio"
                      aria-checked={currentEmotion === emotion.id}
                      aria-describedby={`${emotion.id}-desc`}
                      tabIndex={0}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <motion.div
                          animate={currentEmotion === emotion.id ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5 }}
                          aria-hidden="true"
                        >
                          {emotion.icon}
                        </motion.div>
                        <span className="text-sm font-medium">{emotion.name}</span>
                      </div>
                      <span id={`${emotion.id}-desc`} className="sr-only">
                        {`Sélectionner l'émotion ${emotion.name}`}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </fieldset>

              {/* Scan IA en cours */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200"
                    role="status"
                    aria-live="polite"
                    aria-label="Analyse IA en cours"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                        aria-hidden="true"
                      />
                      <Brain className="w-8 h-8 text-blue-500 ml-4" aria-hidden="true" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-blue-700 mb-2">Analyse IA en cours...</h3>
                      <p className="text-sm text-blue-600">L'IA analyse vos expressions et patterns émotionnels</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions rapides */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="Actions rapides pour l'analyse émotionnelle">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      onClick={action.action}
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all"
                      disabled={isScanning && index === 0}
                    >
                      <div className={cn("p-2 rounded-full text-white", action.color)}>
                        {action.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-slate-600">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Statistiques émotionnelles */}
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  Équilibre Émotionnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="text-center p-4 rounded-lg bg-blue-50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-blue-600">{emotionStats.balance}%</div>
                      <div className="text-sm text-slate-600">Équilibre</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-lg bg-green-50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-green-600">+{emotionStats.weeklyTrend}%</div>
                      <div className="text-sm text-slate-600">Cette semaine</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-lg bg-purple-50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-purple-600">{emotionStats.dailyAverage}</div>
                      <div className="text-sm text-slate-600">Moy. quotidienne</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 rounded-lg bg-amber-50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-amber-600">{emotionStats.dominant}</div>
                      <div className="text-sm text-slate-600">Dominante</div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progression hebdomadaire</span>
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Amélioration
                      </Badge>
                    </div>
                    <Progress value={emotionStats.balance} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions recommandées */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">Méditation Guidée</h4>
                    <p className="text-sm text-blue-600 mb-3">Basée sur votre profil émotionnel</p>
                    <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">
                      Commencer (92% compatibilité)
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Exercice de Respiration</h4>
                    <p className="text-sm text-green-600 mb-3">Pour réguler votre stress</p>
                    <Button size="sm" variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">
                      Commencer (87% compatibilité)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historique récent */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                Historique Récent
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:shadow-md transition-all"
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
                        <div className="text-xs text-slate-500">
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
                    className="text-center py-8 text-slate-500"
                  >
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Commencez à enregistrer vos émotions pour voir l'historique</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Analyse IA détaillée */}
          <AnimatePresence>
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      Analyse IA Personnalisée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                              <Badge variant="outline" className="mr-2 mb-2 hover:shadow-md cursor-pointer transition-all">{rec}</Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default B2CEmotionsPage;