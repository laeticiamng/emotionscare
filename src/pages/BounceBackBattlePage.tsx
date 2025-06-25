
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/hooks/useMood';
import { Shield, Swords, Heart, TrendingUp, Award } from 'lucide-react';

const BounceBackBattlePage: React.FC = () => {
  const { mood, updateMood, isLoading } = useMood();
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  const [resilenceScore, setResilienceScore] = useState(75);
  const [battleHistory, setBattleHistory] = useState([
    { name: 'Défi Matinal', result: 'victory', points: 50 },
    { name: 'Stress Management', result: 'victory', points: 75 },
    { name: 'Motivation Boost', result: 'partial', points: 25 }
  ]);

  // Batailles adaptées selon l'humeur
  const getBattlesByMood = () => {
    if (!mood) return defaultBattles;
    
    const { valence } = mood;
    
    if (valence < 30) {
      return battles.filter(b => b.type === 'recovery');
    } else if (valence > 70) {
      return battles.filter(b => b.type === 'growth');
    } else {
      return battles.filter(b => b.type === 'balanced');
    }
  };

  const battles = [
    {
      id: 'morning-resilience',
      name: 'Résilience Matinale',
      description: 'Commencez la journée avec confiance malgré les défis',
      type: 'recovery',
      difficulty: 2,
      duration: 10,
      reward: 100,
      color: 'from-green-400 to-emerald-500',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 'stress-warrior',
      name: 'Guerrier Anti-Stress',
      description: 'Transformez le stress en force motrice',
      type: 'balanced',
      difficulty: 3,
      duration: 15,
      reward: 150,
      color: 'from-blue-400 to-indigo-500',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'peak-performance',
      name: 'Performance Optimale',
      description: 'Dépassez vos limites et atteignez l\'excellence',
      type: 'growth',
      difficulty: 4,
      duration: 25,
      reward: 250,
      color: 'from-purple-400 to-pink-500',
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  const defaultBattles = battles;
  const availableBattles = getBattlesByMood();

  const [battleProgress, setBattleProgress] = useState(0);
  const [battlePhase, setBattlePhase] = useState<'preparation' | 'battle' | 'victory'>('preparation');

  const startBattle = (battle: any) => {
    setCurrentBattle(battle);
    setBattlePhase('battle');
    setBattleProgress(0);
    
    // Simulation de progression de bataille
    const interval = setInterval(() => {
      setBattleProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBattlePhase('victory');
          completeBattle(battle);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const completeBattle = (battle: any) => {
    setResilienceScore(prev => Math.min(100, prev + 5));
    setBattleHistory(prev => [
      { name: battle.name, result: 'victory', points: battle.reward },
      ...prev.slice(0, 4)
    ]);
    
    // Améliorer l'humeur après une victoire
    if (mood) {
      updateMood({
        valence: Math.min(100, mood.valence + 10),
        arousal: mood.arousal,
        timestamp: Date.now()
      });
    }

    setTimeout(() => {
      setCurrentBattle(null);
      setBattlePhase('preparation');
      setBattleProgress(0);
    }, 3000);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Swords className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bounce Back Battle
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transformez les défis en victoires et renforcez votre résilience
          </p>
        </div>

        {/* Stats de résilience */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="h-8 w-8 text-blue-500" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                  Niveau {Math.floor(resilenceScore / 10)}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score de Résilience</span>
                  <span className="font-medium">{resilenceScore}/100</span>
                </div>
                <Progress value={resilenceScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {battleHistory.filter(b => b.result === 'victory').length}
              </div>
              <div className="text-sm text-gray-600">Victoires</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {battleHistory.reduce((sum, battle) => sum + battle.points, 0)}
              </div>
              <div className="text-sm text-gray-600">Points totaux</div>
            </CardContent>
          </Card>
        </div>

        {/* Bataille en cours */}
        {currentBattle && (
          <Card className="mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${currentBattle.color} text-white`}>
              <CardTitle className="flex items-center gap-2">
                {currentBattle.icon}
                {currentBattle.name}
                {battlePhase === 'battle' && (
                  <Badge variant="secondary" className="bg-white/20 text-white ml-auto">
                    En cours...
                  </Badge>
                )}
                {battlePhase === 'victory' && (
                  <Badge variant="secondary" className="bg-white/20 text-white ml-auto">
                    🏆 Victoire !
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-gray-600">{currentBattle.description}</p>
                
                {battlePhase === 'battle' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression de la bataille</span>
                      <span>{battleProgress}%</span>
                    </div>
                    <Progress value={battleProgress} className="h-3" />
                  </div>
                )}

                {battlePhase === 'victory' && (
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-600 mb-2">
                      Bataille remportée !
                    </h3>
                    <p className="text-green-600">
                      +{currentBattle.reward} points • +5 résilience
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grille des batailles disponibles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableBattles.map((battle) => (
            <Card 
              key={battle.id}
              className="group hover:scale-105 transition-all duration-300 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${battle.color} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {battle.icon}
                    <CardTitle className="text-lg">{battle.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: battle.difficulty }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">{battle.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="outline" className="bg-gray-50">
                    {battle.duration} min
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                    +{battle.reward} pts
                  </Badge>
                </div>
                <Button
                  onClick={() => startBattle(battle)}
                  disabled={currentBattle?.id === battle.id}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  {currentBattle?.id === battle.id ? 'En bataille...' : 'Commencer la bataille'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Historique des batailles */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Historique des Batailles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {battleHistory.map((battle, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      battle.result === 'victory' ? 'bg-green-500' :
                      battle.result === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium">{battle.name}</span>
                  </div>
                  <Badge variant="outline" className="bg-white/50">
                    +{battle.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {mood && (
          <div className="mt-8 text-center">
            <Badge variant="outline" className="bg-white/50">
              Batailles adaptées à votre état émotionnel
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default BounceBackBattlePage;
