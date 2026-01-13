/**
 * Shared Utils - Fonctions utilitaires génériques
 */

// ===== STRING UTILS =====
export const capitalize = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1);

export const truncate = (str: string, length: number): string =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// ===== NUMBER UTILS =====
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const formatNumber = (num: number, locale = 'fr-FR'): string =>
  new Intl.NumberFormat(locale).format(num);

export const formatPercent = (value: number, decimals = 0): string =>
  `${(value * 100).toFixed(decimals)}%`;

// ===== DATE UTILS =====
export const formatDate = (date: Date | string, locale = 'fr-FR'): string =>
  new Date(date).toLocaleDateString(locale);

export const formatDateTime = (date: Date | string, locale = 'fr-FR'): string =>
  new Date(date).toLocaleString(locale);

export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(date);
};

// ===== ARRAY UTILS =====
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> =>
  array.reduce((acc, item) => {
    const group = String(item[key]);
    return { ...acc, [group]: [...(acc[group] || []), item] };
  }, {} as Record<string, T[]>);

export const uniqueBy = <T>(array: T[], key: keyof T): T[] =>
  array.filter((item, index, self) =>
    index === self.findIndex(t => t[key] === item[key])
  );

export const shuffle = <T>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

// ===== OBJECT UTILS =====
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> =>
  keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Pick<T, K>);

// ===== ASYNC UTILS =====
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await sleep(delay);
    return retry(fn, attempts - 1, delay * 2);
  }
};

// ===== VALIDATION UTILS =====
export const isEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'object' && Object.keys(value).length === 0);

// ===== CSS UTILS =====
export { cn } from '@/lib/utils';
