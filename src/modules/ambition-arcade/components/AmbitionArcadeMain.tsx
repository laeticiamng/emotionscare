import React, { useState, useEffect } from 'react';
import { useAmbitionMachine } from '../useAmbitionMachine';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Target, Zap } from 'lucide-react';

interface AmbitionArcadeMainProps {
  className?: string;
}

/**
 * Composant principal du module Ambition Arcade
 * Système de gamification d'objectifs avec IA
 */
export const AmbitionArcadeMain: React.FC<AmbitionArcadeMainProps> = ({ className = '' }) => {
  const machine = useAmbitionMachine();
  const [objective, setObjective] = useState('');
  const [questTitle, setQuestTitle] = useState('');

  useEffect(() => {
    // Charger le dernier run actif au montage
    const loadActiveRun = async () => {
      try {
        const runs = await import('../ambitionArcadeService').then((m) => m.fetchActiveRuns());
        if (runs.length > 0) {
          await machine.loadRun(runs[0].id);
        }
      } catch (err) {
        logger.error('Erreur chargement run actif', err as Error, 'SYSTEM');
      }
    };

    loadActiveRun();
  }, []);

  const handleCreateRun = async () => {
    if (!objective.trim()) return;
    await machine.createRun({ objective: objective.trim() });
    setObjective('');
  };

  const handleGenerateGame = async () => {
    if (!objective.trim()) return;
    await machine.generateGame({
      goal: objective.trim(),
      timeframe: '30',
      difficulty: 'medium',
    });
  };

  const handleAddQuest = async () => {
    if (!questTitle.trim()) return;
    await machine.createQuest(questTitle.trim());
    setQuestTitle('');
  };

  const totalXP = machine.quests
    .filter((q) => q.status === 'completed')
    .reduce((sum, q) => sum + q.xp_reward, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Ambition Arcade
          </CardTitle>
          <CardDescription>Gamification d'objectifs par IA</CardDescription>
        </CardHeader>
        <CardContent>
          {!machine.currentRun ? (
            <div className="space-y-4">
              <Input
                placeholder="Décrivez votre objectif principal..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                disabled={machine.state === 'creating'}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateRun}
                  disabled={machine.state === 'creating' || !objective.trim()}
                  className="flex-1"
                >
                  {machine.state === 'creating' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer Run
                </Button>
                <Button
                  onClick={handleGenerateGame}
                  disabled={machine.state === 'generating' || !objective.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  {machine.state === 'generating' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Zap className="mr-2 h-4 w-4" />
                  Générer avec IA
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="quests">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quests">Quêtes</TabsTrigger>
                <TabsTrigger value="artifacts">Artefacts</TabsTrigger>
              </TabsList>

              <TabsContent value="quests" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{machine.currentRun.objective}</p>
                    <p className="text-lg font-semibold text-primary">{totalXP} XP</p>
                  </div>
                  <Badge variant="outline">
                    {machine.quests.filter((q) => q.status === 'completed').length}/
                    {machine.quests.length}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Nouvelle quête..."
                    value={questTitle}
                    onChange={(e) => setQuestTitle(e.target.value)}
                  />
                  <Button onClick={handleAddQuest} size="icon" disabled={!questTitle.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {machine.quests.map((quest) => (
                    <Card key={quest.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p
                            className={
                              quest.status === 'completed'
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground'
                            }
                          >
                            {quest.title}
                          </p>
                          {quest.flavor && (
                            <p className="text-xs text-muted-foreground">{quest.flavor}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {quest.xp_reward} XP · ~{quest.est_minutes}min
                          </p>
                        </div>
                        {quest.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => machine.completeQuest(quest.id, {})}
                            disabled={machine.state === 'completing'}
                          >
                            Compléter
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {machine.quests.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Aucune quête pour le moment</p>
                )}
              </TabsContent>

              <TabsContent value="artifacts" className="space-y-2">
                {machine.artifacts.map((artifact) => (
                  <Card key={artifact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{artifact.icon || '🏆'}</div>
                        <div>
                          <p className="font-semibold">{artifact.name}</p>
                          <p className="text-sm text-muted-foreground">{artifact.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            {artifact.rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {machine.artifacts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun artefact débloqué
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbitionArcadeMain;
