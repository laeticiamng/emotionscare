import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Headphones, 
  Play, 
  Pause, 
  VolumeX, 
  Volume2, 
  Mountain, 
  Waves, 
  Trees, 
  Home, 
  Settings,
  Timer,
  Target,
  TrendingUp,
  BarChart3,
  Eye,
  Brain,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/common/PageLayout';
import FeatureCard from '@/components/common/FeatureCard';

interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  type: 'relaxation' | 'meditation' | 'therapy' | 'adventure';
  environment: string;
  benefits: string[];
  gradient: string;
  icon: React.ElementType;
  rating: number;
  completions: number;
}

const VRTherapyPage: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<VRSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [immersionLevel, setImmersionLevel] = useState(0);

  const vrSessions: VRSession[] = [
    {
      id: 'mountain-peak',
      title: 'Sommet des Alpes',
      description: 'Méditation au sommet d\'une montagne avec vue panoramique',
      duration: 900, // 15 minutes
      difficulty: 'Débutant',
      type: 'meditation',
      environment: 'Montagne',
      benefits: ['Réduction du stress', 'Clarté mentale', 'Sensation de liberté'],
      gradient: 'from-blue-600 to-indigo-800',
      icon: Mountain,
      rating: 4.8,
      completions: 1247
    },
    {
      id: 'ocean-depths',
      title: 'Profondeurs Océaniques',
      description: 'Exploration sous-marine apaisante avec sons de baleines',
      duration: 1200, // 20 minutes
      difficulty: 'Intermédiaire',
      type: 'relaxation',
      environment: 'Océan',
      benefits: ['Relaxation profonde', 'Réduction anxiété', 'Connexion nature'],
      gradient: 'from-cyan-500 to-blue-700',
      icon: Waves,
      rating: 4.9,
      completions: 892
    },
    {
      id: 'forest-sanctuary',
      title: 'Sanctuaire Forestier',
      description: 'Forêt enchantée avec thérapie guidée par la nature',
      duration: 1800, // 30 minutes
      difficulty: 'Avancé',
      type: 'therapy',
      environment: 'Forêt',
      benefits: ['Guérison émotionnelle', 'Ancrage', 'Reconnexion à soi'],
      gradient: 'from-green-500 to-emerald-700',
      icon: Trees,
      rating: 4.7,
      completions: 634
    },
    {
      id: 'cosmic-journey',
      title: 'Voyage Cosmique',
      description: 'Exploration de l\'espace pour une perspective transcendante',
      duration: 2400, // 40 minutes
      difficulty: 'Avancé',
      type: 'adventure',
      environment: 'Espace',
      benefits: ['Expansion de conscience', 'Perspective cosmique', 'Éveil spirituel'],
      gradient: 'from-purple-600 to-pink-700',
      icon: Brain,
      rating: 4.6,
      completions: 423
    }
  ];

  const [userStats] = useState({
    totalSessions: 47,
    totalMinutes: 1420,
    favoriteEnvironment: 'Océan',
    improvementScore: 32
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && selectedSession) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedSession.duration) {
            setIsActive(false);
            setImmersionLevel(100);
            return selectedSession.duration;
          }
          return prev + 1;
        });

        // Simule l'augmentation progressive de l'immersion
        setImmersionLevel(prev => {
          const target = Math.min((currentTime / selectedSession.duration) * 100, 95);
          return prev < target ? prev + 0.5 : prev;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, selectedSession, currentTime]);

  const startSession = (session: VRSession) => {
    setSelectedSession(session);
    setCurrentTime(0);
    setImmersionLevel(0);
    setIsActive(true);
  };

  const togglePlayPause = () => {
    setIsActive(!isActive);
  };

  const stopSession = () => {
    setIsActive(false);
    setCurrentTime(0);
    setImmersionLevel(0);
    setSelectedSession(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    return `${Math.floor(seconds / 60)} min`;
  };

  return (
    <PageLayout
      header={{
        title: 'Thérapie VR',
        subtitle: 'Immersion thérapeutique en réalité virtuelle',
        description: 'Explorez des environnements virtuels thérapeutiques conçus pour votre bien-être mental et émotionnel.',
        icon: Headphones,
        gradient: 'from-purple-500/20 to-pink-500/5',
        badge: 'Réalité Virtuelle',
        stats: [
          {
            label: 'Sessions',
            value: userStats.totalSessions.toString(),
            icon: Timer,
            color: 'text-purple-500'
          },
          {
            label: 'Minutes',
            value: userStats.totalMinutes.toString(),
            icon: Target,
            color: 'text-blue-500'
          },
          {
            label: 'Amélioration',
            value: `+${userStats.improvementScore}%`,
            icon: TrendingUp,
            color: 'text-green-500'
          },
          {
            label: 'Environnements',
            value: vrSessions.length.toString(),
            icon: BarChart3,
            color: 'text-orange-500'
          }
        ],
        actions: [
          {
            label: selectedSession && isActive ? 'Pause' : 'Reprendre',
            onClick: togglePlayPause,
            variant: 'default',
            icon: selectedSession && isActive ? Pause : Play,
            disabled: !selectedSession
          },
          {
            label: 'Arrêter',
            onClick: stopSession,
            variant: 'outline',
            icon: VolumeX,
            disabled: !selectedSession
          }
        ]
      }}
      tips={{
        title: 'Conseils pour une expérience VR optimale',
        items: [
          {
            title: 'Préparation',
            content: 'Utilisez un casque VR de qualité et assurez-vous d\'être dans un espace sûr',
            icon: Eye
          },
          {
            title: 'Confort',
            content: 'Commencez par des sessions courtes et augmentez progressivement',
            icon: Heart
          },
          {
            title: 'Immersion',
            content: 'Laissez-vous porter par l\'expérience sans résistance',
            icon: Brain
          }
        ],
        cta: {
          label: 'Guide de configuration VR',
          onClick: () => console.log('VR Setup guide')
        }
      }}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sessions disponibles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Environnements Thérapeutiques</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {vrSessions.map((session) => (
                <FeatureCard
                  key={session.id}
                  title={session.title}
                  description={session.description}
                  icon={<session.icon className="h-6 w-6" />}
                  gradient={session.gradient}
                  category={session.difficulty}
                  metadata={[
                    { label: 'Durée', value: formatDuration(session.duration) },
                    { label: 'Type', value: session.type },
                    { label: 'Note', value: `${session.rating}★` }
                  ]}
                  action={{
                    label: selectedSession?.id === session.id && isActive ? 'En cours' : 'Démarrer',
                    onClick: () => startSession(session),
                    variant: selectedSession?.id === session.id && isActive ? 'default' : 'outline',
                    disabled: selectedSession?.id === session.id && isActive
                  }}
                  className={`${selectedSession?.id === session.id ? 'ring-2 ring-primary' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Bénéfices et informations */}
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedSession.icon className="h-5 w-5" />
                    {selectedSession.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{selectedSession.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-2">Bénéfices:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSession.benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Environnement</p>
                        <p className="font-medium">{selectedSession.environment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Complétions</p>
                        <p className="font-medium">{selectedSession.completions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Note moyenne</p>
                        <p className="font-medium">{selectedSession.rating} ★</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Panneau de contrôle VR */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Contrôle VR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedSession ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Affichage de la session */}
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedSession.gradient} flex items-center justify-center mx-auto mb-3`}>
                        <selectedSession.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold">{selectedSession.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(currentTime)} / {formatTime(selectedSession.duration)}
                      </p>
                    </div>

                    {/* Barre de progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{Math.round((currentTime / selectedSession.duration) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(currentTime / selectedSession.duration) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Niveau d'immersion */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Immersion</span>
                        <span>{Math.round(immersionLevel)}%</span>
                      </div>
                      <Progress 
                        value={immersionLevel} 
                        className="h-2"
                      />
                    </div>

                    {/* Contrôles audio */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Volume</span>
                        <span className="text-sm font-medium">{volume}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Contrôles de session */}
                    <div className="flex gap-2">
                      <Button
                        onClick={togglePlayPause}
                        className="flex-1"
                        variant={isActive ? "outline" : "default"}
                      >
                        {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isActive ? 'Pause' : 'Play'}
                      </Button>
                      <Button onClick={stopSession} variant="outline" size="icon">
                        <VolumeX className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* État de la session */}
                    {isActive && (
                      <div className="bg-primary/5 p-3 rounded-lg text-center">
                        <p className="text-sm text-primary font-medium">
                          Session en cours...
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Laissez-vous guider par l'expérience
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Headphones className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Sélectionnez une session VR pour commencer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle>Vos Statistiques VR</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{userStats.totalSessions}</p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{Math.floor(userStats.totalMinutes / 60)}h</p>
                  <p className="text-xs text-muted-foreground">Temps total</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Environnement préféré</span>
                  <Badge variant="secondary">{userStats.favoriteEnvironment}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Amélioration bien-être</span>
                  <span className="text-green-600 font-medium">+{userStats.improvementScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default VRTherapyPage;