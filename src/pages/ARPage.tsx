
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/common/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Smile, 
  Heart, 
  Sparkles, 
  Play, 
  StopCircle,
  Download,
  Share2,
  Eye,
  Palette,
  Zap,
  Filter,
  RotateCcw,
  Image,
  Video,
  Settings
} from 'lucide-react';

const ARPage: React.FC = () => {
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [emotionDetected, setEmotionDetected] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('none');

  const filters = [
    { id: 'none', name: 'Aucun', color: 'bg-gray-500', effect: 'Normal' },
    { id: 'joy', name: 'Joie', color: 'bg-yellow-500', effect: 'Particules dorées' },
    { id: 'calm', name: 'Sérénité', color: 'bg-blue-500', effect: 'Bulles apaisantes' },
    { id: 'energy', name: 'Énergie', color: 'bg-red-500', effect: 'Éclairs colorés' },
    { id: 'love', name: 'Amour', color: 'bg-pink-500', effect: 'Cœurs flottants' },
    { id: 'focus', name: 'Concentration', color: 'bg-purple-500', effect: 'Géométrie sacrée' },
    { id: 'creativity', name: 'Créativité', color: 'bg-green-500', effect: 'Formes abstraites' }
  ];

  const emotionTips = [
    {
      title: 'Expression naturelle',
      content: 'Laissez vos émotions s\'exprimer naturellement devant la caméra pour une analyse précise.',
      icon: Smile
    },
    {
      title: 'Éclairage optimal',
      content: 'Assurez-vous d\'avoir un bon éclairage pour améliorer la détection des expressions.',
      icon: Eye
    },
    {
      title: 'Partagez votre art',
      content: 'Créez et partagez vos créations AR émotionnelles avec la communauté.',
      icon: Share2
    }
  ];

  useEffect(() => {
    if (isFilterActive) {
      // Simuler la détection d'émotion
      const emotions = ['Joie', 'Sérénité', 'Énergie', 'Concentration'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotionDetected(randomEmotion);
      
      // Simuler un score de mood qui augmente
      const interval = setInterval(() => {
        setMoodScore(prev => {
          const newScore = prev + Math.random() * 10;
          return newScore > 100 ? 100 : newScore;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setEmotionDetected(null);
      setMoodScore(0);
    }
  }, [isFilterActive]);

  const headerData = {
    title: "Filtres de Réalité Augmentée",
    subtitle: "Exprimez vos émotions avec style",
    description: "Transformez vos émotions en art visuel grâce à nos filtres AR intelligents qui s'adaptent à votre état émotionnel en temps réel.",
    icon: Camera,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
    badge: "Réalité Augmentée",
    stats: [
      { label: "Filtres Disponibles", value: "12+", icon: Filter, color: "text-blue-600" },
      { label: "Émotions Détectées", value: "7", icon: Heart, color: "text-red-500" },
      { label: "Créations Partagées", value: "2.5k", icon: Share2, color: "text-green-500" },
      { label: "Précision IA", value: "94%", icon: Zap, color: "text-purple-500" }
    ],
    actions: [
      {
        label: "Tutoriel AR",
        onClick: () => console.log('Tutoriel AR'),
        variant: 'outline' as const,
        icon: Play
      },
      {
        label: "Galerie Communauté",
        onClick: () => console.log('Galerie'),
        variant: 'secondary' as const,
        icon: Image
      }
    ]
  };

  return (
    <PageLayout
      header={headerData}
      tips={{
        title: "Conseils pour l'AR Émotionnelle",
        items: emotionTips,
        cta: {
          label: "Guide Complet AR",
          onClick: () => console.log('Guide AR')
        }
      }}
      className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"
    >
      <div className="space-y-8">
        {/* Caméra AR Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Studio de Création AR
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Caméra Preview */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isFilterActive ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-white text-center space-y-4"
                      >
                        <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                          <Sparkles className="h-16 w-16 text-white" />
                        </div>
                        <div className="space-y-2">
                          {emotionDetected && (
                            <Badge className="bg-white/20 text-white border-white/30">
                              Émotion: {emotionDetected}
                            </Badge>
                          )}
                          <div className="bg-black/30 rounded-lg p-2">
                            <p className="text-sm">Score de bien-être</p>
                            <Progress value={moodScore} className="mt-1" />
                            <p className="text-xs mt-1">{Math.round(moodScore)}%</p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4" />
                        <p>Cliquez sur "Démarrer" pour activer la caméra AR</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay UI */}
                  {isFilterActive && (
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                        {filters.find(f => f.id === currentFilter)?.name || 'Aucun'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/30">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button
                      onClick={() => setIsFilterActive(!isFilterActive)}
                      size="lg"
                      className={isFilterActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                    >
                      {isFilterActive ? (
                        <>
                          <StopCircle className="h-5 w-5 mr-2" />
                          Arrêter
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Démarrer
                        </>
                      )}
                    </Button>
                    {isFilterActive && (
                      <>
                        <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30">
                          <Image className="h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/20 text-white border-white/30">
                          <Video className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Changer Caméra
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>

              {/* Filtres et Contrôles */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Filtres Émotionnels
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {filters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        onClick={() => setCurrentFilter(filter.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          currentFilter === filter.id
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${filter.color}`} />
                          <div>
                            <div className="font-medium">{filter.name}</div>
                            <div className="text-xs text-muted-foreground">{filter.effect}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Paramètres en temps réel */}
                {isFilterActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Analyse en Temps Réel
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Détection faciale</span>
                        <Badge variant="outline" className="text-green-600">
                          Actif
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Analyse émotionnelle</span>
                        <Badge variant="outline" className="text-blue-600">
                          {emotionDetected || 'En attente'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Qualité du signal</span>
                        <Badge variant="outline" className="text-green-600">
                          Excellente
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Galerie récente */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Créations Récentes
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                      >
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tutoriels et Communauté */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Tutoriels AR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Premiers pas avec l'AR", duration: "3 min", level: "Débutant" },
                { title: "Créer ses propres filtres", duration: "8 min", level: "Intermédiaire" },
                { title: "Maîtriser l'analyse émotionnelle", duration: "12 min", level: "Avancé" }
              ].map((tutorial, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <div className="font-medium">{tutorial.title}</div>
                    <div className="text-sm text-muted-foreground">{tutorial.duration} • {tutorial.level}</div>
                  </div>
                  <Play className="h-4 w-4 text-primary" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Communauté AR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { user: "Marie D.", creation: "Filtre Zen", likes: 42, emotion: "Sérénité" },
                { user: "Thomas L.", creation: "Énergie Pure", likes: 38, emotion: "Énergie" },
                { user: "Sophie M.", creation: "Amour Radieux", likes: 56, emotion: "Amour" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{item.creation}</div>
                      <div className="text-sm text-muted-foreground">par {item.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-3 w-3 text-red-500" />
                      {item.likes}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.emotion}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ARPage;
