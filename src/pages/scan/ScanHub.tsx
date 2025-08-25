import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Camera, Mic, Heart, Activity, TrendingUp, 
  Play, Pause, BarChart3, Calendar, Settings, 
  Zap, Sparkles, Clock, Target, Award, ArrowRight,
  Smile, Meh, Frown, AlertCircle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  id: string;
  timestamp: Date;
  overallScore: number;
  emotions: {
    happiness: number;
    stress: number;
    anxiety: number;
    energy: number;
    focus: number;
  };
  modalities: {
    facial: boolean;
    voice: boolean;
    physiological: boolean;
  };
  recommendations: string[];
  duration: number;
}

interface ScanStats {
  totalScans: number;
  averageScore: number;
  improvement: number;
  streakDays: number;
  lastScan: Date | null;
}

export const ScanHub: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedModalities, setSelectedModalities] = useState({
    facial: true,
    voice: true,
    physiological: false
  });

  const [scanStats, setScanStats] = useState<ScanStats>({
    totalScans: 47,
    averageScore: 78,
    improvement: 15,
    streakDays: 5,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000)
  });

  const recentScans: ScanResult[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      overallScore: 82,
      emotions: {
        happiness: 85,
        stress: 25,
        anxiety: 20,
        energy: 75,
        focus: 90
      },
      modalities: {
        facial: true,
        voice: true,
        physiological: false
      },
      recommendations: [
        'Continuez vos pratiques de méditation matinales',
        'Considérez une pause relaxante vers 15h',
        'Votre niveau de focus est excellent aujourd\'hui'
      ],
      duration: 180
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
      overallScore: 75,
      emotions: {
        happiness: 70,
        stress: 45,
        anxiety: 35,
        energy: 60,
        focus: 80
      },
      modalities: {
        facial: true,
        voice: true,
        physiological: true
      },
      recommendations: [
        'Essayez une session de respiration profonde',
        'Une courte promenade pourrait réduire votre stress',
        'Hydratez-vous davantage aujourd\'hui'
      ],
      duration: 240
    }
  ];

  const scanModes = [
    {
      id: 'quick',
      title: 'Scan Rapide',
      description: 'Analyse express en 30 secondes',
      duration: '30s',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      features: ['Analyse faciale', 'Détection d\'humeur basique']
    },
    {
      id: 'standard',
      title: 'Scan Standard',
      description: 'Analyse complète multimodale',
      duration: '3 min',
      icon: Brain,
      color: 'from-blue-500 to-purple-500',
      features: ['Analyse faciale', 'Analyse vocale', 'Détection des émotions']
    },
    {
      id: 'advanced',
      title: 'Scan Avancé',
      description: 'Analyse approfondie avec biométrie',
      duration: '5 min',
      icon: Activity,
      color: 'from-green-500 to-teal-500',
      features: ['Toutes les modalités', 'Biométrie', 'Recommandations IA']
    }
  ];

  const startScan = async (mode: string) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulation du scan
    const duration = mode === 'quick' ? 30000 : mode === 'standard' ? 180000 : 300000;
    const steps = 20;
    const stepDuration = duration / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      setScanProgress((i / steps) * 100);
    }
    
    setIsScanning(false);
    toast({
      title: "Scan terminé !",
      description: "Votre analyse émotionnelle est prête. Consultez vos résultats.",
    });
    
    // Rediriger vers les résultats
    navigate('/scan/results/latest');
  };

  const getEmotionIcon = (emotion: string, value: number) => {
    if (value >= 70) return <Smile className="w-4 h-4 text-green-500" />;
    if (value >= 40) return <Meh className="w-4 h-4 text-yellow-500" />;
    return <Frown className="w-4 h-4 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Scan Émotionnel IA</span>
        </div>
        <h1 className="text-4xl font-bold">Centre d'Analyse Émotionnelle</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Découvrez votre état émotionnel en temps réel grâce à notre IA de pointe. 
          Analyses multimodales pour une compréhension complète de votre bien-être.
        </p>
      </motion.div>

      {/* Stats rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{scanStats.totalScans}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score Moyen</p>
                <p className={`text-2xl font-bold ${getScoreColor(scanStats.averageScore)}`}>
                  {scanStats.averageScore}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amélioration</p>
                <p className="text-2xl font-bold text-green-500">+{scanStats.improvement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série</p>
                <p className="text-2xl font-bold text-orange-500">{scanStats.streakDays}j</p>
              </div>
              <Award className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interface de scan */}
      {isScanning ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="border-primary bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Brain className="w-6 h-6 text-primary animate-pulse" />
                <span>Analyse en cours...</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-primary mb-2">
                  {Math.round(scanProgress)}%
                </div>
                <Progress value={scanProgress} className="h-3" />
              </div>
              
              <div className="grid gap-2 text-center text-sm text-muted-foreground">
                <p>🎥 Analyse des expressions faciales...</p>
                <p>🎤 Traitement de l'analyse vocale...</p>
                <p>🧠 Calcul des métriques émotionnelles...</p>
                <p>✨ Génération des recommandations IA...</p>
              </div>
              
              <Button 
                onClick={() => {
                  setIsScanning(false);
                  setScanProgress(0);
                }}
                variant="outline"
                className="w-full"
              >
                <Pause className="w-4 h-4 mr-2" />
                Annuler le scan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Tabs defaultValue="new-scan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="new-scan">Nouveau Scan</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="new-scan" className="space-y-6">
            {/* Modes de scan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold">Choisissez votre type de scan</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {scanModes.map((mode) => (
                  <Card key={mode.id} className="cursor-pointer hover:shadow-lg transition-all group">
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4`}>
                        <mode.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="flex items-center justify-between">
                        {mode.title}
                        <Badge variant="secondary">{mode.duration}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {mode.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => startScan(mode.id)}
                        className="w-full"
                        size="lg"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer le scan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Configuration du scan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="facial"
                        checked={selectedModalities.facial}
                        onChange={(e) => setSelectedModalities(prev => ({
                          ...prev,
                          facial: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="facial" className="text-sm flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        Analyse faciale
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="voice"
                        checked={selectedModalities.voice}
                        onChange={(e) => setSelectedModalities(prev => ({
                          ...prev,
                          voice: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="voice" className="text-sm flex items-center">
                        <Mic className="w-4 h-4 mr-1" />
                        Analyse vocale
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="physiological"
                        checked={selectedModalities.physiological}
                        onChange={(e) => setSelectedModalities(prev => ({
                          ...prev,
                          physiological: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="physiological" className="text-sm flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        Biométrie
                        <Badge variant="secondary" className="ml-1 text-xs">Premium</Badge>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Historique des scans</h2>
              <Button onClick={() => navigate('/scan/analytics')} variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Voir les analytics
              </Button>
            </div>

            <div className="space-y-4">
              {recentScans.map((scan) => (
                <Card key={scan.id} className="cursor-pointer hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">
                            Scan du {scan.timestamp.toLocaleDateString()}
                          </h3>
                          <Badge 
                            variant={scan.overallScore >= 80 ? 'default' : scan.overallScore >= 60 ? 'secondary' : 'destructive'}
                          >
                            Score: {scan.overallScore}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {scan.timestamp.toLocaleTimeString()} • Durée: {Math.round(scan.duration / 60)}min
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-5 mb-4">
                      {Object.entries(scan.emotions).map(([emotion, value]) => (
                        <div key={emotion} className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            {getEmotionIcon(emotion, value)}
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">{emotion}</p>
                          <p className="text-sm font-medium">{value}%</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recommandations IA:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {scan.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <Sparkles className="w-3 h-3 mr-2 mt-0.5 text-primary" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => navigate('/scan/history')} variant="outline">
                Voir tout l'historique
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution émotionnelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                      <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Graphique d'évolution</p>
                      <p className="text-sm text-muted-foreground">
                        Visualisation des tendances sur 30 jours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patterns détectés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Pic matinal</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Vos meilleurs scores sont entre 8h et 10h
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Amélioration continue</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Progression constante de votre bien-être général
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Attention après-midi</h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Baisse d'énergie observée vers 15h-16h
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ScanHub;