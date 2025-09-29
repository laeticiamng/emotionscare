
import { toast } from '@/hooks/use-toast';

export class ApiErrorHandler {
  static handleAuthError(error: any, context: string) {
    console.error(`Auth Error in ${context}:`, error);
    
    if (error.message?.includes('Invalid login credentials')) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } else if (error.message?.includes('Email already registered')) {
      toast({
        title: "Compte existant",
        description: "Un compte existe déjà avec cet email",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur d'authentification",
        description: "Une erreur est survenue lors de l'authentification",
        variant: "destructive",
      });
    }
  }

  static handleApiError(error: any, context: string) {
    console.error(`API Error in ${context}:`, error);
    
    if (error.status === 403) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires",
        variant: "destructive",
      });
    } else if (error.status === 429) {
      toast({
        title: "Limite dépassée",
        description: "Trop de requêtes, veuillez patienter",
        variant: "destructive",
      });
    } else if (error.status >= 500) {
      toast({
        title: "Erreur serveur",
        description: "Le service est temporairement indisponible",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    }
  }

  static handleAnalyticsError(error: any, context: string) {
    // Analytics errors should be silent but logged
    console.warn(`Analytics Error in ${context}:`, error);
  }

  static handleNetworkError(error: any, context: string) {
    console.error(`Network Error in ${context}:`, error);
    
    toast({
      title: "Problème de connexion",
      description: "Vérifiez votre connexion internet",
      variant: "destructive",
    });
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}
