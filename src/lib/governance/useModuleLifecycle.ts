/**
 * Hook — observe le cycle de vie d'un module (kill-switch + rollout).
 * @module lib/governance/useModuleLifecycle
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ModuleLifecycle } from './types';

export interface ModuleLifecycleState {
  loading: boolean;
  module: ModuleLifecycle | null;
  enabled: boolean;
  killSwitch: boolean;
  rollout: number;
  error: string | null;
}

const cache = new Map<string, ModuleLifecycle | null>();

export function useModuleLifecycle(moduleKey: string): ModuleLifecycleState {
  const [state, setState] = useState<ModuleLifecycleState>(() => {
    const cached = cache.get(moduleKey);
    if (cached !== undefined) {
      return {
        loading: false,
        module: cached,
        enabled: cached ? !cached.kill_switch_enabled : true,
        killSwitch: cached?.kill_switch_enabled ?? false,
        rollout: cached?.rollout_percentage ?? 100,
        error: null,
      };
    }
    return {
      loading: true,
      module: null,
      enabled: true,
      killSwitch: false,
      rollout: 100,
      error: null,
    };
  });

  useEffect(() => {
    let mounted = true;

    const apply = (mod: ModuleLifecycle | null) => {
      cache.set(moduleKey, mod);
      if (!mounted) return;
      setState({
        loading: false,
        module: mod,
        enabled: mod ? !mod.kill_switch_enabled : true,
        killSwitch: mod?.kill_switch_enabled ?? false,
        rollout: mod?.rollout_percentage ?? 100,
        error: null,
      });
    };

    (async () => {
      const { data, error } = await supabase
        .from('module_lifecycle')
        .select('*')
        .eq('module_key', moduleKey)
        .maybeSingle();
      if (error) {
        if (mounted) setState((s) => ({ ...s, loading: false, error: error.message }));
        return;
      }
      apply((data as unknown as ModuleLifecycle) ?? null);
    })();

    // Realtime subscription
    const channel = supabase
      .channel(`module-lifecycle-${moduleKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'module_lifecycle',
          filter: `module_key=eq.${moduleKey}`,
        },
        (payload) => {
          const next = (payload.new ?? null) as ModuleLifecycle | null;
          apply(next);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [moduleKey]);

  return state;
}
