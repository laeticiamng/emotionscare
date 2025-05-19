
export type UserRole = 'user' | 'admin' | 'b2c' | 'b2b_user' | 'b2b_admin';

export interface User {
  id: string;
  name?: string;
  email: string;
  role?: UserRole;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // For backward compatibility
  displayName?: string; // For backward compatibility
  created_at?: Date | string; // For backward compatibility
  preferences?: any;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  avatar_url?: string; // For backward compatibility
  avatarUrl?: string; // For backward compatibility
  displayName?: string; // For backward compatibility
  company?: string;
  department?: string;
  position?: string;
  createdAt?: Date | string;
}

export interface UserWithStatus extends User {
  status?: 'active' | 'inactive' | 'pending';
  lastActive?: Date;
}
