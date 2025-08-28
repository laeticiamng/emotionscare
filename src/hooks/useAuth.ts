/**
 * Hook d'authentification unifié
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@/routerV2';
import { toast } from '@/hooks/use-toast';

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

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    
    try {
      // Simulation authentification
      console.log('Authenticating user:', data);
      
      // Simulation délai API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulation réussie
      const mockUser = {
        id: '1',
        email: data.email,
        role: data.segment === 'b2c' ? 'consumer' : 
              data.adminKey ? 'manager' : 'employee',
        name: data.email.split('@')[0]
      };
      
      // Sauvegarder dans localStorage
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock_jwt_token');
      
      // Rediriger selon le rôle
      switch (mockUser.role) {
        case 'consumer':
          navigate(Routes.consumerHome());
          break;
        case 'employee':
          navigate(Routes.employeeHome());
          break;
        case 'manager':
          navigate(Routes.managerHome());
          break;
        default:
          navigate(Routes.home());
      }
      
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${mockUser.name} !`,
      });
      
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Vérifiez vos identifiants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      console.log('Creating account:', data);
      
      // Validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      
      // Simulation délai API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (data.segment === 'b2b') {
        // B2B : Demande d'accès
        toast({
          title: 'Demande envoyée',
          description: 'Votre demande d\'accès a été transmise à votre équipe RH.',
        });
        
        navigate(Routes.home());
      } else {
        // B2C : Compte créé directement
        const mockUser = {
          id: '1',
          email: data.email,
          role: 'consumer',
          name: data.name || `${data.firstName} ${data.lastName}`.trim()
        };
        
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        localStorage.setItem('auth_token', 'mock_jwt_token');
        
        toast({
          title: 'Compte créé',
          description: 'Votre compte a été créé avec succès !',
        });
        
        navigate(Routes.consumerHome());
      }
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    navigate(Routes.home());
    
    toast({
      title: 'Déconnexion',
      description: 'À bientôt !',
    });
  }, [navigate]);

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