/**
 * Hook pour gérer les sessions de groupe
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GroupSessionService } from '../services/groupSessionService';
import type { GroupSession, GroupSessionFilters, GroupSessionCategory, CreateSessionInput } from '../types';
import { toast } from 'sonner';

interface UseGroupSessionsOptions {
  autoLoad?: boolean;
  filters?: GroupSessionFilters;
}

export function useGroupSessions(options: UseGroupSessionsOptions = {}) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [liveSessions, setLiveSessions] = useState<GroupSession[]>([]);
  const [mySessions, setMySessions] = useState<GroupSession[]>([]);
  const [categories, setCategories] = useState<GroupSessionCategory[]>([]);
  const [filters, setFilters] = useState<GroupSessionFilters>(options.filters || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async (customFilters?: GroupSessionFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [allSessions, live, cats] = await Promise.all([
        GroupSessionService.getSessions(customFilters || filters),
        GroupSessionService.getLiveSessions(),
        GroupSessionService.getCategories()
      ]);

      setSessions(allSessions);
      setLiveSessions(live);
      setCategories(cats);

      if (user) {
        const userSessions = await GroupSessionService.getUserSessions(user.id);
        setMySessions(userSessions);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
      setError('Erreur lors du chargement des sessions');
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    if (options.autoLoad) {
      loadSessions();
    }
  }, [options.autoLoad, loadSessions]);

  const createSession = useCallback(async (input: CreateSessionInput) => {
    if (!user) {
      toast.error('Connectez-vous pour créer une session');
      return null;
    }

    try {
      const session = await GroupSessionService.createSession(input, user.id);
      toast.success('Session créée avec succès !');
      loadSessions();
      return session;
    } catch (err) {
      console.error('Error creating session:', err);
      toast.error('Erreur lors de la création de la session');
      return null;
    }
  }, [user, loadSessions]);

  const registerForSession = useCallback(async (sessionId: string) => {
    if (!user) {
      toast.error('Connectez-vous pour vous inscrire');
      return false;
    }

    try {
      await GroupSessionService.registerForSession(sessionId, user.id);
      toast.success('Inscription confirmée ! +10 XP');
      loadSessions();
      return true;
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        toast.info('Vous êtes déjà inscrit à cette session');
      } else {
        console.error('Error registering:', err);
        toast.error('Erreur lors de l\'inscription');
      }
      return false;
    }
  }, [user, loadSessions]);

  const unregisterFromSession = useCallback(async (sessionId: string) => {
    if (!user) return false;

    try {
      await GroupSessionService.unregisterFromSession(sessionId, user.id);
      toast.success('Désinscription effectuée');
      loadSessions();
      return true;
    } catch (err) {
      console.error('Error unregistering:', err);
      toast.error('Erreur lors de la désinscription');
      return false;
    }
  }, [user, loadSessions]);

  const joinSession = useCallback(async (sessionId: string, moodBefore?: number) => {
    if (!user) {
      toast.error('Connectez-vous pour rejoindre la session');
      return false;
    }

    try {
      // Check if registered first
      const isRegistered = await GroupSessionService.isRegistered(sessionId, user.id);
      if (!isRegistered) {
        await GroupSessionService.registerForSession(sessionId, user.id);
      }
      
      await GroupSessionService.joinSession(sessionId, user.id, moodBefore);
      toast.success('Vous avez rejoint la session !');
      return true;
    } catch (err) {
      console.error('Error joining session:', err);
      toast.error('Erreur lors de la connexion à la session');
      return false;
    }
  }, [user]);

  const leaveSession = useCallback(async (
    sessionId: string, 
    moodAfter?: number, 
    feedback?: string, 
    rating?: number
  ) => {
    if (!user) return false;

    try {
      await GroupSessionService.leaveSession(sessionId, user.id, moodAfter, feedback, rating);
      toast.success('Merci pour votre participation !');
      loadSessions();
      return true;
    } catch (err) {
      console.error('Error leaving session:', err);
      return false;
    }
  }, [user, loadSessions]);

  const updateFilters = useCallback((newFilters: GroupSessionFilters) => {
    setFilters(newFilters);
    loadSessions(newFilters);
  }, [loadSessions]);

  return {
    sessions,
    liveSessions,
    mySessions,
    categories,
    filters,
    loading,
    error,
    loadSessions,
    createSession,
    registerForSession,
    unregisterFromSession,
    joinSession,
    leaveSession,
    updateFilters,
    setFilters
  };
}

export function useGroupSession(sessionId: string) {
  const { user } = useAuth();
  const [session, setSession] = useState<GroupSession | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const [sessionData, participantsData, messagesData, resourcesData] = await Promise.all([
        GroupSessionService.getSession(sessionId),
        GroupSessionService.getParticipants(sessionId),
        GroupSessionService.getMessages(sessionId),
        GroupSessionService.getResources(sessionId)
      ]);

      setSession(sessionData);
      setParticipants(participantsData);
      setMessages(messagesData);
      setResources(resourcesData);

      if (user) {
        const registered = await GroupSessionService.isRegistered(sessionId, user.id);
        setIsRegistered(registered);
      }
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId, user]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const sendMessage = useCallback(async (content: string, replyToId?: string) => {
    if (!user || !sessionId) return null;

    try {
      const message = await GroupSessionService.sendMessage(sessionId, user.id, content, replyToId);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [user, sessionId]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;
    await GroupSessionService.addReaction(messageId, user.id, emoji);
  }, [user]);

  return {
    session,
    participants,
    messages,
    resources,
    isRegistered,
    loading,
    loadSession,
    sendMessage,
    addReaction
  };
}
