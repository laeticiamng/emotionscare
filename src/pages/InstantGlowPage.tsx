
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/hooks/useMood';
import { Sparkles, Zap, Coffee, Sun, Heart, Star } from 'lucide-react';

const InstantGlowPage: React.FC = () => {
  const { mood, updateMood, isLoading } = useMood();
  const [activeGlow, setActiveGlow] = useState<any>(null);
  const [glowStreak, setGlowStreak] = useState(3);
  const [dailyGlows, setDailyGlows] = useState(2);

  // Glows adaptés selon l'humeur
  const getGlowsByMood = () => {
    if (!mood) return defaultGlows;
    
    const { valence, arousal } = mood;
    
    if (valence < 30) {
      return glows.filter(g => g.category === 'uplifting');
    } else if (arousal > 70) {
      return glows.filter(g => g.category === 'calming');
    } else {
      return glows.filter(g => g.category === 'energizing');
    }
  };

  const glows = [
    {
      id: 'confidence-boost',
      name: 'Boost de Confiance',
      category: 'uplifting',
      description: 'Affirmations positives pour renforcer votre estime',
      duration: 60,
      color: 'from-yellow-400 to-orange-500',
      icon: <Sun className="h-5 w-5" />,
      effect: '+15 confiance'
    },
    {
      id: 'energy-spark',
      name: 'Étincelle d\'Énergie',
      category: 'energizing',
      description: 'Micro-exercices pour réveiller votre vitalité',
      duration: 90,
      color: 'from-red-400 to-pink-500',
      icon: <Zap className="h-5 w-5" />,
      effect: '+20 énergie'
    },
    {
      id: 'zen-moment',
      name: 'Moment Zen',
      category: 'calming',
      description: 'Respiration et détente instantanée',
      duration: 120,
      color: 'from-green-400 to-teal-500',
      icon: <Heart className="h-5 w-5" />,
      effect: '+10 sérénité'
    },
    {
      id: 'gratitude-flash',
      name: 'Flash Gratitude',
      category: 'uplifting',
      description: 'Exercice rapide de reconnaissance',
      duration: 45,
      color: 'from-purple-400 to-indigo-500',
      icon: <Star className="h-5 w-5" />,
      effect: '+12 positivité'
    }
  ];

  const defaultGlows = glows;
  const availableGlows = getGlowsByMood();

  const [isGlowing, setIsGlowing] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGlowing && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            completeGlow();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isGlowing, timer]);

  const startGlow = (glow: any) => {
    setActiveGlow(glow);
    setTimer(glow.duration);
    setIsGlowing(true);
  };

  const completeGlow = () => {
    setIsGlowing(false);
    setDailyGlows(prev => prev + 1);
    
    // Améliorer l'humeur
    if (mood && activeGlow) {
      const boost = activeGlow.category === 'uplifting' ? 15 : 
                   activeGlow.category === 'energizing' ? 10 : 8;
      
      updateMood({
        valence: Math.min(100, mood.valence + boost),
        arousal: activeGlow.category === 'energizing' ? 
                Math.min(100, mood.arousal + 10) : mood.arousal,
        timestamp: Date.now()
      });
    }
    
    setTimeout(() => {
      setActiveGlow(null);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Instant Glow
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Boosts instantanés de bien-être pour illuminer votre journée
          </p>
        </div>

        {/* Stats personnelles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <span className="text-3xl font-bold text-yellow-600">{dailyGlows}</span>
              </div>
              <div className="text-sm text-gray-600">Glows aujourd'hui</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coffee className="h-6 w-6 text-orange-500" />
                <span className="text-3xl font-bold text-orange-600">{glowStreak}</span>
              </div>
              <div className="text-sm text-gray-600">Jours consécutifs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">87%</div>
              <div className="text-sm text-gray-600">Niveau de Glow</div>
            </CardContent>
          </Card>
        </div>

        {/* Glow actif */}
        {activeGlow && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${activeGlow.color} text-white`}>
              <CardTitle className="flex items-center gap-2">
                {activeGlow.icon}
                {activeGlow.name}
                {!isGlowing && (
                  <Badge variant="secondary" className="bg-white/20 text-white ml-auto">
                    ✨ Terminé !
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {isGlowing ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-yellow-200 to-orange-200 flex items-center justify-center animate-pulse">
                      <Sparkles className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-yellow-600">
                      {formatTime(timer)}
                    </div>
                    <div className="text-lg text-gray-600">
                      Profitez de ce moment de bien-être...
                    </div>
                  </div>
                  
                  <Button
                    onClick={completeGlow}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    Terminer maintenant
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-6xl">✨</div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-yellow-600">
                      Glow terminé !
                    </h3>
                    <p className="text-gray-600">
                      {activeGlow.effect} • Vous rayonnez !
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Grille des glows */}
        <div className="grid md:grid-cols-2 gap-6">
          {availableGlows.map((glow) => (
            <Card 
              key={glow.id}
              className="group hover:scale-105 transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${glow.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {glow.icon}
                    <CardTitle className="text-lg">{glow.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {Math.floor(glow.duration / 60)}:{(glow.duration % 60).toString().padStart(2, '0')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{glow.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-gray-50">
                    {glow.effect}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${glow.category === 'uplifting' ? 'bg-yellow-50 text-yellow-600' : ''}
                      ${glow.category === 'energizing' ? 'bg-red-50 text-red-600' : ''}
                      ${glow.category === 'calming' ? 'bg-green-50 text-green-600' : ''}
                    `}
                  >
                    {glow.category === 'uplifting' ? 'Réconfortant' : ''}
                    {glow.category === 'energizing' ? 'Énergisant' : ''}
                    {glow.category === 'calming' ? 'Apaisant' : ''}
                  </Badge>
                </div>
                
                <Button
                  onClick={() => startGlow(glow)}
                  disabled={activeGlow?.id === glow.id}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {activeGlow?.id === glow.id ? 'En cours...' : 'Démarrer le Glow'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {mood && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="bg-white/50">
              Glows personnalisés selon votre humeur
            </Badge>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Préparation de votre glow...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantGlowPage;
