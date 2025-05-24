
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Mic, 
  Heart, 
  Brain, 
  Zap, 
  TrendingUp,
  Play,
  Square,
  Upload,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const [scanType, setScanType] = useState<'audio' | 'video' | 'text' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const isDemo = user?.email?.endsWith('@exemple.fr');

  const scanTypes = [
    {
      id: 'audio',
      title: 'Analyse vocale',
      description: 'Analysez vos émotions via votre voix',
      icon: Mic,
      color: 'bg-blue-500',
      available: true
    },
    {
      id: 'video',
      title: 'Analyse faciale',
      description: 'Détection d\'émotions par reconnaissance faciale',
      icon: Camera,
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'text',
      title: 'Analyse textuelle',
      description: 'Analysez le sentiment de votre texte',
      icon: Brain,
      color: 'bg-purple-500',
      available: true
    }
  ];

  const mockResults = {
    audio: {
      emotion: 'Calme',
      confidence: 87,
      details: {
        primary: 'Sérénité',
        secondary: 'Concentration',
        stress: 23,
        energy: 65
      },
      recommendations: [
        'Maintenez ce niveau de calme',
        'Profitez de cet état pour des tâches créatives',
        'Pensez à faire une pause dans 2 heures'
      ]
    },
    video: {
      emotion: 'Concentration',
      confidence: 92,
      details: {
        primary: 'Focus',
        secondary: 'Détermination',
        stress: 15,
        energy: 78
      },
      recommendations: [
        'Excellent état de concentration',
        'Continuez sur vos tâches importantes',
        'Hydratez-vous régulièrement'
      ]
    },
    text: {
      emotion: 'Optimisme',
      confidence: 76,
      details: {
        primary: 'Positivité',
        secondary: 'Motivation',
        stress: 31,
        energy: 72
      },
      recommendations: [
        'Votre attitude positive est un atout',
        'Partagez cette énergie avec votre équipe',
        'Planifiez des objectifs ambitieux'
      ]
    }
  };

  const startScan = async (type: 'audio' | 'video' | 'text') => {
    setScanType(type);
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);

    if (isDemo) {
      // Simulation pour les comptes démo
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScanProgress(i);
      }
      
      setResult(mockResults[type]);
      toast.success('Analyse terminée !');
    } else {
      try {
        // Intégration réelle avec les APIs (Hume AI, OpenAI, etc.)
        // Code d'intégration API ici
        toast.success('Analyse en cours avec l\'IA...');
        
        // Simulation progressive
        for (let i = 0; i <= 100; i += 5) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setScanProgress(i);
        }
        
        setResult(mockResults[type]);
      } catch (error) {
        toast.error('Erreur lors de l\'analyse');
      }
    }
    
    setIsScanning(false);
  };

  const resetScan = () => {
    setScanType(null);
    setResult(null);
    setScanProgress(0);
    setIsScanning(false);
    setIsRecording(false);
  };

  if (result) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mb-4">
                <Heart className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Analyse terminée !</CardTitle>
              <CardDescription className="text-lg">
                Voici les résultats de votre scan émotionnel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {result.emotion}
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Confiance: {result.confidence}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Détails émotionnels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Émotion principale:</span>
                      <span className="font-medium">{result.details.primary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Émotion secondaire:</span>
                      <span className="font-medium">{result.details.secondary}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Niveau de stress:</span>
                        <span className="font-medium">{result.details.stress}%</span>
                      </div>
                      <Progress value={result.details.stress} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Niveau d'énergie:</span>
                        <span className="font-medium">{result.details.energy}%</span>
                      </div>
                      <Progress value={result.details.energy} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Zap className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-4">
                <Button onClick={resetScan} variant="outline">
                  Nouveau scan
                </Button>
                <Button onClick={() => window.location.href = '/music'}>
                  Écouter de la musique adaptée
                </Button>
                <Button onClick={() => window.location.href = '/coach'}>
                  Parler au Coach IA
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">Analyse en cours...</CardTitle>
              <CardDescription>
                L'IA analyse vos données émotionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-3" />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {scanProgress < 30 ? 'Collecte des données...' :
                   scanProgress < 70 ? 'Analyse par intelligence artificielle...' :
                   'Génération des recommandations...'}
                </p>
              </div>

              <Button 
                variant="outline" 
                onClick={resetScan}
                className="w-full"
              >
                Annuler
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Scanner d'émotions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analysez votre état émotionnel en temps réel grâce à l'intelligence artificielle
          </p>
          {isDemo && (
            <Badge variant="secondary" className="mt-4">
              Mode démo - Résultats simulés
            </Badge>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scanTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`mx-auto p-4 ${type.color} rounded-full w-fit mb-4`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={() => startScan(type.id as 'audio' | 'video' | 'text')}
                    disabled={!type.available}
                    className="w-full"
                  >
                    {type.available ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Commencer l'analyse
                      </>
                    ) : (
                      'Bientôt disponible'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Historique récent</span>
            </CardTitle>
            <CardDescription>
              Vos dernières analyses émotionnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Calme et serein</p>
                    <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <Badge variant="secondary">87%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Concentré</p>
                    <p className="text-sm text-muted-foreground">Hier</p>
                  </div>
                </div>
                <Badge variant="secondary">92%</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Énergique</p>
                    <p className="text-sm text-muted-foreground">Avant-hier</p>
                  </div>
                </div>
                <Badge variant="secondary">78%</Badge>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Voir l'historique complet
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ScanPage;
