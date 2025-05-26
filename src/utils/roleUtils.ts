
export type UserRole = 'b2c' | 'b2b_user' | 'b2b_admin';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'b2c':
      return 'Particulier';
    case 'b2b_user':
      return 'Collaborateur';
    case 'b2b_admin':
      return 'Administrateur';
    default:
      return 'Utilisateur';
  }
};

export const isAdminRole = (role: string): boolean => {
  return role === 'b2b_admin';
};
