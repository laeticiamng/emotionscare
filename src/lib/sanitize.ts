/**
 * Utilitaires de sanitisation HTML pour les exports et injections de contenu.
 * À utiliser systématiquement avant tout document.write() ou dangerouslySetInnerHTML.
 */

/**
 * Échappe les caractères HTML spéciaux pour prévenir les injections XSS.
 * Utilisable pour le contenu injecté dans des templates HTML (document.write, innerHTML).
 */
export function escapeHtml(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
