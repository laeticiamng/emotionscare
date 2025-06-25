
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Trophy, Target } from 'lucide-react';
import GritChallengeButton from '@/components/features/GritChallengeButton';
import { useGritChallenge } from '@/hooks/useGritChallenge';

const BossLevelGritPage: React.FC = () => {
  const { currentChallenge, completeChallenge } = useGritChallenge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
              <Sword className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Boss Level Grit
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Développez votre persévérance avec des défis personnalisés générés par IA
          </p>
        </div>

        {/* Action principale */}
        <div className="flex justify-center">
          <GritChallengeButton />
        </div>

        {/* Défi actuel */}
        {currentChallenge && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {currentChallenge.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{currentChallenge.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {currentChallenge.points} points
                </span>
                <span>{currentChallenge.duration}</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  {currentChallenge.difficulty}
                </span>
              </div>

              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700">
                  💪 {currentChallenge.motivationalMessage}
                </p>
              </div>

              <button
                onClick={() => {
                  const points = completeChallenge();
                  if (points > 0) {
                    // Animation de réussite
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Défi terminé ! 🎉
              </button>
            </CardContent>
          </Card>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Défis complétés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Points gagnés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Sword className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <p className="text-2xl font-bold">Débutant</p>
              <p className="text-sm text-muted-foreground">Niveau</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BossLevelGritPage;
