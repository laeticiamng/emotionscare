
/**
 * Vérifie si le rôle fourni est un rôle admin
 */
export const isAdminRole = (role?: string | null): boolean => {
  if (!role) return false;
  return role.toLowerCase().includes('admin');
};

/**
 * Retourne un nom lisible pour un rôle donné
 */
export const getRoleName = (role?: string | null): string => {
  if (!role) return 'Utilisateur';
  
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Administrateur';
    case 'moderator':
      return 'Modérateur';
    case 'b2b-admin':
      return 'Admin B2B';
    case 'b2b-collaborator':
      return 'Collaborateur B2B';
    default:
      return 'Utilisateur';
  }
};

/**
 * Retourne un nom d'affichage complet pour un rôle donné
 * Utilisé dans les interfaces pour une description plus détaillée
 */
export const getRoleDisplayName = (role?: string | null): string => {
  if (!role) return 'Utilisateur standard';
  
  switch (role.toLowerCase()) {
    case 'admin':
      return 'Administrateur système';
    case 'moderator':
      return 'Modérateur de contenu';
    case 'b2b-admin':
      return 'Administrateur d\'entreprise';
    case 'b2b-collaborator':
      return 'Collaborateur d\'entreprise';
    case 'user':
      return 'Utilisateur standard';
    default:
      // Si c'est un rôle personnalisé, le formater joliment
      return role.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

// Remove the problematic re-export line - it's unnecessary since the function is already exported above
