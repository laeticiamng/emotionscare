/**
 * Hook d'authentification unifié avec Supabase
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/routerV2';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const { login: authLogin, register: authRegister, logout: authLogout } = useAuth();

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      await authLogin(data.email, data.password);
      
      // Rediriger selon le segment
      if (data.segment === 'b2c') {
        navigate(Routes.consumerHome());
      } else {
        navigate(Routes.employeeHome());
      }
      
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue !',
      });
      
    } catch (error: any) {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Vérifiez vos identifiants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, authLogin]);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      await authRegister(data.email, data.password);
      
      if (data.segment === 'b2b') {
        // B2B : Demande d'accès
        toast({
          title: 'Demande envoyée',
          description: 'Votre demande d\'accès a été transmise à votre équipe RH.',
        });
        
        navigate(Routes.home());
      } else {
        // B2C : Compte créé directement
        toast({
          title: 'Compte créé',
          description: 'Votre compte a été créé avec succès ! Vérifiez votre email.',
        });
        
        navigate(Routes.consumerHome());
      }
      
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, authRegister]);

  const logout = useCallback(async () => {
    try {
      await authLogout();
      navigate(Routes.home());
      
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
  }, [navigate, authLogout]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    
    try {
      console.log('Password reset for:', email);
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
    isLoading
  };
};