import { supabase } from '@/integrations/supabase/client';
import type { AuthError, Session, User } from '@supabase/supabase-js';

const FRIENDLY_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email ou mot de passe incorrect',
  'Email not confirmed': 'Veuillez confirmer votre adresse email avant de vous connecter',
  'User not found': "Aucun compte trouvé avec cet email",
  'Invalid email or password': 'Email ou mot de passe incorrect',
  'OTP has expired or is invalid': 'Le lien de réinitialisation a expiré ou est invalide',
  'Too many requests': 'Trop de tentatives. Veuillez réessayer dans quelques instants.',
};

const DEFAULT_ERROR_MESSAGE = 'Connexion impossible pour le moment. Veuillez réessayer.';

const resolveError = (error: unknown): Error => {
  if (error && typeof error === 'object' && 'message' in error) {
    const rawMessage = String((error as AuthError).message ?? '');
    const normalizedMessage = rawMessage.trim();
    const friendly = FRIENDLY_MESSAGES[normalizedMessage] ?? DEFAULT_ERROR_MESSAGE;
    return new Error(friendly);
  }

  if (typeof error === 'string' && error.length > 0) {
    return new Error(FRIENDLY_MESSAGES[error] ?? DEFAULT_ERROR_MESSAGE);
  }

  return new Error(DEFAULT_ERROR_MESSAGE);
};

export interface B2CLoginPayload {
  email: string;
  password: string;
}

export interface B2CLoginResult {
  session: Session;
  user: User;
}

export const b2cAuthService = {
  async login({ email, password }: B2CLoginPayload): Promise<B2CLoginResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw resolveError(error);
      }

      if (!data?.user || !data.session) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }

      return { session: data.session, user: data.user };
    } catch (error) {
      throw resolveError(error);
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        ...(redirectTo ? { redirectTo } : {}),
      });

      if (error) {
        throw resolveError(error);
      }
    } catch (error) {
      throw resolveError(error);
    }
  },
};

export const authErrorMessage = (error: unknown): string => resolveError(error).message;
