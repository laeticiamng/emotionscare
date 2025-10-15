import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as ambitionService from './ambitionArcadeService';
import type {
  AmbitionRun,
  AmbitionQuest,
  AmbitionArtifact,
  CreateRun,
  CompleteQuest,
  GenerateGameStructure,
  GameStructure,
} from './types';

type MachineState = 'idle' | 'creating' | 'active' | 'generating' | 'completing' | 'error';

/**
 * Hook pour gérer la state machine Ambition Arcade
 */
export function useAmbitionMachine() {
  const { toast } = useToast();
  const [state, setState] = useState<MachineState>('idle');
  const [currentRun, setCurrentRun] = useState<AmbitionRun | null>(null);
  const [quests, setQuests] = useState<AmbitionQuest[]>([]);
  const [artifacts, setArtifacts] = useState<AmbitionArtifact[]>([]);
  const [error, setError] = useState<string | null>(null);

  /**
   * Créer un nouveau run
   */
  const createRun = useCallback(async (data: CreateRun) => {
    setState('creating');
    setError(null);

    try {
      const run = await ambitionService.createRun(data);
      setCurrentRun(run);
      setState('active');

      toast({
        title: '🎮 Run créé',
        description: 'Votre nouveau parcours gamifié est lancé !',
      });

      return run;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur création run';
      setError(message);
      setState('error');
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      throw err;
    }
  }, [toast]);

  /**
   * Générer une structure de jeu via IA
   */
  const generateGame = useCallback(async (params: GenerateGameStructure): Promise<GameStructure> => {
    setState('generating');
    setError(null);

    try {
      const structure = await ambitionService.generateGameStructure(params);

      toast({
        title: '✨ Structure générée',
        description: `${structure.levels.length} niveaux créés par l'IA`,
      });

      return structure;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur génération IA';
      setError(message);
      setState('error');
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setState('active');
    }
  }, [toast]);

  /**
   * Créer une quête
   */
  const createQuest = useCallback(
    async (title: string, flavor?: string, xpReward?: number, estMinutes?: number) => {
      if (!currentRun) {
        toast({
          title: 'Erreur',
          description: 'Aucun run actif',
          variant: 'destructive',
        });
        return;
      }

      try {
        const quest = await ambitionService.createQuest(
          currentRun.id,
          title,
          flavor,
          xpReward,
          estMinutes
        );
        setQuests((prev) => [...prev, quest]);

        toast({
          title: '🎯 Quête ajoutée',
          description: title,
        });

        return quest;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur création quête';
        toast({
          title: 'Erreur',
          description: message,
          variant: 'destructive',
        });
        throw err;
      }
    },
    [currentRun, toast]
  );

  /**
   * Compléter une quête
   */
  const completeQuest = useCallback(
    async (questId: string, data: CompleteQuest) => {
      setState('completing');
      setError(null);

      try {
        await ambitionService.completeQuest(questId, data);

        setQuests((prev) =>
          prev.map((q) =>
            q.id === questId
              ? {
                  ...q,
                  status: 'completed' as const,
                  result: data.result,
                  notes: data.notes,
                  completed_at: new Date().toISOString(),
                }
              : q
          )
        );

        const quest = quests.find((q) => q.id === questId);
        toast({
          title: '✅ Quête complétée',
          description: `+${quest?.xp_reward || 0} XP`,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur complétion quête';
        setError(message);
        toast({
          title: 'Erreur',
          description: message,
          variant: 'destructive',
        });
        throw err;
      } finally {
        setState('active');
      }
    },
    [quests, toast]
  );

  /**
   * Charger les quêtes d'un run
   */
  const loadQuests = useCallback(
    async (runId: string) => {
      try {
        const data = await ambitionService.fetchQuests(runId);
        setQuests(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur chargement quêtes';
        toast({
          title: 'Erreur',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  /**
   * Charger les artefacts d'un run
   */
  const loadArtifacts = useCallback(
    async (runId: string) => {
      try {
        const data = await ambitionService.fetchArtifacts(runId);
        setArtifacts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur chargement artefacts';
        toast({
          title: 'Erreur',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [toast]
  );

  /**
   * Charger un run existant
   */
  const loadRun = useCallback(
    async (runId: string) => {
      try {
        const runs = await ambitionService.fetchActiveRuns();
        const run = runs.find((r) => r.id === runId);

        if (run) {
          setCurrentRun(run);
          setState('active');
          await Promise.all([loadQuests(runId), loadArtifacts(runId)]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur chargement run';
        setError(message);
        setState('error');
        toast({
          title: 'Erreur',
          description: message,
          variant: 'destructive',
        });
      }
    },
    [loadQuests, loadArtifacts, toast]
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState('idle');
    setCurrentRun(null);
    setQuests([]);
    setArtifacts([]);
    setError(null);
  }, []);

  return {
    state,
    currentRun,
    quests,
    artifacts,
    error,
    createRun,
    generateGame,
    createQuest,
    completeQuest,
    loadRun,
    loadQuests,
    loadArtifacts,
    reset,
  };
}
