
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number; // Added to support CompliancePage.tsx and MyDataPage.tsx
}

export interface ToastAction {
  altText: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export interface ThemeSwitcherProps {
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean; // Added to support DesignSystemPage.tsx
}

export interface InvitationVerificationResult {
  valid: boolean;
  expired?: boolean;
  alreadyAccepted?: boolean;
  error?: string;
  invitation?: {
    id: string;
    email: string;
    role: string;
    expiresAt: string;
  };
}
