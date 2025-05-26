
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin';

export const USER_MODES = {
  B2C: 'b2c' as const,
  B2B_USER: 'b2b_user' as const,
  B2B_ADMIN: 'b2b_admin' as const,
  ADMIN: 'b2b_admin' as const,
};

export const USER_MODE_LABELS: Record<UserModeType, string> = {
  b2c: 'Particulier',
  b2b_user: 'Collaborateur',
  b2b_admin: 'Administrateur RH',
};
