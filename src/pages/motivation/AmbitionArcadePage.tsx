import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Gamepad2, Trophy, Zap } from 'lucide-react';
import { useAmbitionArcade } from '@/hooks/useAmbitionArcade';
import GameBoard from '@/components/ambition-arcade/GameBoard';
import ObjectiveCreator from '@/components/ambition-arcade/ObjectiveCreator';

const AmbitionArcadePage: React.FC = () => {
  const {
    currentRun,
    isLoading,
    createObjective,
    completeQuest,
    generateNewQuests
  } = useAmbitionArcade();
  
  const [showCreator, setShowCreator] = useState(!currentRun);

  const handleCreateObjective = async (objective: string, timeframe: string, difficulty: string, tags: string[]) => {
    await createObjective(objective, timeframe, difficulty, tags);
    setShowCreator(false);
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ambition Arcade</h1>
              <p className="text-muted-foreground">
                Clicker-RPG où vous fixez des objectifs et gagnez des upgrades d'ambition
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Gamepad2 className="h-3 w-3 mr-1" />
                Mode Jeu
              </Badge>
              {currentRun && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCreator(true)}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Nouvel objectif
                </Button>
              )}
            </div>
          </div>

          {showCreator ? (
            <div className="space-y-6">
              <ObjectiveCreator
                onCreateObjective={handleCreateObjective}
                isLoading={isLoading}
              />
              {currentRun && (
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreator(false)}
                  >
                    Retour au tableau de bord
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <GameBoard
              currentRun={currentRun}
              onGenerateQuests={generateNewQuests}
              onCompleteQuest={completeQuest}
              isLoading={isLoading}
            />
          )}

          {/* Statistiques globales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Statistiques d'Ambition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">
                    {currentRun ? '1' : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Objectifs actifs</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">
                    {currentRun?.quests?.filter(q => q.status === 'completed').length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Quêtes terminées</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {currentRun?.metadata?.totalXp || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">XP d'Ambition</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-2xl font-bold">
                    {currentRun?.artifacts?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Artefacts obtenus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default AmbitionArcadePage;
