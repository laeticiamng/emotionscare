
export const getRoleName = (role: string): string => {
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

export const getRoleRoute = (role: string): string => {
  switch (role) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/';
  }
};

export const isAdminRole = (role?: string): boolean => {
  return role === 'b2b_admin' || role === 'admin';
};
