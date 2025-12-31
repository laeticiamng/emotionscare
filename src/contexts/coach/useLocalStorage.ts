// @ts-nocheck

import { useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

const SETTINGS_KEY = 'coach_messages';

export function useCoachLocalStorage(
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void
) {
  const { user } = useAuth();
  const isLoaded = useRef(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Charger les messages depuis Supabase ou localStorage au montage
  useEffect(() => {
    const loadMessages = async () => {
      if (isLoaded.current) return;
      
      try {
        if (user) {
          // Charger depuis Supabase
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', SETTINGS_KEY)
            .maybeSingle();

          if (data?.value) {
            const parsed = typeof data.value === 'string' 
              ? JSON.parse(data.value) 
              : data.value;
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              isLoaded.current = true;
              return;
            }
          }

          // Migrer depuis localStorage si présent
          const localMessages = localStorage.getItem('coachMessages');
          if (localMessages) {
            const parsed = JSON.parse(localMessages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed);
              // Sync vers Supabase
              await saveToSupabase(parsed, user.id);
              localStorage.removeItem('coachMessages');
            }
          }
        } else {
          // Fallback localStorage pour utilisateurs non connectés
          const savedMessages = localStorage.getItem('coachMessages');
          if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
          }
        }
      } catch (error) {
        logger.error('Failed to load coach messages', error as Error, 'COACH');
        // Fallback localStorage
        const savedMessages = localStorage.getItem('coachMessages');
        if (savedMessages) {
          try {
            setMessages(JSON.parse(savedMessages));
          } catch (e) {
            logger.error('Failed to parse saved messages', e as Error, 'COACH');
          }
        }
      } finally {
        isLoaded.current = true;
      }
    };

    loadMessages();
  }, [user?.id, setMessages]);

  // Sauvegarder les messages avec debounce
  useEffect(() => {
    if (!isLoaded.current || messages.length === 0) return;

    // Sauvegarder en localStorage immédiatement (fallback)
    try {
      localStorage.setItem('coachMessages', JSON.stringify(messages.slice(-100))); // Limiter à 100
    } catch (e) {
      logger.warn('[CoachStorage] localStorage save failed', e, 'COACH');
    }

    // Debounce la sauvegarde Supabase
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      if (user) {
        await saveToSupabase(messages.slice(-100), user.id);
      }
    }, 1000); // 1s debounce

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [messages, user?.id]);
}

async function saveToSupabase(messages: ChatMessage[], userId: string) {
  try {
    await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        key: SETTINGS_KEY,
        value: JSON.stringify(messages),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,key'
      });
  } catch (error) {
    logger.error('Failed to save coach messages to Supabase', error as Error, 'COACH');
  }
}
