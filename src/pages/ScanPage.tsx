
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, Type, Camera, Play, Square, Zap, Target, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'voice' | 'text' | 'face'>('voice');
  const [emotionResults, setEmotionResults] = useState<any>(null);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setEmotionResults({
        dominant: 'Joie',
        confidence: 85,
        emotions: {
          'Joie': 85,
          'Sérénité': 65,
          'Excitation': 45,
          'Tristesse': 15,
          'Colère': 10
        }
      });
      setIsScanning(false);
    }, 3000);
  };

  const scanModes = [
    {
      id: 'voice',
      title: 'Analyse Vocale',
      description: 'Analyse de votre voix pour détecter les émotions',
      icon: <Mic className="h-6 w-6" />,
      gradient: 'from-blue-500 to-cyan-500',
      tip: 'Parlez naturellement pendant 10-15 secondes'
    },
    {
      id: 'text',
      title: 'Analyse Textuelle',
      description: 'Analyse de vos écrits et ressentis',
      icon: <Type className="h-6 w-6" />,
      gradient: 'from-green-500 to-emerald-500',
      tip: 'Écrivez quelques phrases sur votre ressenti'
    },
    {
      id: 'face',
      title: 'Analyse Faciale',
      description: 'Détection des micro-expressions',
      icon: <Camera className="h-6 w-6" />,
      gradient: 'from-purple-500 to-violet-500',
      tip: 'Regardez la caméra avec une expression naturelle'
    }
  ];

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
            label: 'Démarrer Analyse',
            onClick: handleStartScan,
            variant: 'default',
            icon: Play
          },
          {
            label: 'Historique',
            onClick: () => navigate('/scan/history'),
            variant: 'outline',
            icon: BarChart3
          }
        ]
      }}
      tips={{
        title: 'Conseils pour une analyse optimale',
        items: [
          {
            title: 'Environnement',
            content: 'Choisissez un endroit calme et bien éclairé',
            icon: Target
          },
          {
            title: 'Naturel',
            content: 'Soyez vous-même, ne forcez pas vos expressions',
            icon: Brain
          },
          {
            title: 'Régularité',
            content: 'Effectuez des scans réguliers pour suivre votre évolution',
            icon: TrendingUp
          }
        ],
        cta: {
          label: 'Guide d\'utilisation du scanner',
          onClick: () => console.log('Scanner guide')
        }
      }}
    >
      <div className="space-y-8">
        {/* Modes de Scan */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Modes d'Analyse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scanModes.map((mode) => (
              <FeatureCard
                key={mode.id}
                title={mode.title}
                description={mode.description}
                icon={mode.icon}
                gradient={mode.gradient}
                metadata={[{ label: 'Conseil', value: mode.tip }]}
                action={{
                  label: scanMode === mode.id ? 'Sélectionné' : 'Sélectionner',
                  onClick: () => setScanMode(mode.id as any),
                  variant: scanMode === mode.id ? 'default' : 'outline'
                }}
                className={scanMode === mode.id ? 'ring-2 ring-primary' : ''}
              />
            ))}
          </div>
        </div>

        {/* Zone de Scan et Résultats */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de contrôle */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                Mode: {scanModes.find(m => m.id === scanMode)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  size="lg"
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <Square className="mr-2 h-5 w-5" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Commencer l'analyse
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                  💡 {scanModes.find(m => m.id === scanMode)?.tip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Résultats d'Analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Analyse en cours...</p>
                </div>
              ) : emotionResults ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
                      {emotionResults.dominant} ({emotionResults.confidence}%)
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(emotionResults.emotions).map(([emotion, score]) => (
                      <div key={emotion} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{emotion}</span>
                          <span>{score}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-xl">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Recommandations</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Votre état émotionnel indique une humeur positive ! 
                      Continuez avec une musique énergisante ou une session de méditation.
                    </p>
                  </div>

                  <Button 
                    onClick={() => navigate('/music')}
                    className="w-full"
                  >
                    Écouter la musique recommandée
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Commencez une analyse pour voir vos résultats</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ScanPage;
