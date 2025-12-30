/**
 * Hook pour la gestion des groupes de la communauté
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  icon?: string;
  member_count: number;
  is_private: boolean;
  created_by: string;
  created_at: string;
  is_member?: boolean;
}

export interface UseCommunityGroupsReturn {
  groups: CommunityGroup[];
  myGroups: CommunityGroup[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  createGroup: (data: { name: string; description: string; icon?: string; is_private?: boolean }) => Promise<void>;
}

export function useCommunityGroups(): UseCommunityGroupsReturn {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [myGroups, setMyGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      // Charger tous les groupes publics
      const { data: allGroups, error: groupsError } = await supabase
        .from('community_groups')
        .select('*')
        .order('member_count', { ascending: false });

      if (groupsError) throw groupsError;

      // Si l'utilisateur est connecté, charger ses adhésions
      let membershipIds: string[] = [];
      if (user) {
        const { data: memberships } = await supabase
          .from('community_group_members')
          .select('group_id')
          .eq('user_id', user.id)
          .eq('status', 'active');

        membershipIds = (memberships || []).map(m => m.group_id);
      }

      const groupsWithMembership = (allGroups || []).map(group => ({
        ...group,
        is_member: membershipIds.includes(group.id)
      }));

      setGroups(groupsWithMembership.filter(g => !g.is_private || g.is_member));
      setMyGroups(groupsWithMembership.filter(g => g.is_member));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroup = useCallback(async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('community_group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          status: 'active'
        });

      if (error) throw error;

      await supabase.rpc('increment_group_members', { group_id: groupId });

      toast({
        title: 'Bienvenue !',
        description: 'Vous avez rejoint le groupe.'
      });

      await loadGroups();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre le groupe.',
        variant: 'destructive'
      });
    }
  }, [loadGroups, toast]);

  const leaveGroup = useCallback(async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('community_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      await supabase.rpc('decrement_group_members', { group_id: groupId });

      toast({
        title: 'Groupe quitté',
        description: 'Vous avez quitté le groupe.'
      });

      await loadGroups();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de quitter le groupe.',
        variant: 'destructive'
      });
    }
  }, [loadGroups, toast]);

  const createGroup = useCallback(async (data: {
    name: string;
    description: string;
    icon?: string;
    is_private?: boolean;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: newGroup, error } = await supabase
        .from('community_groups')
        .insert({
          name: data.name,
          description: data.description,
          icon: data.icon || '👥',
          is_private: data.is_private || false,
          created_by: user.id,
          member_count: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join as admin
      await supabase
        .from('community_group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'admin',
          status: 'active'
        });

      toast({
        title: 'Groupe créé',
        description: `Le groupe "${data.name}" a été créé avec succès.`
      });

      await loadGroups();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le groupe.',
        variant: 'destructive'
      });
    }
  }, [loadGroups, toast]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups,
    myGroups,
    loading,
    error,
    refresh: loadGroups,
    joinGroup,
    leaveGroup,
    createGroup
  };
}
