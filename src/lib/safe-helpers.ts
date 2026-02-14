/**
 * Helpers sécurisés pour éviter l'erreur "Cannot read properties of undefined (reading 'add')"
 */

import { logger } from '@/lib/logger';

/**
 * Ensure qu'un Set existe toujours, même si undefined
 */
export function ensureSet<T>(s?: Set<T> | null): Set<T> {
  return s instanceof Set ? s : new Set<T>();
}

/**
 * Ajoute un élément à un Set de manière sécurisée
 */
export function safeAdd<T>(s: Set<T> | undefined | null, value: T): Set<T> {
  const safeSet = ensureSet(s);
  safeSet.add(value);
  return safeSet;
}

/**
 * Ajoute des classes CSS de manière sécurisée
 */
export function safeClassAdd(
  element: Element | HTMLElement | null | undefined,
  ...classNames: string[]
): void {
  if (!element || !element.classList) {
    logger.warn('[safeClassAdd] Element or classList is undefined/null', { element, classNames }, 'UI');
    return;
  }
  
  try {
    element.classList.add(...classNames.filter(Boolean));
  } catch (error) {
    logger.error('[safeClassAdd] Failed to add classes', error as Error, 'UI');
  }
}

/**
 * Retire des classes CSS de manière sécurisée
 */
export function safeClassRemove(
  element: Element | HTMLElement | null | undefined,
  ...classNames: string[]
): void {
  if (!element || !element.classList) {
    logger.warn('[safeClassRemove] Element or classList is undefined/null', { element, classNames }, 'UI');
    return;
  }
  
  try {
    element.classList.remove(...classNames.filter(Boolean));
  } catch (error) {
    logger.error('[safeClassRemove] Failed to remove classes', error as Error, 'UI');
  }
}

/**
 * Toggle des classes CSS de manière sécurisée
 */
export function safeClassToggle(
  element: Element | HTMLElement | null | undefined,
  className: string,
  force?: boolean
): boolean {
  if (!element || !element.classList || !className) {
    logger.warn('[safeClassToggle] Element, classList or className is invalid', { element, className }, 'UI');
    return false;
  }
  
  try {
    return element.classList.toggle(className, force);
  } catch (error) {
    logger.error('[safeClassToggle] Failed to toggle class', error as Error, 'UI');
    return false;
  }
}

/**
 * Vérifie qu'une valeur existe, sinon lève une erreur explicite en dev
 */
export function must<T>(
  value: T | null | undefined,
  message = 'Required value is missing'
): T {
  if (value === null || value === undefined) {
    const error = new Error(`[must] ${message}`);
    logger.error('[must] Required value is missing', error, 'SYSTEM');
    
    if (import.meta.env.MODE === 'development') {
      throw error;
    }
    
    // En production, on retourne une valeur par défaut selon le type
    return {} as T;
  }
  
  return value;
}

/**
 * Ensure qu'un Map existe toujours
 */
export function ensureMap<K, V>(m?: Map<K, V> | null): Map<K, V> {
  return m instanceof Map ? m : new Map<K, V>();
}

/**
 * Ajoute un élément à un Map de manière sécurisée
 */
export function safeMapSet<K, V>(
  map: Map<K, V> | undefined | null,
  key: K,
  value: V
): Map<K, V> {
  const safeMap = ensureMap(map);
  safeMap.set(key, value);
  return safeMap;
}

/**
 * Ensure qu'un Array existe toujours
 */
export function ensureArray<T>(arr?: T[] | null): T[] {
  return Array.isArray(arr) ? arr : [];
}

/**
 * Ajoute un élément à un Array de manière sécurisée
 */
export function safePush<T>(arr: T[] | undefined | null, ...items: T[]): T[] {
  const safeArray = ensureArray(arr);
  safeArray.push(...items);
  return safeArray;
}

/**
 * Obtient un élément DOM de manière sécurisée
 */
export function safeGetElement(
  selector: string,
  context: Document | Element = document
): Element | null {
  try {
    return context.querySelector(selector);
  } catch (error) {
    logger.error('[safeGetElement] Invalid selector', error as Error, 'UI');
    return null;
  }
}

/**
 * Obtient la racine du document de manière sécurisée
 */
export function safeGetDocumentRoot(): HTMLElement {
  return document.documentElement || document.body || document.createElement('html');
}

/**
 * Wrapper sécurisé pour les opérations DOM
 */
export function safeDOM<T>(
  operation: () => T,
  fallback?: T,
  context = 'DOM operation'
): T | undefined {
  try {
    return operation();
  } catch (error) {
    logger.error(`[safeDOM] ${context} failed`, error as Error, 'UI');
    return fallback;
  }
}

/**
 * Type guard pour vérifier qu'un objet a une méthode add
 */
export function hasAddMethod<T>(obj: unknown): obj is { add: (item: T) => void } {
  return Boolean(obj && typeof (obj as { add?: unknown }).add === 'function');
}

/**
 * Ajoute un élément à n'importe quel objet avec une méthode add de manière sécurisée
 */
export function safeAddToCollection<T>(
  collection: unknown,
  item: T,
  context = 'collection'
): boolean {
  if (!hasAddMethod<T>(collection)) {
    logger.warn(`[safeAddToCollection] Object doesn't have add method`, { collection, context }, 'SYSTEM');
    return false;
  }
  
  try {
    collection.add(item);
    return true;
  } catch (error) {
    logger.error(`[safeAddToCollection] Failed to add to ${context}`, error as Error, 'SYSTEM');
    return false;
  }
}