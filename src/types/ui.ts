
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export interface ThemeSwitcherProps {
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}
