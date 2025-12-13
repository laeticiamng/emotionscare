// @ts-nocheck
import { useContext, useCallback, useMemo, useState, useEffect } from 'react';
import SocialCoconContext from '@/contexts/SocialCoconContext';
import { supabase } from '@/integrations/supabase/client';

/** Membre du cocon social */
export interface CoconMember {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  relationship: 'family' | 'friend' | 'colleague' | 'therapist' | 'other';
  trustLevel: number;
  isEmergencyContact: boolean;
  canViewMood: boolean;
  canViewJournal: boolean;
  canSendAlerts: boolean;
  lastInteraction?: Date;
  status: 'active' | 'pending' | 'blocked';
}

/** Invitation au cocon */
export interface CoconInvitation {
  id: string;
  fromUserId: string;
  toEmail: string;
  relationship: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: Date;
  expiresAt: Date;
}

/** Alerte du cocon */
export interface CoconAlert {
  id: string;
  fromUserId: string;
  toUserId: string;
  alertType: 'sos' | 'check_in' | 'mood_drop' | 'inactivity' | 'custom';
  message?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'sent' | 'delivered' | 'read' | 'responded';
  createdAt: Date;
  respondedAt?: Date;
}

/** Activité partagée */
export interface SharedActivity {
  id: string;
  userId: string;
  activityType: string;
  description: string;
  sharedWith: string[];
  visibility: 'cocon' | 'selected' | 'public';
  createdAt: Date;
  reactions: { userId: string; emoji: string }[];
}

/** Statistiques du cocon */
export interface CoconStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvitations: number;
  alertsSent: number;
  alertsReceived: number;
  sharedActivities: number;
  averageTrustLevel: number;
}

/** Configuration du cocon */
export interface CoconConfig {
  allowMoodSharing: boolean;
  allowJournalSharing: boolean;
  autoShareAchievements: boolean;
  alertOnMoodDrop: boolean;
  alertOnInactivity: boolean;
  inactivityThresholdDays: number;
  moodDropThreshold: number;
}

export const useSocialCocon = () => {
  const context = useContext(SocialCoconContext);
  const [members, setMembers] = useState<CoconMember[]>([]);
  const [invitations, setInvitations] = useState<CoconInvitation[]>([]);
  const [alerts, setAlerts] = useState<CoconAlert[]>([]);
  const [stats, setStats] = useState<CoconStats | null>(null);
  const [config, setConfig] = useState<CoconConfig>({
    allowMoodSharing: true,
    allowJournalSharing: false,
    autoShareAchievements: true,
    alertOnMoodDrop: true,
    alertOnInactivity: true,
    inactivityThresholdDays: 3,
    moodDropThreshold: 30
  });
  const [isLoading, setIsLoading] = useState(false);

  // Charger les membres du cocon
  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data, error } = await supabase
        .from('cocon_members')
        .select('*, profiles(display_name, avatar_url)')
        .eq('owner_id', userData.user.id)
        .eq('status', 'active');

      if (!error && data) {
        setMembers(data.map(m => ({
          id: m.id,
          userId: m.member_id,
          displayName: m.profiles?.display_name || 'Membre',
          avatar: m.profiles?.avatar_url,
          relationship: m.relationship,
          trustLevel: m.trust_level || 50,
          isEmergencyContact: m.is_emergency_contact || false,
          canViewMood: m.can_view_mood || false,
          canViewJournal: m.can_view_journal || false,
          canSendAlerts: m.can_send_alerts || false,
          lastInteraction: m.last_interaction ? new Date(m.last_interaction) : undefined,
          status: m.status
        })));
      }
    } catch (error) {
      console.error('Error loading cocon members:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les invitations
  const loadInvitations = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data } = await supabase
        .from('cocon_invitations')
        .select('*')
        .or(`from_user_id.eq.${userData.user.id},to_email.eq.${userData.user.email}`)
        .eq('status', 'pending');

      if (data) {
        setInvitations(data.map(i => ({
          id: i.id,
          fromUserId: i.from_user_id,
          toEmail: i.to_email,
          relationship: i.relationship,
          message: i.message,
          status: i.status,
          createdAt: new Date(i.created_at),
          expiresAt: new Date(i.expires_at)
        })));
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  }, []);

  // Inviter un membre
  const inviteMember = useCallback(async (
    email: string,
    relationship: string,
    message?: string
  ): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from('cocon_invitations').insert({
        from_user_id: userData.user.id,
        to_email: email,
        relationship,
        message,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      });

      if (error) throw error;
      await loadInvitations();
      return true;
    } catch (error) {
      console.error('Error inviting member:', error);
      return false;
    }
  }, [loadInvitations]);

  // Accepter une invitation
  const acceptInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      const { data: invitation } = await supabase
        .from('cocon_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (!invitation) return false;

      // Créer la relation membre
      await supabase.from('cocon_members').insert({
        owner_id: invitation.from_user_id,
        member_id: userData.user.id,
        relationship: invitation.relationship,
        trust_level: 50,
        status: 'active'
      });

      // Mettre à jour l'invitation
      await supabase
        .from('cocon_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      await loadMembers();
      await loadInvitations();
      return true;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      return false;
    }
  }, [loadMembers, loadInvitations]);

  // Décliner une invitation
  const declineInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    try {
      await supabase
        .from('cocon_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      await loadInvitations();
      return true;
    } catch (error) {
      return false;
    }
  }, [loadInvitations]);

  // Supprimer un membre
  const removeMember = useCallback(async (memberId: string): Promise<boolean> => {
    try {
      await supabase
        .from('cocon_members')
        .update({ status: 'blocked' })
        .eq('id', memberId);

      await loadMembers();
      return true;
    } catch (error) {
      return false;
    }
  }, [loadMembers]);

  // Mettre à jour les permissions d'un membre
  const updateMemberPermissions = useCallback(async (
    memberId: string,
    permissions: Partial<Pick<CoconMember, 'canViewMood' | 'canViewJournal' | 'canSendAlerts' | 'trustLevel' | 'isEmergencyContact'>>
  ): Promise<boolean> => {
    try {
      const updateData: Record<string, any> = {};
      if (permissions.canViewMood !== undefined) updateData.can_view_mood = permissions.canViewMood;
      if (permissions.canViewJournal !== undefined) updateData.can_view_journal = permissions.canViewJournal;
      if (permissions.canSendAlerts !== undefined) updateData.can_send_alerts = permissions.canSendAlerts;
      if (permissions.trustLevel !== undefined) updateData.trust_level = permissions.trustLevel;
      if (permissions.isEmergencyContact !== undefined) updateData.is_emergency_contact = permissions.isEmergencyContact;

      await supabase
        .from('cocon_members')
        .update(updateData)
        .eq('id', memberId);

      await loadMembers();
      return true;
    } catch (error) {
      return false;
    }
  }, [loadMembers]);

  // Envoyer une alerte
  const sendAlert = useCallback(async (
    toUserId: string,
    alertType: CoconAlert['alertType'],
    message?: string,
    priority: CoconAlert['priority'] = 'medium'
  ): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      const { error } = await supabase.from('cocon_alerts').insert({
        from_user_id: userData.user.id,
        to_user_id: toUserId,
        alert_type: alertType,
        message,
        priority,
        status: 'sent'
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error sending alert:', error);
      return false;
    }
  }, []);

  // Envoyer SOS à tous les contacts d'urgence
  const sendSOS = useCallback(async (message?: string): Promise<number> => {
    const emergencyContacts = members.filter(m => m.isEmergencyContact);
    let sent = 0;

    for (const contact of emergencyContacts) {
      const success = await sendAlert(contact.userId, 'sos', message, 'urgent');
      if (success) sent++;
    }

    return sent;
  }, [members, sendAlert]);

  // Charger les alertes reçues
  const loadAlerts = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data } = await supabase
        .from('cocon_alerts')
        .select('*')
        .eq('to_user_id', userData.user.id)
        .in('status', ['sent', 'delivered'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setAlerts(data.map(a => ({
          id: a.id,
          fromUserId: a.from_user_id,
          toUserId: a.to_user_id,
          alertType: a.alert_type,
          message: a.message,
          priority: a.priority,
          status: a.status,
          createdAt: new Date(a.created_at),
          respondedAt: a.responded_at ? new Date(a.responded_at) : undefined
        })));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }, []);

  // Répondre à une alerte
  const respondToAlert = useCallback(async (alertId: string, response: string): Promise<boolean> => {
    try {
      await supabase
        .from('cocon_alerts')
        .update({
          status: 'responded',
          responded_at: new Date().toISOString(),
          response
        })
        .eq('id', alertId);

      await loadAlerts();
      return true;
    } catch (error) {
      return false;
    }
  }, [loadAlerts]);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const activeMembers = members.filter(m => m.status === 'active');
      const avgTrust = activeMembers.length > 0
        ? activeMembers.reduce((sum, m) => sum + m.trustLevel, 0) / activeMembers.length
        : 0;

      setStats({
        totalMembers: members.length,
        activeMembers: activeMembers.length,
        pendingInvitations: invitations.filter(i => i.status === 'pending').length,
        alertsSent: 0,
        alertsReceived: alerts.length,
        sharedActivities: 0,
        averageTrustLevel: Math.round(avgTrust)
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [members, invitations, alerts]);

  // Partager une activité
  const shareActivity = useCallback(async (
    activityType: string,
    description: string,
    visibility: SharedActivity['visibility'] = 'cocon'
  ): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      const sharedWith = visibility === 'cocon'
        ? members.map(m => m.userId)
        : [];

      await supabase.from('cocon_shared_activities').insert({
        user_id: userData.user.id,
        activity_type: activityType,
        description,
        shared_with: sharedWith,
        visibility
      });

      return true;
    } catch (error) {
      return false;
    }
  }, [members]);

  // Sauvegarder la configuration
  const saveConfig = useCallback(async (newConfig: Partial<CoconConfig>): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      const updated = { ...config, ...newConfig };
      setConfig(updated);

      await supabase.from('cocon_config').upsert({
        user_id: userData.user.id,
        config: updated
      });

      return true;
    } catch (error) {
      return false;
    }
  }, [config]);

  // Contacts d'urgence
  const emergencyContacts = useMemo(() =>
    members.filter(m => m.isEmergencyContact),
    [members]
  );

  // Membres par relation
  const membersByRelationship = useMemo(() => {
    const grouped: Record<string, CoconMember[]> = {};
    for (const member of members) {
      if (!grouped[member.relationship]) {
        grouped[member.relationship] = [];
      }
      grouped[member.relationship].push(member);
    }
    return grouped;
  }, [members]);

  // Charger les données au montage
  useEffect(() => {
    loadMembers();
    loadInvitations();
    loadAlerts();
  }, [loadMembers, loadInvitations, loadAlerts]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    // Context original
    ...context,

    // État
    members,
    invitations,
    alerts,
    stats,
    config,
    isLoading,
    emergencyContacts,
    membersByRelationship,

    // Actions membres
    loadMembers,
    inviteMember,
    acceptInvitation,
    declineInvitation,
    removeMember,
    updateMemberPermissions,

    // Actions alertes
    sendAlert,
    sendSOS,
    loadAlerts,
    respondToAlert,

    // Partage
    shareActivity,

    // Configuration
    saveConfig,

    // Rechargement
    refresh: useCallback(async () => {
      await Promise.all([loadMembers(), loadInvitations(), loadAlerts()]);
    }, [loadMembers, loadInvitations, loadAlerts])
  };
};

export default useSocialCocon;
