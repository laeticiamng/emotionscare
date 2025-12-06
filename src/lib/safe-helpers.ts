/**
 * Helpers sécurisés pour éviter l'erreur "Cannot read properties of undefined (reading 'add')"
 */

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
    console.warn('[safeClassAdd] Element or classList is undefined/null', { element, classNames });
    return;
  }
  
  try {
    element.classList.add(...classNames.filter(Boolean));
  } catch (error) {
    console.error('[safeClassAdd] Failed to add classes', { error, element, classNames });
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
    console.warn('[safeClassRemove] Element or classList is undefined/null', { element, classNames });
    return;
  }
  
  try {
    element.classList.remove(...classNames.filter(Boolean));
  } catch (error) {
    console.error('[safeClassRemove] Failed to remove classes', { error, element, classNames });
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
    console.warn('[safeClassToggle] Element, classList or className is invalid', { element, className });
    return false;
  }
  
  try {
    return element.classList.toggle(className, force);
  } catch (error) {
    console.error('[safeClassToggle] Failed to toggle class', { error, element, className });
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
    console.error(error);
    
    if (process.env.NODE_ENV === 'development') {
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
    console.error('[safeGetElement] Invalid selector', { selector, error });
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
    console.error(`[safeDOM] ${context} failed`, error);
    return fallback;
  }
}

/**
 * Type guard pour vérifier qu'un objet a une méthode add
 */
export function hasAddMethod<T>(obj: any): obj is { add: (item: T) => any } {
  return Boolean(obj && typeof obj.add === 'function');
}

/**
 * Ajoute un élément à n'importe quel objet avec une méthode add de manière sécurisée
 */
export function safeAddToCollection<T>(
  collection: any,
  item: T,
  context = 'collection'
): boolean {
  if (!hasAddMethod<T>(collection)) {
    console.warn(`[safeAddToCollection] Object doesn't have add method`, { collection, context });
    return false;
  }
  
  try {
    collection.add(item);
    return true;
  } catch (error) {
    console.error(`[safeAddToCollection] Failed to add to ${context}`, { error, collection, item });
    return false;
  }
}