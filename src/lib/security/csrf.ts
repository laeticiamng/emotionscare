/**
 * Utilitaire CSRF pour protection des requêtes mutantes
 * Génère et valide des tokens CSRF pour les formulaires et API
 */

const CSRF_TOKEN_KEY = 'emotionscare_csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

/**
 * Génère un token CSRF cryptographiquement sûr
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  } catch {
    // sessionStorage unavailable
  }

  return token;
}

/**
 * Récupère le token CSRF actuel ou en génère un nouveau
 */
export function getCsrfToken(): string {
  try {
    const existing = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (existing) return existing;
  } catch {
    // sessionStorage unavailable
  }
  return generateCsrfToken();
}

/**
 * Valide un token CSRF
 */
export function validateCsrfToken(token: string): boolean {
  try {
    const stored = sessionStorage.getItem(CSRF_TOKEN_KEY);
    return Boolean(stored && stored === token);
  } catch {
    return false;
  }
}

/**
 * Ajoute le header CSRF à un objet Headers/RequestInit
 */
export function withCsrfHeader(headers: Record<string, string> = {}): Record<string, string> {
  return {
    ...headers,
    [CSRF_HEADER]: getCsrfToken(),
  };
}

/**
 * Crée un input hidden CSRF pour les formulaires HTML
 */
export function csrfInputValue(): string {
  return getCsrfToken();
}

/**
 * Rafraîchit le token CSRF (à appeler après chaque requête mutante réussie)
 */
export function rotateCsrfToken(): string {
  return generateCsrfToken();
}

export { CSRF_HEADER, CSRF_TOKEN_KEY };
