
// Authentication related type definitions

export interface AuthFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface AuthFormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export interface AuthTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

export interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerLinks?: Array<{
    label: string;
    href: string;
  }>;
}

export interface SocialAuthProviderProps {
  provider: 'google' | 'apple' | 'facebook' | 'twitter';
  label: string;
  isLoading?: boolean;
  onClick: () => void;
}

export interface MagicLinkFormData {
  email: string;
}

export interface PasswordResetFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}
