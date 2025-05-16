
export const TOAST_VARIANTS = {
  default: 'default',
  destructive: 'destructive',
  success: 'success', 
  warning: 'warning',
  info: 'info',
  error: 'destructive', // Alias for destructive
} as const;

export type ToastVariant = keyof typeof TOAST_VARIANTS;
