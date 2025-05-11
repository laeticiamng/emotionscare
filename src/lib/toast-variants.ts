
export const TOAST_VARIANTS = {
  default: 'default',
  destructive: 'destructive',
  success: 'success', 
  warning: 'warning',
  error: 'destructive', // Alias for destructive
  info: 'default',     // Alias for default
} as const;

export type ToastVariant = keyof typeof TOAST_VARIANTS;
