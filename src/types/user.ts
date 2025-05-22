
import { UserRole } from '@/utils/roleUtils';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export { UserRole };
