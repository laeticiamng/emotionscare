// @ts-nocheck
/**
 * Hook pour gérer les buddies
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BuddyService } from '../services/buddyService';
import type { BuddyProfile, BuddyMatch, BuddyRequest, BuddyStats, BuddyFilters } from '../types';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function useBuddies() {
  const { user } = useAuth();
  const [myProfile, setMyProfile] = useState<BuddyProfile | null>(null);
  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [discoveredBuddies, setDiscoveredBuddies] = useState<BuddyProfile[]>([]);
  const [requests, setRequests] = useState<BuddyRequest[]>([]);
  const [stats, setStats] = useState<BuddyStats | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BuddyFilters>({});

  const loadData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [profile, matchesData, requestsData, statsData, unread] = await Promise.all([
        BuddyService.getMyProfile(user.id),
        BuddyService.getMatches(user.id),
        BuddyService.getReceivedRequests(user.id),
        BuddyService.getStats(user.id),
        BuddyService.getUnreadCount(user.id)
      ]);

      setMyProfile(profile);
      setMatches(matchesData);
      setRequests(requestsData);
      setStats(statsData);
      setUnreadCount(unread);
    } catch (err) {
      logger.error('Error loading buddies data:', err as Error, 'BUDDIES');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const discoverBuddies = useCallback(async (customFilters?: BuddyFilters) => {
    if (!user) return;

    try {
      const buddies = await BuddyService.discoverBuddies(user.id, customFilters || filters);
      setDiscoveredBuddies(buddies);
    } catch (err) {
      logger.error('Error discovering buddies:', err as Error, 'BUDDIES');
    }
  }, [user, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (user) {
      discoverBuddies();
    }
  }, [user, discoverBuddies]);

  const updateProfile = useCallback(async (updates: Partial<BuddyProfile>) => {
    if (!user) return null;

    try {
      const profile = await BuddyService.upsertProfile(user.id, updates);
      setMyProfile(profile);
      toast.success('Profil mis à jour !');
      return profile;
    } catch (err) {
      logger.error('Error updating profile:', err as Error, 'BUDDIES');
      toast.error('Erreur lors de la mise à jour du profil');
      return null;
    }
  }, [user]);

  const updateAvailability = useCallback(async (status: string) => {
    if (!user) return;

    try {
      await BuddyService.updateAvailability(user.id, status);
      setMyProfile(prev => prev ? { ...prev, availability_status: status as any } : null);
    } catch (err) {
      logger.error('Error updating availability:', err as Error, 'BUDDIES');
    }
  }, [user]);

  const sendBuddyRequest = useCallback(async (toUserId: string, message?: string) => {
    if (!user) {
      toast.error('Connectez-vous pour envoyer une demande');
      return false;
    }

    try {
      await BuddyService.sendRequest(user.id, toUserId, message);
      toast.success('Demande envoyée ! 🎉');
      setDiscoveredBuddies(prev => prev.filter(b => b.user_id !== toUserId));
      return true;
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        toast.info('Demande déjà envoyée');
      } else {
        toast.error('Erreur lors de l\'envoi de la demande');
      }
      return false;
    }
  }, [user]);

  const respondToRequest = useCallback(async (requestId: string, accept: boolean) => {
    if (!user) return false;

    try {
      await BuddyService.respondToRequest(requestId, accept, user.id);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      
      if (accept) {
        toast.success('Nouveau buddy ! 🎉');
        loadData(); // Reload to get new match
      } else {
        toast.info('Demande refusée');
      }
      return true;
    } catch (err) {
      logger.error('Error responding to request:', err as Error, 'BUDDIES');
      toast.error('Erreur lors de la réponse');
      return false;
    }
  }, [user, loadData]);

  return {
    myProfile,
    matches,
    discoveredBuddies,
    requests,
    stats,
    unreadCount,
    loading,
    filters,
    setFilters,
    loadData,
    discoverBuddies,
    updateProfile,
    updateAvailability,
    sendBuddyRequest,
    respondToRequest
  };
}

export function useBuddyChat(matchId: string, buddyUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    if (!matchId) return;

    setLoading(true);
    try {
      const msgs = await BuddyService.getMessages(matchId);
      setMessages(msgs);
      
      // Mark as read
      if (user) {
        await BuddyService.markMessagesAsRead(matchId, user.id);
      }
    } catch (err) {
      logger.error('Error loading messages:', err as Error, 'BUDDIES');
    } finally {
      setLoading(false);
    }
  }, [matchId, user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user || !matchId) return null;

    try {
      const message = await BuddyService.sendMessage(matchId, user.id, buddyUserId, content);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      logger.error('Error sending message:', err as Error, 'BUDDIES');
      toast.error('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [user, matchId, buddyUserId]);

  return {
    messages,
    loading,
    loadMessages,
    sendMessage
  };
}
