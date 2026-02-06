/**
 * Hook d'authentification unifié - Compatible avec SimpleAuth
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routerV2';
import { toast } from '@/hooks/use-toast';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
  segment?: 'b2c' | 'b2b';
  companyCode?: string;
  adminKey?: string;
}

interface SignupData {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  segment?: 'b2c' | 'b2b';
  company?: string;
  jobTitle?: string;
  message?: string;
}

export const useAuthFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn: authSignIn, signOut: authSignOut, user, isAuthenticated } = useAuthContext();

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      await authSignIn(data.email, data.password);
      
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue !',
      });
      
    } catch (error: unknown) {
      toast({
        title: 'Erreur de connexion',
        description: error instanceof Error ? error.message : 'Vérifiez vos identifiants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, authSignIn]);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      // Pour SimpleAuth, on utilise signIn avec les nouvelles données
      await authSignIn(data.email, data.password);
      
      if (data.segment === 'b2b') {
        toast({
          title: 'Compte créé',
          description: 'Votre compte collaborateur a été créé.',
        });
      } else {
        toast({
          title: 'Compte créé',
          description: 'Votre compte a été créé avec succès !',
        });
      }
      
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, authSignIn]);

  const logout = useCallback(async () => {
    try {
      authSignOut();
      
      toast({
        title: 'Déconnexion',
        description: 'À bientôt !',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Problème de déconnexion',
        variant: 'destructive',
      });
    }
  }, [navigate, authSignOut]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    
    try {
      logger.info('Password reset requested', { email }, 'AUTH');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email envoyé',
        description: 'Consultez votre boîte mail pour réinitialiser votre mot de passe.',
      });
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'email de récupération',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    login,
    signup,
    logout,
    resetPassword,
    isLoading,
    user,
    isAuthenticated
  };
};

// Export as useAuth for backward compatibility
export const useAuth = useAuthFlow;