// @ts-nocheck
/**
 * toast-variants - Système de toasts avec variantes et helpers
 * Gestion des notifications UI avec animations et persistance
 */

import { logger } from '@/lib/logger';

/** Variantes de toast */
export const TOAST_VARIANTS = {
  default: 'default',
  destructive: 'destructive',
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'destructive', // Alias for destructive
  loading: 'loading',
  promise: 'promise'
} as const;

export type ToastVariant = keyof typeof TOAST_VARIANTS;

/** Position du toast */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Durée du toast */
export type ToastDuration = 'short' | 'medium' | 'long' | 'persistent' | number;

/** Action de toast */
export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

/** Options de toast */
export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: ToastDuration;
  position?: ToastPosition;
  icon?: string | React.ReactNode;
  action?: ToastAction;
  dismissible?: boolean;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  progress?: boolean;
  sound?: boolean;
  haptic?: boolean;
}

/** Toast avec état */
export interface Toast extends Required<Pick<ToastOptions, 'id' | 'title' | 'variant' | 'dismissible'>> {
  description?: string;
  duration: number;
  position: ToastPosition;
  icon?: string | React.ReactNode;
  action?: ToastAction;
  createdAt: number;
  pausedAt?: number;
  remainingDuration?: number;
  onDismiss?: () => void;
  onAutoClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
  progress?: boolean;
}

/** Configuration globale des toasts */
export interface ToastConfig {
  defaultDuration: number;
  defaultPosition: ToastPosition;
  maxToasts: number;
  pauseOnHover: boolean;
  pauseOnFocusLoss: boolean;
  stackDirection: 'up' | 'down';
  gap: number;
  sounds: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
  enableHaptics: boolean;
}

/** Stats des toasts */
export interface ToastStats {
  shown: number;
  dismissed: number;
  autoClosedGot: number;
  byVariant: Record<ToastVariant, number>;
}

// Configuration par défaut
const DEFAULT_CONFIG: ToastConfig = {
  defaultDuration: 4000,
  defaultPosition: 'bottom-right',
  maxToasts: 5,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  stackDirection: 'up',
  gap: 8,
  sounds: {},
  enableHaptics: false
};

// Durées prédéfinies
const DURATION_MAP: Record<string, number> = {
  short: 2000,
  medium: 4000,
  long: 8000,
  persistent: Infinity
};

// État global
let config: ToastConfig = { ...DEFAULT_CONFIG };
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];
let toastIdCounter = 0;

const stats: ToastStats = {
  shown: 0,
  dismissed: 0,
  autoClosedGot: 0,
  byVariant: {
    default: 0,
    destructive: 0,
    success: 0,
    warning: 0,
    info: 0,
    error: 0,
    loading: 0,
    promise: 0
  }
};

/** Générer un ID unique */
function generateToastId(): string {
  return `toast-${Date.now()}-${++toastIdCounter}`;
}

/** Résoudre la durée */
function resolveDuration(duration?: ToastDuration): number {
  if (duration === undefined) return config.defaultDuration;
  if (typeof duration === 'number') return duration;
  return DURATION_MAP[duration] ?? config.defaultDuration;
}

/** Notifier les listeners */
function notifyListeners(): void {
  listeners.forEach(listener => listener([...toasts]));
}

/** Jouer un son */
function playSound(variant: ToastVariant): void {
  const soundUrl = config.sounds[variant as keyof typeof config.sounds];
  if (soundUrl && typeof Audio !== 'undefined') {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {
      // Ignorer les erreurs audio
    }
  }
}

/** Déclencher un retour haptique */
function triggerHaptic(variant: ToastVariant): void {
  if (!config.enableHaptics) return;
  if ('vibrate' in navigator) {
    switch (variant) {
      case 'success':
        navigator.vibrate([50, 30, 50]);
        break;
      case 'error':
      case 'destructive':
        navigator.vibrate([100, 50, 100]);
        break;
      case 'warning':
        navigator.vibrate([75]);
        break;
      default:
        navigator.vibrate(50);
    }
  }
}

/** Configurer les toasts */
export function configureToasts(userConfig: Partial<ToastConfig>): void {
  config = { ...config, ...userConfig };
}

/** Ajouter un toast */
export function toast(options: ToastOptions | string): string {
  const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;

  const id = opts.id || generateToastId();
  const variant = opts.variant || 'default';
  const duration = resolveDuration(opts.duration);

  // Supprimer les anciens toasts si on dépasse le max
  while (toasts.length >= config.maxToasts) {
    const oldest = toasts.shift();
    if (oldest) {
      oldest.onAutoClose?.();
    }
  }

  const newToast: Toast = {
    id,
    title: opts.title,
    description: opts.description,
    variant,
    duration,
    position: opts.position || config.defaultPosition,
    icon: opts.icon,
    action: opts.action,
    dismissible: opts.dismissible ?? true,
    createdAt: Date.now(),
    onDismiss: opts.onDismiss,
    onAutoClose: opts.onAutoClose,
    className: opts.className,
    style: opts.style,
    progress: opts.progress
  };

  toasts.push(newToast);
  stats.shown++;
  stats.byVariant[variant]++;

  // Sons et haptiques
  if (opts.sound !== false) playSound(variant);
  if (opts.haptic !== false) triggerHaptic(variant);

  notifyListeners();

  // Auto-close
  if (duration !== Infinity) {
    setTimeout(() => {
      dismissToast(id, 'auto');
    }, duration);
  }

  logger.debug('Toast shown', { id, variant, title: opts.title }, 'UI');

  return id;
}

/** Dismisser un toast */
export function dismissToast(id: string, reason: 'manual' | 'auto' = 'manual'): void {
  const index = toasts.findIndex(t => t.id === id);
  if (index === -1) return;

  const [removed] = toasts.splice(index, 1);

  if (reason === 'manual') {
    stats.dismissed++;
    removed.onDismiss?.();
  } else {
    stats.autoClosedGot++;
    removed.onAutoClose?.();
  }

  notifyListeners();
  logger.debug('Toast dismissed', { id, reason }, 'UI');
}

/** Dismisser tous les toasts */
export function dismissAllToasts(): void {
  const count = toasts.length;
  toasts.forEach(t => t.onDismiss?.());
  toasts = [];
  stats.dismissed += count;
  notifyListeners();
}

/** Mettre à jour un toast */
export function updateToast(id: string, updates: Partial<ToastOptions>): void {
  const toast = toasts.find(t => t.id === id);
  if (!toast) return;

  if (updates.title) toast.title = updates.title;
  if (updates.description !== undefined) toast.description = updates.description;
  if (updates.variant) toast.variant = updates.variant;
  if (updates.icon !== undefined) toast.icon = updates.icon;
  if (updates.action !== undefined) toast.action = updates.action;

  notifyListeners();
}

/** Toast de succès */
export function toastSuccess(title: string, description?: string, options?: Partial<ToastOptions>): string {
  return toast({ ...options, title, description, variant: 'success' });
}

/** Toast d'erreur */
export function toastError(title: string, description?: string, options?: Partial<ToastOptions>): string {
  return toast({ ...options, title, description, variant: 'destructive' });
}

/** Toast d'avertissement */
export function toastWarning(title: string, description?: string, options?: Partial<ToastOptions>): string {
  return toast({ ...options, title, description, variant: 'warning' });
}

/** Toast d'info */
export function toastInfo(title: string, description?: string, options?: Partial<ToastOptions>): string {
  return toast({ ...options, title, description, variant: 'info' });
}

/** Toast de chargement */
export function toastLoading(title: string, description?: string): string {
  return toast({
    title,
    description,
    variant: 'loading',
    duration: 'persistent',
    dismissible: false
  });
}

/** Toast pour Promise */
export async function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: Error) => string);
  },
  options?: Partial<ToastOptions>
): Promise<T> {
  const id = toastLoading(messages.loading);

  try {
    const result = await promise;
    updateToast(id, {
      title: typeof messages.success === 'function' ? messages.success(result) : messages.success,
      variant: 'success'
    });
    setTimeout(() => dismissToast(id, 'auto'), config.defaultDuration);
    return result;
  } catch (error) {
    updateToast(id, {
      title: typeof messages.error === 'function' ? messages.error(error as Error) : messages.error,
      variant: 'destructive'
    });
    setTimeout(() => dismissToast(id, 'auto'), config.defaultDuration);
    throw error;
  }
}

/** Souscrire aux changements */
export function subscribeToasts(listener: (toasts: Toast[]) => void): () => void {
  listeners.push(listener);
  listener([...toasts]);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/** Obtenir les toasts actuels */
export function getToasts(): Toast[] {
  return [...toasts];
}

/** Obtenir un toast par ID */
export function getToastById(id: string): Toast | undefined {
  return toasts.find(t => t.id === id);
}

/** Obtenir les stats */
export function getToastStats(): ToastStats {
  return { ...stats };
}

/** Obtenir les styles pour une variante */
export function getVariantStyles(variant: ToastVariant): {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
} {
  const styles: Record<ToastVariant, ReturnType<typeof getVariantStyles>> = {
    default: {
      backgroundColor: 'var(--toast-bg, #fff)',
      borderColor: 'var(--toast-border, #e5e7eb)',
      textColor: 'var(--toast-text, #111827)',
      iconColor: 'var(--toast-icon, #6b7280)'
    },
    success: {
      backgroundColor: 'var(--toast-success-bg, #ecfdf5)',
      borderColor: 'var(--toast-success-border, #a7f3d0)',
      textColor: 'var(--toast-success-text, #065f46)',
      iconColor: 'var(--toast-success-icon, #10b981)'
    },
    destructive: {
      backgroundColor: 'var(--toast-error-bg, #fef2f2)',
      borderColor: 'var(--toast-error-border, #fecaca)',
      textColor: 'var(--toast-error-text, #991b1b)',
      iconColor: 'var(--toast-error-icon, #ef4444)'
    },
    error: {
      backgroundColor: 'var(--toast-error-bg, #fef2f2)',
      borderColor: 'var(--toast-error-border, #fecaca)',
      textColor: 'var(--toast-error-text, #991b1b)',
      iconColor: 'var(--toast-error-icon, #ef4444)'
    },
    warning: {
      backgroundColor: 'var(--toast-warning-bg, #fffbeb)',
      borderColor: 'var(--toast-warning-border, #fde68a)',
      textColor: 'var(--toast-warning-text, #92400e)',
      iconColor: 'var(--toast-warning-icon, #f59e0b)'
    },
    info: {
      backgroundColor: 'var(--toast-info-bg, #eff6ff)',
      borderColor: 'var(--toast-info-border, #bfdbfe)',
      textColor: 'var(--toast-info-text, #1e40af)',
      iconColor: 'var(--toast-info-icon, #3b82f6)'
    },
    loading: {
      backgroundColor: 'var(--toast-loading-bg, #f3f4f6)',
      borderColor: 'var(--toast-loading-border, #d1d5db)',
      textColor: 'var(--toast-loading-text, #374151)',
      iconColor: 'var(--toast-loading-icon, #6b7280)'
    },
    promise: {
      backgroundColor: 'var(--toast-bg, #fff)',
      borderColor: 'var(--toast-border, #e5e7eb)',
      textColor: 'var(--toast-text, #111827)',
      iconColor: 'var(--toast-icon, #6b7280)'
    }
  };

  return styles[variant] || styles.default;
}

/** Obtenir l'icône par défaut pour une variante */
export function getVariantIcon(variant: ToastVariant): string {
  const icons: Record<ToastVariant, string> = {
    default: '💬',
    success: '✅',
    destructive: '❌',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
    promise: '🔄'
  };

  return icons[variant] || icons.default;
}

/** Créer un groupe de toasts */
export function createToastGroup(groupId: string): {
  add: (options: ToastOptions) => string;
  dismissAll: () => void;
  getToasts: () => Toast[];
} {
  const groupToastIds: string[] = [];

  return {
    add: (options: ToastOptions) => {
      const id = toast({ ...options, id: `${groupId}-${groupToastIds.length}` });
      groupToastIds.push(id);
      return id;
    },
    dismissAll: () => {
      groupToastIds.forEach(id => dismissToast(id));
      groupToastIds.length = 0;
    },
    getToasts: () => toasts.filter(t => groupToastIds.includes(t.id))
  };
}

export default {
  toast,
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  loading: toastLoading,
  promise: toastPromise,
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
  update: updateToast,
  configure: configureToasts,
  subscribe: subscribeToasts,
  getToasts,
  getStats: getToastStats,
  variants: TOAST_VARIANTS
};
