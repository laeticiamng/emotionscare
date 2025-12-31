import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SocialBreakPlan } from '../types';

interface UsePastBreaksOptions {
  enabled?: boolean;
  limit?: number;
}

interface UsePastBreaksResult {
  pastBreaks: SocialBreakPlan[];
  isLoading: boolean;
  error: Error | null;
}

const mapBreakRecord = (record: any): SocialBreakPlan => ({
  id: record?.id || '',
  roomId: record?.room_id || '',
  startsAt: record?.starts_at || new Date().toISOString(),
  durationMinutes: Number.parseInt(record?.duration_minutes ?? 10, 10),
  remindAt: record?.remind_at || null,
  deliveryChannel: record?.delivery_channel === 'email' ? 'email' : 'in-app',
  invitees: Array.isArray(record?.invitees)
    ? record.invitees.map((invite: any) => ({
        id: invite?.id || '',
        type: invite?.type === 'email' ? 'email' : 'member',
        label: invite?.label || 'Invité',
      }))
    : [],
});

export const usePastBreaks = (options?: UsePastBreaksOptions): UsePastBreaksResult => {
  const limit = options?.limit ?? 10;

  const query = useQuery({
    queryKey: ['social-breaks-past', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_room_breaks')
        .select('id, room_id, starts_at, duration_minutes, remind_at, delivery_channel, invitees')
        .lt('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).map(mapBreakRecord);
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });

  return useMemo(
    () => ({
      pastBreaks: query.data ?? [],
      isLoading: query.isLoading,
      error: (query.error as Error) || null,
    }),
    [query.data, query.isLoading, query.error]
  );
};

export default usePastBreaks;
