// @ts-nocheck
/**
 * Hook pour gérer les codes d'accès institutionnels
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AccessCode {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  usageCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  createdAt: string;
}

interface CreateCodeParams {
  name: string;
  maxUses?: number;
  expiresAt?: string;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function useAccessCodes(orgId: string) {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCodes = useCallback(async () => {
    if (!orgId) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('org_access_codes')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setCodes(
        (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          isActive: item.is_active,
          usageCount: item.usage_count ?? 0,
          maxUses: item.max_uses,
          expiresAt: item.expires_at,
          createdAt: item.created_at,
        }))
      );
    } catch (err) {
      console.error('Error fetching access codes:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const createCode = useCallback(
    async (params: CreateCodeParams) => {
      const code = generateCode();

      const { data, error: createError } = await supabase
        .from('org_access_codes')
        .insert({
          org_id: orgId,
          name: params.name,
          code,
          code_type: 'link',
          max_uses: params.maxUses || null,
          expires_at: params.expiresAt || null,
          is_active: true,
        })
        .select()
        .single();

      if (createError) throw createError;

      await fetchCodes();
      return data;
    },
    [orgId, fetchCodes]
  );

  const revokeCode = useCallback(
    async (codeId: string) => {
      const { error: updateError } = await supabase
        .from('org_access_codes')
        .update({ is_active: false })
        .eq('id', codeId);

      if (updateError) throw updateError;

      setCodes((prev) =>
        prev.map((c) => (c.id === codeId ? { ...c, isActive: false } : c))
      );
    },
    []
  );

  const regenerateCode = useCallback(
    async (codeId: string) => {
      const newCode = generateCode();

      const { error: updateError } = await supabase
        .from('org_access_codes')
        .update({ code: newCode })
        .eq('id', codeId);

      if (updateError) throw updateError;

      setCodes((prev) =>
        prev.map((c) => (c.id === codeId ? { ...c, code: newCode } : c))
      );
    },
    []
  );

  return {
    codes,
    loading,
    error,
    createCode,
    revokeCode,
    regenerateCode,
    refetch: fetchCodes,
  };
}
