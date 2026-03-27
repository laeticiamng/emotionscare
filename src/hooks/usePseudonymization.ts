// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type PseudonymizationAlgorithm = 'aes256' | 'hmac' | 'tokenization' | 'format_preserving';
export type PseudonymizationOperation = 'pseudonymize' | 'depseudonymize' | 'rotate_key' | 'test';

export interface PseudonymizationRule {
  id: string;
  data_type: string;
  field_name: string;
  algorithm: PseudonymizationAlgorithm;
  is_reversible: boolean;
  is_active: boolean;
  retention_days?: number;
  auto_apply: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PseudonymizationLog {
  id: string;
  rule_id: string;
  operation: string;
  data_type: string;
  field_name: string;
  success: boolean;
  error_message?: string;
  records_affected: number;
  performed_at: string;
}

export interface PseudonymizationStats {
  rule_id: string;
  data_type: string;
  field_name: string;
  total_pseudonymized: number;
  total_depseudonymized: number;
  total_failed: number;
  avg_processing_time: number;
}

export function usePseudonymization() {
  const [rules, setRules] = useState<PseudonymizationRule[]>([]);
  const [logs, setLogs] = useState<PseudonymizationLog[]>([]);
  const [stats, setStats] = useState<PseudonymizationStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Charger toutes les règles de pseudonymisation
   */
  const loadRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pseudonymization_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      logger.error('Failed to load pseudonymization rules', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les règles de pseudonymisation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Créer une nouvelle règle de pseudonymisation
   */
  const createRule = useCallback(async (rule: Omit<PseudonymizationRule, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      // Créer la règle
      const { data: ruleData, error: ruleError } = await supabase
        .from('pseudonymization_rules')
        .insert({
          ...rule,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (ruleError) throw ruleError;

      // Générer et stocker une clé de chiffrement
      const { error: functionError } = await supabase.functions.invoke('pseudonymize-data', {
        body: {
          operation: 'rotate_key',
          ruleId: ruleData.id
        }
      });

      if (functionError) {
        // Rollback de la règle si la clé n'a pas pu être créée
        await supabase.from('pseudonymization_rules').delete().eq('id', ruleData.id);
        throw functionError;
      }

      toast({
        title: 'Règle créée',
        description: 'La règle de pseudonymisation a été créée avec succès',
      });

      await loadRules();
      return ruleData;
    } catch (error) {
      logger.error('Failed to create pseudonymization rule', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la règle de pseudonymisation',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadRules]);

  /**
   * Mettre à jour une règle
   */
  const updateRule = useCallback(async (ruleId: string, updates: Partial<PseudonymizationRule>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pseudonymization_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: 'Règle mise à jour',
        description: 'La règle a été modifiée avec succès',
      });

      await loadRules();
    } catch (error) {
      logger.error('Failed to update pseudonymization rule', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la règle',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadRules]);

  /**
   * Supprimer une règle
   */
  const deleteRule = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pseudonymization_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: 'Règle supprimée',
        description: 'La règle a été supprimée avec succès',
      });

      await loadRules();
    } catch (error) {
      logger.error('Failed to delete pseudonymization rule', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la règle',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadRules]);

  /**
   * Pseudonymiser des données
   */
  const pseudonymize = useCallback(async (
    ruleId: string,
    value: string | string[]
  ): Promise<any> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pseudonymize-data', {
        body: {
          operation: 'pseudonymize',
          ruleId,
          ...(Array.isArray(value) ? { values: value } : { value })
        }
      });

      if (error) throw error;

      toast({
        title: 'Pseudonymisation réussie',
        description: `${Array.isArray(value) ? value.length : 1} valeur(s) pseudonymisée(s)`,
      });

      return data;
    } catch (error) {
      logger.error('Failed to pseudonymize data', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de pseudonymiser les données',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Dépseudonymiser des données
   */
  const depseudonymize = useCallback(async (
    ruleId: string,
    value: string | string[]
  ): Promise<any> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pseudonymize-data', {
        body: {
          operation: 'depseudonymize',
          ruleId,
          ...(Array.isArray(value) ? { values: value } : { value })
        }
      });

      if (error) throw error;

      toast({
        title: 'Dépseudonymisation réussie',
        description: `${Array.isArray(value) ? value.length : 1} valeur(s) récupérée(s)`,
      });

      return data;
    } catch (error) {
      logger.error('Failed to depseudonymize data', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de dépseudonymiser les données',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Rotation de clé
   */
  const rotateKey = useCallback(async (ruleId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('pseudonymize-data', {
        body: {
          operation: 'rotate_key',
          ruleId
        }
      });

      if (error) throw error;

      toast({
        title: 'Clé rotée',
        description: 'La clé de chiffrement a été renouvelée',
      });

      await loadRules();
    } catch (error) {
      logger.error('Failed to rotate key', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de renouveler la clé',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadRules]);

  /**
   * Tester une règle
   */
  const testRule = useCallback(async (ruleId: string, testValue?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pseudonymize-data', {
        body: {
          operation: 'test',
          ruleId,
          value: testValue
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Failed to test rule', error as Error, 'SYSTEM');
      toast({
        title: 'Erreur',
        description: 'Impossible de tester la règle',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charger les logs
   */
  const loadLogs = useCallback(async (limit = 100) => {
    try {
      const { data, error } = await supabase
        .from('pseudonymization_log')
        .select('*')
        .order('performed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      logger.error('Failed to load pseudonymization logs', error as Error, 'SYSTEM');
    }
  }, []);

  /**
   * Charger les statistiques
   */
  const loadStats = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_pseudonymization_statistics');
      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      logger.error('Failed to load pseudonymization stats', error as Error, 'SYSTEM');
    }
  }, []);

  // Charger les données initiales
  useEffect(() => {
    loadRules();
    loadLogs();
    loadStats();
  }, [loadRules, loadLogs, loadStats]);

  // Écouter les changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('pseudonymization-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pseudonymization_rules'
        },
        () => {
          loadRules();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pseudonymization_log'
        },
        () => {
          loadLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRules, loadLogs]);

  return {
    rules,
    logs,
    stats,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
    pseudonymize,
    depseudonymize,
    rotateKey,
    testRule,
    loadRules,
    loadLogs,
    loadStats,
  };
}
