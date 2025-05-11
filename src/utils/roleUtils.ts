
export const isAdminRole = (role: string | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrator';
};

export const isManagerRole = (role: string | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase() === 'manager';
};

export const getUserRoleLevel = (role: string | undefined): number => {
  if (!role) return 0;
  
  const roleLevels: Record<string, number> = {
    'admin': 100,
    'administrator': 100,
    'manager': 50,
    'therapist': 40,
    'coach': 30,
    'user': 10,
    'guest': 1
  };
  
  return roleLevels[role.toLowerCase()] || 0;
};

export const getRoleName = (role: string | undefined): string => {
  if (!role) return 'Utilisateur';
  
  const roleNames: Record<string, string> = {
    'admin': 'Administrateur',
    'administrator': 'Administrateur',
    'manager': 'Manager',
    'therapist': 'Thérapeute',
    'coach': 'Coach',
    'user': 'Utilisateur',
    'guest': 'Invité',
    'wellbeing_manager': 'Manager de bien-être'
  };
  
  return roleNames[role.toLowerCase()] || role;
};
