
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { UserPreferences } from '@/types/preferences';
import { normalizeUserMode } from '@/utils/userModeHelpers';
import { isLoginLocked, recordLoginAttempt } from '@/utils/security';
import { AuthError, AuthErrorCode } from '@/utils/authErrors';

// Helper to persist the user role in a secure cookie
const setRoleCookie = (role: UserRole) => {
  if (typeof document !== 'undefined') {
    document.cookie = `user_role=${role}; path=/; secure; samesite=strict`;
  }
};

const clearRoleCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  }
};

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  preferences?: Partial<UserPreferences>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

/**
 * Service d'authentification utilisant Supabase
 */
export const authService = {
  /**
   * Inscription d'un utilisateur
   */
  async signUp({ email, password, name = '', role = 'b2c', preferences = {} }: SignUpData): Promise<AuthResponse> {
    try {
      // Normaliser le rôle pour cohérence dans la base
      const normalizedRole = normalizeUserMode(role) as UserRole;
      
      // Inscription avec Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: normalizedRole,
            preferences
          },
        },
      });
      
      if (error) throw error;
      
      if (!data.user) {
        return { user: null, error: new Error('No user data returned') };
      }
      
      // Transformer la réponse Supabase en User
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: name || email.split('@')[0],
        role: normalizedRole,
        created_at: data.user.created_at,
        preferences: {
          theme: 'system',
          language: 'fr',
          ...preferences,
        }
      };
      setRoleCookie(user.role);

      return { user, error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { user: null, error };
    }
  },
  
  /**
   * Connexion d'un utilisateur
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      if (isLoginLocked(email)) {
        return {
          user: null,
          error: new AuthError(
            AuthErrorCode.TOO_MANY_ATTEMPTS,
            'Trop de tentatives de connexion. Veuillez réessayer plus tard.'
          )
        };
      }

      // Connexion avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        recordLoginAttempt(email, false);
        throw new AuthError(AuthErrorCode.INVALID_CREDENTIALS, error.message);
      }
      
      if (!data.user) {
        recordLoginAttempt(email, false);
        return {
          user: null,
          error: new AuthError(AuthErrorCode.UNKNOWN, 'No user data returned')
        };
      }
      
      // Récupérer le profil complet depuis la table profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // Transformer la réponse Supabase en User
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: profileData?.name || data.user.user_metadata?.name || email.split('@')[0],
        role: (profileData?.role || data.user.user_metadata?.role || 'b2c') as UserRole,
        created_at: data.user.created_at,
        preferences: {
          theme: 'system',
          language: 'fr',
          ...(profileData?.preferences || data.user.user_metadata?.preferences || {}),
        }
      };

      recordLoginAttempt(email, true);
      setRoleCookie(user.role);
      return { user, error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { user: null, error };
    }
  },
  
  /**
   * Déconnexion d'un utilisateur
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearRoleCookie();
      return { error: null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error };
    }
  },
  
  /**
   * Récupérer la session de l'utilisateur actuel
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!data.session?.user) {
        return { user: null, error: null }; // Pas d'erreur, mais pas de session
      }
      
      // Récupérer le profil complet depuis la table profiles
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      const user: User = {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: profileData?.name || data.session.user.user_metadata?.name || '',
        role: (profileData?.role || data.session.user.user_metadata?.role || 'b2c') as UserRole,
        created_at: data.session.user.created_at,
        preferences: {
          theme: 'system',
          language: 'fr',
          ...(profileData?.preferences || data.session.user.user_metadata?.preferences || {}),
        }
      };
      
      return { user, error: null };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return { user: null, error };
    }
  },
  
  /**
   * Mettre à jour le profil d'un utilisateur
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Mettre à jour les métadonnées utilisateur dans Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          role: updates.role,
          preferences: updates.preferences,
        }
      });
      
      if (authUpdateError) throw authUpdateError;
      
      // Mettre à jour la table profiles
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          role: updates.role,
          preferences: updates.preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (profileUpdateError) throw profileUpdateError;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Mettre à jour les préférences d'un utilisateur
   */
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Récupérer d'abord les préférences actuelles
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', userId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Fusionner les préférences existantes avec les nouvelles
      const updatedPreferences = {
        ...(profileData?.preferences || {}),
        ...preferences,
      };
      
      // Mettre à jour dans Supabase Auth
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          preferences: updatedPreferences,
        }
      });
      
      if (authUpdateError) throw authUpdateError;
      
      // Mettre à jour dans la table profiles
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
      
      if (profileUpdateError) throw profileUpdateError;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error updating user preferences:', error);
      return { success: false, error };
    }
  },
  
  /**
   * Demander une réinitialisation de mot de passe
   */
  async resetPassword(email: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { success: false, error };
    }
  },

  /**
   * Envoyer un lien magique de connexion par email
   */
  async sendMagicLink(email: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/b2c/dashboard`,
        },
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      return { success: false, error };
    }
  },
};

export default authService;
