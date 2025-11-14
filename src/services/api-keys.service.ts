/**
 * Service de gestion des clés API
 * Phase 3 - Excellence
 */

import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export interface APIKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  key_prefix: string; // Premiers caractères pour identification
  scopes: string[];
  rate_limit: {
    requests_per_day: number;
    requests_per_hour: number;
  };
  is_active: boolean;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface APIKeyUsage {
  api_key_id: string;
  date: string;
  requests_count: number;
  errors_count: number;
  avg_response_time_ms: number;
}

/**
 * Générer une nouvelle clé API
 */
export async function generateAPIKey(
  userId: string,
  options: {
    name: string;
    scopes?: string[];
    expiresInDays?: number;
  }
): Promise<APIKey> {
  // Générer une clé sécurisée
  const key = `ec_${nanoid(32)}`;
  const keyPrefix = key.substring(0, 10);

  const expiresAt = options.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name: options.name,
      key,
      key_prefix: keyPrefix,
      scopes: options.scopes || ['read', 'write'],
      rate_limit: {
        requests_per_day: 1000,
        requests_per_hour: 100,
      },
      is_active: true,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to generate API key: ${error.message}`);
  return data;
}

/**
 * Récupérer toutes les clés API d'un utilisateur
 */
export async function getUserAPIKeys(userId: string): Promise<APIKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch API keys: ${error.message}`);

  // Masquer les clés complètes, ne montrer que le préfixe
  return (data || []).map((key) => ({
    ...key,
    key: `${key.key_prefix}...`,
  }));
}

/**
 * Révoquer une clé API
 */
export async function revokeAPIKey(keyId: string): Promise<void> {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId);

  if (error) throw new Error(`Failed to revoke API key: ${error.message}`);
}

/**
 * Supprimer une clé API
 */
export async function deleteAPIKey(keyId: string): Promise<void> {
  const { error } = await supabase.from('api_keys').delete().eq('id', keyId);

  if (error) throw new Error(`Failed to delete API key: ${error.message}`);
}

/**
 * Mettre à jour les scopes d'une clé
 */
export async function updateAPIKeyScopes(keyId: string, scopes: string[]): Promise<APIKey> {
  const { data, error } = await supabase
    .from('api_keys')
    .update({ scopes })
    .eq('id', keyId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update API key scopes: ${error.message}`);
  return data;
}

/**
 * Récupérer les statistiques d'utilisation
 */
export async function getAPIKeyUsage(
  keyId: string,
  startDate?: Date,
  endDate?: Date
): Promise<APIKeyUsage[]> {
  let query = supabase
    .from('api_key_usage')
    .select('*')
    .eq('api_key_id', keyId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate.toISOString().split('T')[0]);
  }

  if (endDate) {
    query = query.lte('date', endDate.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch API key usage: ${error.message}`);
  return data || [];
}

/**
 * Valider une clé API
 */
export async function validateAPIKey(key: string): Promise<{
  valid: boolean;
  apiKey?: APIKey;
  error?: string;
}> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .single();

  if (error) {
    return { valid: false, error: 'Invalid API key' };
  }

  // Vérifier l'expiration
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'API key expired' };
  }

  // Mettre à jour last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return { valid: true, apiKey: data };
}

/**
 * Vérifier le rate limit
 */
export async function checkRateLimit(
  apiKeyId: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { data, error } = await supabase.rpc('check_api_rate_limit', {
    p_api_key_id: apiKeyId,
  });

  if (error) {
    console.error('Failed to check rate limit:', error);
    return { allowed: true, remaining: 1000, resetAt: new Date() };
  }

  return data;
}
