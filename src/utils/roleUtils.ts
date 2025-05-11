
/**
 * Vérifie si le rôle fourni est un rôle admin
 */
export const isAdminRole = (role?: string | null): boolean => {
  if (!role) return false;
  return role.toLowerCase().includes('admin');
};
