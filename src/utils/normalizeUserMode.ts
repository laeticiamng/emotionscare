
export const normalizeUserMode = (mode: string): string => {
  const normalizedMode = mode.toLowerCase().trim();
  
  switch (normalizedMode) {
    case 'b2c':
    case 'individual':
    case 'personal':
      return 'b2c';
    case 'b2b_user':
    case 'b2b-user':
    case 'employee':
    case 'collaborator':
      return 'b2b_user';
    case 'b2b_admin':
    case 'b2b-admin':
    case 'admin':
    case 'administrator':
      return 'b2b_admin';
    default:
      return 'b2c';
  }
};
