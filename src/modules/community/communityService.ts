/**
 * Service pour la communauté et les interactions sociales
 */

import { supabase } from '@/integrations/supabase/client';

export interface AuraConnection {
  id: string;
  user_id_a: string;
  user_id_b: string;
  connection_strength: number;
  interaction_types?: any[];
  last_interaction_at: string;
  created_at: string;
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_user_id: string;
  date: string;
}

export class CommunityService {
  /**
   * Récupérer les connexions aura d'un utilisateur
   */
  static async fetchConnections(userId: string): Promise<AuraConnection[]> {
    const { data, error } = await supabase
      .from('aura_connections')
      .select('*')
      .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`)
      .order('connection_strength', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer ou mettre à jour une connexion
   */
  static async updateConnection(
    userIdA: string,
    userIdB: string,
    interactionType: string
  ): Promise<void> {
    const { data: existing } = await supabase
      .from('aura_connections')
      .select('*')
      .or(`and(user_id_a.eq.${userIdA},user_id_b.eq.${userIdB}),and(user_id_a.eq.${userIdB},user_id_b.eq.${userIdA})`)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('aura_connections')
        .update({
          connection_strength: existing.connection_strength + 1,
          last_interaction_at: new Date().toISOString(),
          interaction_types: [...(existing.interaction_types || []), interactionType]
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('aura_connections')
        .insert({
          user_id_a: userIdA,
          user_id_b: userIdB,
          connection_strength: 1,
          interaction_types: [interactionType]
        });

      if (error) throw error;
    }
  }

  /**
   * Trouver un buddy
   */
  static async findBuddy(userId: string): Promise<string | null> {
    // Logique de matching simple - à améliorer selon les besoins
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .neq('user_id', userId)
      .limit(1)
      .single();

    if (error || !data) return null;

    // Créer le lien buddy
    await supabase
      .from('buddies')
      .insert({
        user_id: userId,
        buddy_user_id: data.user_id
      });

    return data.user_id;
  }

  /**
   * Récupérer les buddies
   */
  static async fetchBuddies(userId: string): Promise<Buddy[]> {
    const { data, error } = await supabase
      .from('buddies')
      .select('*')
      .or(`user_id.eq.${userId},buddy_user_id.eq.${userId}`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer le leaderboard
   */
  static async fetchLeaderboard(orgId?: string, limit: number = 50): Promise<any[]> {
    let query = supabase
      .from('gamification_metrics')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (orgId) {
      query = query.eq('org_id', orgId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }
}
