
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMood } from '@/hooks/useMood';
import { Trophy, Target, Flame, Shield, Star } from 'lucide-react';

const BossLevelGritPage: React.FC = () => {
  const { mood, isLoading } = useMood();
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [streakCount, setStreakCount] = useState(7);
  const [level, setLevel] = useState(12);

  // Adapter la difficulté selon l'humeur
  const getChallengesByMood = () => {
    if (!mood) return defaultChallenges;
    
    const { valence, arousal } = mood;
    
    if (valence < 40) {
      // Humeur basse -> défis plus doux
      return challenges.filter(c => c.difficulty === 'gentle');
    } else if (arousal > 70) {
      // Énergie haute -> défis intenses
      return challenges.filter(c => c.difficulty === 'intense');
    } else {
      return challenges.filter(c => c.difficulty === 'moderate');
    }
  };

  const challenges = [
    {
      id: 'micro-win',
      title: 'Micro-Victoire',
      description: 'Accomplissez une petite tâche qui vous tient à cœur',
      difficulty: 'gentle',
      points: 50,
      duration: '5 min',
      color: 'from-green-400 to-emerald-500',
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 'comfort-zone',
      title: 'Zone de Confort Challenge',
      description: 'Sortez de votre zone de confort pendant 10 minutes',
      difficulty: 'moderate',
      points: 100,
      duration: '10 min',
      color: 'from-blue-400 to-indigo-500',
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 'power-hour',
      title: 'Power Hour',
      description: 'Une heure de focus intense sur votre objectif principal',
      difficulty: 'intense',
      points: 200,
      duration: '60 min',
      color: 'from-orange-400 to-red-500',
      icon: <Flame className="h-5 w-5" />
    }
  ];

  const defaultChallenges = challenges;
  const availableChallenges = getChallengesByMood();

  const startChallenge = (challenge: any) => {
    setCurrentChallenge(challenge);
    setProgress(0);
  };

  const completeChallenge = () => {
    if (currentChallenge) {
      setStreakCount(prev => prev + 1);
      setProgress(100);
      setTimeout(() => {
        setCurrentChallenge(null);
        setProgress(0);
      }, 2000);
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Boss Level Grit
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Développez votre résilience avec des défis adaptés à votre état d'esprit
          </p>
        </div>

        {/* Stats personnelles */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">{level}</div>
              <div className="text-sm text-gray-600">Niveau Grit</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Flame className="h-6 w-6 text-red-500" />
                <span className="text-3xl font-bold text-red-500">{streakCount}</span>
              </div>
              <div className="text-sm text-gray-600">Jours consécutifs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">1,247</div>
              <div className="text-sm text-gray-600">Points totaux</div>
            </CardContent>
          </Card>
        </div>

        {/* Défi en cours */}
        {currentChallenge && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className={`bg-gradient-to-r ${currentChallenge.color} text-white`}>
              <CardTitle className="flex items-center gap-2">
                {currentChallenge.icon}
                {currentChallenge.title} en cours
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-600">{currentChallenge.description}</p>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-white/50">
                    {currentChallenge.points} points
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setProgress(prev => Math.min(100, prev + 25))}
                      variant="outline"
                      size="sm"
                    >
                      Progression +25%
                    </Button>
                    <Button
                      onClick={completeChallenge}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      Terminer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grille de défis */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableChallenges.map((challenge) => (
            <Card 
              key={challenge.id}
              className="group hover:scale-105 transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${challenge.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {challenge.icon}
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {challenge.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-gray-50">
                    +{challenge.points} points
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${challenge.difficulty === 'gentle' ? 'bg-green-50 text-green-600' : ''}
                      ${challenge.difficulty === 'moderate' ? 'bg-blue-50 text-blue-600' : ''}
                      ${challenge.difficulty === 'intense' ? 'bg-red-50 text-red-600' : ''}
                    `}
                  >
                    {challenge.difficulty === 'gentle' ? 'Doux' : ''}
                    {challenge.difficulty === 'moderate' ? 'Modéré' : ''}
                    {challenge.difficulty === 'intense' ? 'Intense' : ''}
                  </Badge>
                </div>
                <Button
                  onClick={() => startChallenge(challenge)}
                  disabled={currentChallenge?.id === challenge.id}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {currentChallenge?.id === challenge.id ? 'En cours...' : 'Relever le défi'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {mood && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="bg-white/50">
              Défis adaptés à votre humeur actuelle
            </Badge>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-2">Adaptation des défis...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BossLevelGritPage;
