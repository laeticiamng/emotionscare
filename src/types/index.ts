
export interface Emotion {
  id: string;
  name: string;
  color: string;
  intensity?: number;
  timestamp?: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'b2c' | 'b2b_admin' | 'b2b_user';
  avatar_url?: string;
}

export interface UserMode {
  mode: 'b2c' | 'b2b';
  isLoading: boolean;
}

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}
