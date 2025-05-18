
import { ReactNode } from 'react';

/**
 * Message échangé entre l'utilisateur et le coach IA.
 */
export interface ChatMessage {
  id: string;
  /** Contenu textuel du message */
  content: string;
  /** Expéditeur du message */
  sender: 'user' | 'coach' | 'system' | string;
  /** Date d'envoi */
  timestamp: string | Date;
  /** Indique si le message est en cours de génération */
  isLoading?: boolean;
  /** Métadonnées libres */
  metadata?: Record<string, any>;
}

export interface CoachCharacterProps {
  name?: string;
  avatar?: string;
  mood?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface CoachChatProps {
  initialMessage?: string;
  showCharacter?: boolean;
  characterSize?: 'sm' | 'md' | 'lg';
  className?: string;
  showControls?: boolean;
  showHeader?: boolean;
  showInput?: boolean;
  embedded?: boolean;
}

/**
 * Conversation complète regroupant une liste de messages.
 */
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  lastUpdated: Date | string;
}

/**
 * Session de coaching contenant plusieurs conversations d'un utilisateur.
 */
export interface CoachSession {
  id: string;
  userId: string;
  conversations: Conversation[];
  startedAt: Date | string;
  endedAt?: Date | string;
}

/**
 * Suggestion de ressource ou d'action proposée par le coach.
 */
export interface Suggestion {
  id: string;
  content: string;
  category: string;
  createdAt: Date | string;
}

