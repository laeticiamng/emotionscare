// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Envoie un email de réinitialisation de mot de passe via Supabase Auth.
 * Retourne toujours { success: true } pour ne pas révéler si l'email existe.
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      logger.error('Erreur lors de la demande de réinitialisation', { error: error.message }, 'AUTH');
    } else {
      logger.info('Email de réinitialisation envoyé', { email }, 'AUTH');
    }
  } catch (err) {
    logger.error('Erreur inattendue lors du reset', err instanceof Error ? err : new Error(String(err)), 'AUTH');
  }

  // Toujours retourner success pour ne pas révéler si l'email existe (sécurité)
  return { success: true };
};

/**
 * Met à jour le mot de passe de l'utilisateur connecté via le lien de réinitialisation.
 * Supabase gère automatiquement la session via le lien magique de reset.
 */
export const resetPassword = async (_token: string, newPassword: string): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logger.error('Erreur lors de la réinitialisation du mot de passe', { error: error.message }, 'AUTH');
      return {
        success: false,
        message: error.message === 'New password should be different from the old password.'
          ? 'Le nouveau mot de passe doit être différent de l\'ancien.'
          : 'Impossible de réinitialiser le mot de passe. Le lien a peut-être expiré.',
      };
    }

    logger.info('Mot de passe réinitialisé avec succès', undefined, 'AUTH');
    return {
      success: true,
      message: 'Votre mot de passe a été réinitialisé avec succès.',
    };
  } catch (err) {
    logger.error('Erreur inattendue', err instanceof Error ? err : new Error(String(err)), 'AUTH');
    return {
      success: false,
      message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
    };
  }
};
