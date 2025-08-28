
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Mic, 
  Camera, 
  FileText, 
  Activity, 
  Heart, 
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Play,
  Square,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';
import VoiceScanComponent from './scan/VoiceScanComponent';
import TextScanComponent from './scan/TextScanComponent';
import FacialScanComponent from './scan/FacialScanComponent';
import EmotionResultsDisplay from './scan/EmotionResultsDisplay';

type ScanType = 'voice' | 'text' | 'facial' | null;

interface EmotionResult {
  emotion: string;
  confidence: number;
  intensity: number;
  suggestions: string[];
  timestamp: Date;
}

const ScanPage: React.FC = () => {
  const [activeScan, setActiveScan] = useState<ScanType>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);

  const scanTypes = [
    {
      id: 'voice' as ScanType,
      title: 'Analyse Vocale',
      description: 'Détection émotionnelle par analyse de la voix',
      icon: Mic,
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Tonalité', 'Rythme', 'Intonation', 'Stress vocal'],
      accuracy: 94,
      duration: '30-60s'
    },
    {
      id: 'text' as ScanType,
      title: 'Analyse Textuelle',
      description: 'Analyse émotionnelle de vos écrits',
      icon: FileText,
      gradient: 'from-green-500 to-emerald-500',
      features: ['Sentiment', 'Mots-clés', 'Structure', 'Contexte'],
      accuracy: 89,
      duration: 'Instantané'
    },
    {
      id: 'facial' as ScanType,
      title: 'Analyse Faciale',
      description: 'Reconnaissance des micro-expressions',
      icon: Camera,
      gradient: 'from-purple-500 to-pink-500',
      features: ['Expressions', 'Posture', 'Gestuelle', 'Regard'],
      accuracy: 92,
      duration: '15-30s'
    }
  ];

  const startScan = (type: ScanType) => {
    setActiveScan(type);
    setIsScanning(true);
    setScanResults(null);

    // Simulation du scan avec résultats aléatoires
    setTimeout(() => {
      const emotions = ['Joie', 'Tristesse', 'Colère', 'Peur', 'Surprise', 'Dégoût', 'Calme', 'Stress'];
      const selectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const result: EmotionResult = {
        emotion: selectedEmotion,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        intensity: Math.floor(Math.random() * 40) + 30, // 30-70%
        suggestions: getSuggestionsForEmotion(selectedEmotion),
        timestamp: new Date()
      };

      setScanResults(result);
      setScanHistory(prev => [result, ...prev.slice(0, 4)]); // Garder les 5 derniers
      setIsScanning(false);
    }, Math.random() * 3000 + 2000); // 2-5 secondes
  };

  const getSuggestionsForEmotion = (emotion: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'Joie': ['Partagez cette énergie positive', 'Pratiquez la gratitude', 'Engagez-vous socialement'],
      'Tristesse': ['Prenez du temps pour vous', 'Parlez à un proche', 'Pratiquez la méditation'],
      'Colère': ['Respirez profondément', 'Faites du sport', 'Exprimez-vous dans votre journal'],
      'Peur': ['Identifiez la source', 'Relaxation progressive', 'Affirmations positives'],
      'Surprise': ['Explorez cette nouveauté', 'Restez ouvert', 'Adaptez-vous'],
      'Dégoût': ['Éloignez-vous du déclencheur', 'Purifiez votre environnement', 'Focalisez sur le positif'],
      'Calme': ['Maintenez cet équilibre', 'Pratiquez la pleine conscience', 'Savourez ce moment'],
      'Stress': ['Techniques de respiration', 'Organisez vos priorités', 'Prenez des pauses']
    };
    
    return suggestions[emotion] || ['Consultez votre coach IA', 'Pratiquez l\'auto-compassion', 'Restez à l\'écoute de vous'];
  };

  const stopScan = () => {
    setIsScanning(false);
    setActiveScan(null);
  };

  const resetScan = () => {
    setActiveScan(null);
    setIsScanning(false);
    setScanResults(null);
  };

  const renderScanComponent = () => {
    switch (activeScan) {
      case 'voice':
        return <VoiceScanComponent isScanning={isScanning} onComplete={() => setIsScanning(false)} />;
      case 'text':
        return <TextScanComponent isScanning={isScanning} onComplete={() => setIsScanning(false)} />;
      case 'facial':
        return <FacialScanComponent isScanning={isScanning} onComplete={() => setIsScanning(false)} />;
      default:
        return null;
    }
  };


  return (
    <PageLayout
      header={{
        title: 'Scanner Émotionnel',
        subtitle: 'Intelligence artificielle de pointe',
        description: 'Découvrez votre état émotionnel en temps réel grâce à notre technologie avancée de reconnaissance émotionnelle multi-modale.',
        icon: Brain,
        gradient: 'from-blue-500/20 to-purple-500/5',
        badge: 'IA Émotionnelle',
        stats: [
          {
            label: 'Précision',
            value: '94%',
            icon: Target,
            color: 'text-blue-500'
          },
          {
            label: 'Analyses',
            value: '2.1K',
            icon: BarChart3,
            color: 'text-green-500'
          },
          {
            label: 'Progression',
            value: '+23%',
            icon: TrendingUp,
            color: 'text-purple-500'
          },
          {
            label: 'Modes',
            value: '3',
            icon: Zap,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: isScanning ? 'Arrêter' : 'Nouveau Scan',
            onClick: isScanning ? stopScan : resetScan,
            variant: isScanning ? 'destructive' : 'default',
            icon: isScanning ? Square : Play
          },
          {
            label: 'Réinitialiser',
            onClick: resetScan,
            variant: 'outline',
            icon: RotateCcw,
            disabled: isScanning
          }
        ]
      }}
      tips={{
        title: 'Conseils pour un scan optimal',
        items: [
          {
            title: 'Environnement',
            content: 'Choisissez un endroit calme et bien éclairé pour de meilleurs résultats',
            icon: Camera
          },
          {
            title: 'Authenticité',
            content: 'Soyez naturel et authentique lors de votre analyse',
            icon: Heart
          },
          {
            title: 'Régularité',
            content: 'Effectuez des scans réguliers pour suivre votre évolution émotionnelle',
            icon: Zap
          }
        ],
        cta: {
          label: 'Guide d\'utilisation du scan IA',
          onClick: () => console.log('Scan guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Types de scan */}
        <div className="lg:col-span-2 space-y-6">
          {!activeScan ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Choisissez votre méthode d'analyse</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {scanTypes.map((scanType) => (
                  <FeatureCard
                    key={scanType.id}
                    title={scanType.title}
                    description={scanType.description}
                    icon={<scanType.icon className="h-6 w-6" />}
                    gradient={scanType.gradient}
                    category={`${scanType.accuracy}% précision`}
                    metadata={[
                      { label: 'Durée', value: scanType.duration },
                      { label: 'Fonctionnalités', value: scanType.features.length.toString() }
                    ]}
                    action={{
                      label: 'Commencer',
                      onClick: () => startScan(scanType.id),
                      variant: 'default'
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  {scanTypes.find(s => s.id === activeScan)?.title}
                </h2>
                <Badge variant={isScanning ? "default" : "secondary"}>
                  {isScanning ? 'Analyse en cours...' : 'Prêt'}
                </Badge>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  {renderScanComponent()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Résultats */}
          {scanResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-foreground">Résultats de votre analyse</h2>
              <EmotionResultsDisplay result={scanResults} />
            </motion.div>
          )}

          {/* Historique */}
          {scanHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historique des Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanHistory.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          result.emotion === 'Joie' || result.emotion === 'Calme' ? 'bg-green-500' :
                          result.emotion === 'Tristesse' || result.emotion === 'Peur' ? 'bg-blue-500' :
                          result.emotion === 'Colère' || result.emotion === 'Stress' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium">{result.emotion}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.timestamp.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{result.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confiance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panneau de monitoring */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitoring Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isScanning ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="font-medium">Analyse en cours...</p>
                    <p className="text-sm text-muted-foreground">
                      IA en train d'analyser vos données
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">127</p>
                      <p className="text-xs text-muted-foreground">Points de données</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">94%</p>
                      <p className="text-xs text-muted-foreground">Confiance</p>
                    </div>
                  </div>
                </div>
              ) : scanResults ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      scanResults.emotion === 'Joie' || scanResults.emotion === 'Calme' ? 'bg-green-100 dark:bg-green-900' :
                      scanResults.emotion === 'Tristesse' || scanResults.emotion === 'Peur' ? 'bg-blue-100 dark:bg-blue-900' :
                      scanResults.emotion === 'Colère' || scanResults.emotion === 'Stress' ? 'bg-red-100 dark:bg-red-900' :
                      'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      <Heart className={`h-8 w-8 ${
                        scanResults.emotion === 'Joie' || scanResults.emotion === 'Calme' ? 'text-green-600 dark:text-green-400' :
                        scanResults.emotion === 'Tristesse' || scanResults.emotion === 'Peur' ? 'text-blue-600 dark:text-blue-400' :
                        scanResults.emotion === 'Colère' || scanResults.emotion === 'Stress' ? 'text-red-600 dark:text-red-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    <p className="font-medium">Analyse terminée</p>
                    <p className="text-sm text-muted-foreground">
                      Émotion détectée: {scanResults.emotion}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">{scanResults.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confiance</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{scanResults.intensity}%</p>
                      <p className="text-xs text-muted-foreground">Intensité</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Sélectionnez un type de scan pour commencer l'analyse</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conseils personnalisés */}
          {scanResults && (
            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scanResults.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ScanPage;
