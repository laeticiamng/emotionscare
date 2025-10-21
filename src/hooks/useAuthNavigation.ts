// @ts-nocheck
/**
 * useAuthNavigation - Hook pour la navigation après authentification
 * Gère les redirections intelligentes basées sur le contexte utilisateur
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface NavigationOptions {
  fallback?: string;
  segment?: 'b2c' | 'b2b';
  force?: boolean;
}

export function useAuthNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  /**
   * Navigue vers la destination appropriée après connexion
   */
  const navigateAfterLogin = useCallback((options: NavigationOptions = {}) => {
    const { fallback = '/app/home', segment, force = false } = options;

    // Si l'utilisateur n'est pas authentifié et qu'on ne force pas, ne rien faire
    if (!isAuthenticated && !force) {
      return;
    }

    // Récupérer l'URL de redirection depuis les paramètres de recherche
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect') || searchParams.get('returnTo');

    // Déterminer la destination finale
    let destination: string;

    if (redirectTo) {
      // Valider que l'URL de redirection est sûre (même origine)
      try {
        const url = new URL(redirectTo, window.location.origin);
        if (url.origin === window.location.origin) {
          destination = redirectTo;
        } else {
          logger.warn('Tentative de redirection vers une origine externe bloquée', { redirectTo }, 'AUTH');
          destination = fallback;
        }
      } catch {
        // URL invalide, utiliser le fallback
        destination = fallback;
      }
    } else {
      // Pas de redirection spécifique, utiliser la logique par défaut
      if (segment === 'b2b') {
        destination = '/enterprise/dashboard';
      } else if (segment === 'b2c') {
        destination = '/app/home';
      } else {
        // Automatically determine based on user profile
        // Will be implemented based on user metadata when available
        destination = fallback;
      }
    }

    logger.info('Navigation après connexion vers', { destination }, 'AUTH');
    navigate(destination, { replace: true });
  }, [navigate, location, isAuthenticated]);

  /**
   * Navigue vers la page de connexion avec redirection
   */
  const navigateToLogin = useCallback((options: NavigationOptions = {}) => {
    const { segment } = options;
    const currentPath = location.pathname;
    
    // Construire l'URL de connexion
    let loginPath = '/login';
    const params = new URLSearchParams();
    
    if (segment) {
      params.set('segment', segment);
    }
    
    // Ajouter la redirection si on n'est pas déjà sur une page d'auth
    if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
      params.set('redirect', currentPath + location.search);
    }
    
    if (params.toString()) {
      loginPath += '?' + params.toString();
    }
    
    navigate(loginPath);
  }, [navigate, location]);

  /**
   * Navigue vers la page d'inscription avec redirection  
   */
  const navigateToSignup = useCallback((options: NavigationOptions = {}) => {
    const { segment } = options;
    const currentPath = location.pathname;
    
    let signupPath = '/signup';
    const params = new URLSearchParams();
    
    if (segment) {
      params.set('segment', segment);
    }
    
    // Ajouter la redirection si on n'est pas déjà sur une page d'auth
    if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
      params.set('redirect', currentPath + location.search);
    }
    
    if (params.toString()) {
      signupPath += '?' + params.toString();
    }
    
    navigate(signupPath);
  }, [navigate, location]);

  /**
   * Navigue vers le dashboard approprié
   */
  const navigateToDashboard = useCallback((segment?: 'b2c' | 'b2b') => {
    if (segment === 'b2b') {
      navigate('/enterprise/dashboard');
    } else {
      navigate('/app/home');
    }
  }, [navigate]);

  /**
   * Vérifie si l'utilisateur a accès à une route
   */
  const canAccessRoute = useCallback((route: string): boolean => {
    // Routes publiques
    const publicRoutes = ['/', '/login', '/signup', '/about', '/contact', '/help', '/b2c', '/entreprise'];
    
    if (publicRoutes.includes(route) || publicRoutes.some(r => route.startsWith(r))) {
      return true;
    }

    // Routes protégées nécessitent une authentification
    const protectedRoutes = ['/app', '/enterprise'];
    if (protectedRoutes.some(r => route.startsWith(r))) {
      return isAuthenticated;
    }

    // Par défaut, autoriser l'accès
    return true;
  }, [isAuthenticated]);

  /**
   * Redirige vers une page d'erreur appropriée
   */
  const navigateToError = useCallback((errorCode: 401 | 403 | 404 | 500 = 404) => {
    navigate(`/${errorCode}`);
  }, [navigate]);

  return {
    navigateAfterLogin,
    navigateToLogin,
    navigateToSignup,
    navigateToDashboard,
    navigateToError,
    canAccessRoute,
  };
}