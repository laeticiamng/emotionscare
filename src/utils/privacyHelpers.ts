
/**
 * Utilitaires pour la gestion de la confidentialité et l'anonymisation des données
 */

/**
 * Vérifie si un utilisateur peut accéder aux données d'équipe
 */
export const canAccessTeamData = (userRole: string): boolean => {
  // Seuls les administrateurs RH peuvent accéder aux données d'équipe (anonymisées)
  return userRole === 'b2b_admin';
};

/**
 * Vérifie si un utilisateur peut accéder aux données individuelles d'autres utilisateurs
 */
export const canAccessIndividualData = (userRole: string, targetUserId: string, currentUserId: string): boolean => {
  // Seul l'utilisateur lui-même peut accéder à ses données individuelles
  return targetUserId === currentUserId;
};

/**
 * Vérifie si le nombre de participants est suffisant pour l'anonymisation
 */
export const hasMinimumParticipants = (count: number): boolean => {
  // Minimum 5 participants pour respecter l'anonymisation RGPD
  return count >= 5;
};

/**
 * Anonymise les données pour les administrateurs RH
 */
export const anonymizeTeamData = (data: any[]): any[] => {
  return data.map((item, index) => ({
    ...item,
    // Suppression des identifiants personnels
    name: undefined,
    email: undefined,
    userId: undefined,
    // Remplacement par des identifiants anonymes
    anonymousId: `ANON_${index + 1}`,
    // Conservation uniquement des métriques agrégées
    emotionalScore: item.emotionalScore,
    timestamp: item.timestamp
  }));
};

/**
 * Filtre les données selon le rôle de l'utilisateur
 */
export const filterDataByRole = (data: any[], userRole: string, userId: string): any[] => {
  switch (userRole) {
    case 'b2b_user':
      // Les collaborateurs ne voient que leurs propres données
      return data.filter(item => item.userId === userId);
    
    case 'b2b_admin':
      // Les RH voient des données anonymisées et agrégées
      if (!hasMinimumParticipants(data.length)) {
        return []; // Pas assez de participants pour garantir l'anonymat
      }
      return anonymizeTeamData(data);
    
    default:
      // Les autres rôles voient leurs propres données
      return data.filter(item => item.userId === userId);
  }
};

/**
 * Génère un message d'information sur la confidentialité selon le rôle
 */
export const getPrivacyMessage = (userRole: string): string => {
  switch (userRole) {
    case 'b2b_user':
      return 'Vos données personnelles sont protégées et ne sont jamais partagées individuellement.';
    
    case 'b2b_admin':
      return 'Seules les statistiques anonymisées et agrégées sont accessibles. Aucune donnée individuelle n\'est visible.';
    
    default:
      return 'Vos données sont protégées selon nos standards de confidentialité.';
  }
};
