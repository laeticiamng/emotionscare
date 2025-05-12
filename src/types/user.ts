
import { Theme, FontFamily, FontSize } from '@/contexts/ThemeContext';

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
  avatar?: string;
  preferences?: UserPreferences;
  onboarded?: boolean;
}

// Re-exporter les types depuis le fichier preferences pour la compatibilité
export type { UserPreferences } from './preferences';
