/**
 * Types utilisateur étendus pour EmotionsCare
 */

import { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'consumer' | 'employee' | 'manager';

// Extension du type User de Supabase avec propriétés calculées
export interface User extends SupabaseUser {
  // Propriétés étendues pour compatibilité
  name?: string;
  display_name?: string;
  full_name?: string;
  avatar?: string;
  avatar_url?: string;
  role?: UserRole;
}

// Helpers pour extraire les propriétés utilisateur
export const getUserName = (user: SupabaseUser | null): string => {
  if (!user) return 'Utilisateur';
  
  const metadata = user.user_metadata || {};
  return (
    metadata.display_name ||
    metadata.name ||
    metadata.full_name ||
    user.email?.split('@')[0] ||
    'Utilisateur'
  );
};

export const getUserAvatar = (user: SupabaseUser | null): string | undefined => {
  if (!user) return undefined;
  
  const metadata = user.user_metadata || {};
  return metadata.avatar_url || metadata.avatar;
};

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}