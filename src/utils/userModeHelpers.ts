
export const normalizeUserMode = (mode: string | null): string => {
  if (!mode) return '';
  return mode;
};

export const getModeDashboardPath = (mode: string | null): string => {
  switch (mode) {
    case 'b2c':
      return '/b2c/dashboard';
    case 'b2b_user':
      return '/b2b/user/dashboard';
    case 'b2b_admin':
      return '/b2b/admin/dashboard';
    default:
      return '/choose-mode';
  }
};
