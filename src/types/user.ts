
import { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';

export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'manager' 
  | 'employee' 
  | 'wellbeing_manager' 
  | 'coach' 
  | 'analyst';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  avatar_url?: string;
  avatar?: string;
  image?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
  
  // Propriétés supplémentaires utilisées dans l'application
  department?: string;
  position?: string;
  created_at?: string;
  createdAt?: string;
  joined_at?: string;
  emotional_score?: number;
  anonymity_code?: string;
  team_id?: string;
  isActive?: boolean;
}

// Re-exporter les types depuis le fichier preferences pour la compatibilité
export type { UserPreferences } from './preferences';
