// @ts-nocheck

export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin' | 'admin';

export const isAdminRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  const roleStr = String(role).toLowerCase();
  return roleStr.includes('admin') || roleStr === 'b2b_admin';
};

export const isB2BRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  const roleStr = String(role).toLowerCase();
  return roleStr.includes('b2b') || roleStr === 'b2b_user' || roleStr === 'b2b_admin';
};

export const isB2CRole = (role: UserRole | string | undefined): boolean => {
  if (!role) return false;
  const roleStr = String(role).toLowerCase();
  return roleStr === 'b2c';
};

export const getRoleDisplayName = (role: UserRole | string | undefined): string => {
  if (!role) return 'Utilisateur';
  
  const roleStr = String(role).toLowerCase();
  
  switch (roleStr) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur RH';
    case 'admin':
      return 'Administrateur Système';
    default:
      return 'Utilisateur';
  }
};

export const getRolePermissions = (role: UserRole | string | undefined): string[] => {
  if (!role) return [];
  
  const roleStr = String(role).toLowerCase();
  
  const permissions: Record<string, string[]> = {
    'b2c': ['read_own', 'write_own'],
    'b2b_user': ['read_own', 'write_own', 'read_team'],
    'b2b_admin': ['read_own', 'write_own', 'read_team', 'write_team', 'manage_users'],
    'admin': ['all']
  };
  
  return permissions[roleStr] || [];
};

export const hasPermission = (userRole: UserRole | string | undefined, requiredPermission: string): boolean => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes('all') || permissions.includes(requiredPermission);
};
