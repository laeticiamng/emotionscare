
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, CheckCircle, Clock } from 'lucide-react';
import AmbitionButton from '@/components/features/AmbitionButton';
import { useAmbition } from '@/hooks/useAmbition';

const AmbitionArcadePage: React.FC = () => {
  const { goals, completeLevel } = useAmbition();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Ambition Arcade
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformez vos objectifs en quêtes gamifiées avec progression par niveaux
          </p>
        </div>

        {/* Action principale */}
        <div className="flex justify-center">
          <AmbitionButton />
        </div>

        {/* Liste des objectifs */}
        {goals.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Vos Quêtes Actives</h2>
            
            {goals.map((goal) => (
              <Card key={goal.id} className="max-w-4xl mx-auto">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {goal.title}
                      </CardTitle>
                      <p className="text-muted-foreground">{goal.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {goal.progressPercentage}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {goal.completedLevels}/{goal.levels.length} niveaux
                      </p>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Niveaux */}
                  {goal.levels.map((level, index) => (
                    <div
                      key={level.id}
                      className={`p-3 rounded-lg border transition-all ${
                        level.isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {level.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                          <div>
                            <p className={`font-medium ${level.isCompleted ? 'text-green-700' : ''}`}>
                              {level.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {level.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {level.estimatedDuration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{level.points}</span>
                          </div>
                          {!level.isCompleted && (
                            <button
                              onClick={() => completeLevel(goal.id, level.id)}
                              className="px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                            >
                              Terminer
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* État vide */}
        {goals.length === 0 && (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucune quête active</h3>
              <p className="text-muted-foreground">
                Cliquez sur "Ajouter objectif" pour commencer votre première quête !
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AmbitionArcadePage;
