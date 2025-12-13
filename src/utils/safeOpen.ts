// @ts-nocheck
/**
 * SafeOpen - Utilitaires d'ouverture sécurisée d'URLs et de liens
 * Protection contre les attaques XSS, validation d'URLs et gestion des popups
 */

import { logger } from '@/lib/logger';

/** Configuration de SafeOpen */
export interface SafeOpenConfig {
  allowedProtocols: string[];
  allowedDomains: string[];
  blockedDomains: string[];
  enableLogging: boolean;
  confirmExternal: boolean;
  sanitizeUrls: boolean;
  maxRedirects: number;
  defaultTarget: WindowTarget;
  noOpenerReferrer: boolean;
}

/** Types de cible de fenêtre */
export type WindowTarget = '_blank' | '_self' | '_parent' | '_top' | string;

/** Résultat d'ouverture */
export interface OpenResult {
  success: boolean;
  url: string;
  target: WindowTarget;
  window?: Window | null;
  error?: string;
  blocked?: boolean;
  sanitized?: boolean;
}

/** Informations sur une URL */
export interface UrlInfo {
  original: string;
  sanitized: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  isExternal: boolean;
  isSecure: boolean;
  isTrusted: boolean;
  isBlocked: boolean;
}

/** Stats d'utilisation */
export interface SafeOpenStats {
  totalOpened: number;
  successfulOpens: number;
  blockedOpens: number;
  sanitizedUrls: number;
  byProtocol: Record<string, number>;
  byDomain: Record<string, number>;
  lastOpenTime?: number;
}

// Configuration par défaut
const DEFAULT_CONFIG: SafeOpenConfig = {
  allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:', 'sms:'],
  allowedDomains: [],
  blockedDomains: [],
  enableLogging: true,
  confirmExternal: false,
  sanitizeUrls: true,
  maxRedirects: 5,
  defaultTarget: '_blank',
  noOpenerReferrer: true
};

// État global
let config: SafeOpenConfig = { ...DEFAULT_CONFIG };
const stats: SafeOpenStats = {
  totalOpened: 0,
  successfulOpens: 0,
  blockedOpens: 0,
  sanitizedUrls: 0,
  byProtocol: {},
  byDomain: {}
};

// Cache des domaines de confiance
const trustedDomainsCache = new Set<string>();

/** Configurer SafeOpen */
export function configure(userConfig: Partial<SafeOpenConfig>): void {
  config = { ...config, ...userConfig };

  // Reconstruire le cache des domaines de confiance
  trustedDomainsCache.clear();
  config.allowedDomains.forEach(d => trustedDomainsCache.add(d.toLowerCase()));
}

/** Ajouter des domaines de confiance */
export function addTrustedDomains(domains: string[]): void {
  domains.forEach(d => {
    const lower = d.toLowerCase();
    if (!config.allowedDomains.includes(lower)) {
      config.allowedDomains.push(lower);
    }
    trustedDomainsCache.add(lower);
  });
}

/** Bloquer des domaines */
export function blockDomains(domains: string[]): void {
  domains.forEach(d => {
    const lower = d.toLowerCase();
    if (!config.blockedDomains.includes(lower)) {
      config.blockedDomains.push(lower);
    }
  });
}

/** Valider une URL */
export function validateUrl(url: string): { valid: boolean; reason?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, reason: 'URL is empty or not a string' };
  }

  try {
    const urlObj = new URL(url);

    // Vérifier le protocole
    if (!config.allowedProtocols.includes(urlObj.protocol)) {
      return { valid: false, reason: `Protocol ${urlObj.protocol} not allowed` };
    }

    // Vérifier les domaines bloqués
    const hostname = urlObj.hostname.toLowerCase();
    if (config.blockedDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
      return { valid: false, reason: `Domain ${hostname} is blocked` };
    }

    // Vérifier les domaines autorisés (si configuré)
    if (config.allowedDomains.length > 0) {
      const isAllowed = config.allowedDomains.some(
        d => hostname === d || hostname.endsWith(`.${d}`)
      );
      if (!isAllowed) {
        return { valid: false, reason: `Domain ${hostname} not in allowed list` };
      }
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid URL format' };
  }
}

/** Sanitiser une URL */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);

    // Supprimer les caractères dangereux
    let sanitized = urlObj.toString();

    // Supprimer les scripts javascript:
    if (urlObj.protocol === 'javascript:') {
      return '';
    }

    // Supprimer les data: URLs sauf pour les images
    if (urlObj.protocol === 'data:' && !url.startsWith('data:image/')) {
      return '';
    }

    // Échapper les caractères spéciaux dans le pathname
    sanitized = sanitized.replace(/[<>"']/g, char => {
      switch (char) {
        case '<': return '%3C';
        case '>': return '%3E';
        case '"': return '%22';
        case "'": return '%27';
        default: return char;
      }
    });

    stats.sanitizedUrls++;
    return sanitized;
  } catch {
    return '';
  }
}

/** Analyser une URL */
export function analyzeUrl(url: string): UrlInfo {
  const info: UrlInfo = {
    original: url,
    sanitized: '',
    protocol: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
    isExternal: false,
    isSecure: false,
    isTrusted: false,
    isBlocked: false
  };

  try {
    const urlObj = new URL(url);
    info.sanitized = sanitizeUrl(url);
    info.protocol = urlObj.protocol;
    info.hostname = urlObj.hostname;
    info.port = urlObj.port;
    info.pathname = urlObj.pathname;
    info.search = urlObj.search;
    info.hash = urlObj.hash;
    info.isSecure = urlObj.protocol === 'https:';

    // Vérifier si externe
    if (typeof window !== 'undefined') {
      info.isExternal = urlObj.hostname !== window.location.hostname;
    }

    // Vérifier si de confiance
    const hostname = urlObj.hostname.toLowerCase();
    info.isTrusted = config.allowedDomains.length === 0 ||
      config.allowedDomains.some(d => hostname === d || hostname.endsWith(`.${d}`));

    // Vérifier si bloqué
    info.isBlocked = config.blockedDomains.some(
      d => hostname === d || hostname.endsWith(`.${d}`)
    );
  } catch {
    // URL invalide
  }

  return info;
}

/** Ouvrir une URL de manière sécurisée */
export const safeOpen = (url: string, target: WindowTarget = '_blank'): boolean => {
  const result = safeOpenWithResult(url, target);
  return result.success;
};

/** Ouvrir une URL avec résultat détaillé */
export function safeOpenWithResult(url: string, target?: WindowTarget): OpenResult {
  const effectiveTarget = target || config.defaultTarget;
  stats.totalOpened++;

  const result: OpenResult = {
    success: false,
    url,
    target: effectiveTarget
  };

  try {
    // Valider l'URL
    const validation = validateUrl(url);
    if (!validation.valid) {
      result.error = validation.reason;
      stats.blockedOpens++;

      if (config.enableLogging) {
        logger.warn('URL blocked', { url, reason: validation.reason }, 'SAFE_OPEN');
      }
      return result;
    }

    // Sanitiser si configuré
    const finalUrl = config.sanitizeUrls ? sanitizeUrl(url) : url;
    if (!finalUrl) {
      result.error = 'URL could not be sanitized';
      result.blocked = true;
      stats.blockedOpens++;
      return result;
    }

    result.url = finalUrl;
    result.sanitized = finalUrl !== url;

    // Analyser l'URL pour les stats
    const urlInfo = analyzeUrl(finalUrl);

    // Confirmation pour les liens externes
    if (config.confirmExternal && urlInfo.isExternal) {
      if (typeof window !== 'undefined' && !window.confirm(`Ouvrir le lien externe vers ${urlInfo.hostname} ?`)) {
        result.error = 'User cancelled';
        return result;
      }
    }

    // Construire les features de la fenêtre
    const features = config.noOpenerReferrer ? 'noopener,noreferrer' : '';

    // Ouvrir la fenêtre
    const newWindow = window.open(finalUrl, effectiveTarget, features);

    if (newWindow) {
      result.success = true;
      result.window = newWindow;
      stats.successfulOpens++;

      // Stats par protocole et domaine
      stats.byProtocol[urlInfo.protocol] = (stats.byProtocol[urlInfo.protocol] || 0) + 1;
      stats.byDomain[urlInfo.hostname] = (stats.byDomain[urlInfo.hostname] || 0) + 1;
      stats.lastOpenTime = Date.now();

      if (config.enableLogging) {
        logger.info('URL opened', { url: finalUrl, target: effectiveTarget }, 'SAFE_OPEN');
      }
    } else {
      result.error = 'Popup blocked';
      result.blocked = true;
      stats.blockedOpens++;

      if (config.enableLogging) {
        logger.warn('Popup blocked', { url: finalUrl }, 'SAFE_OPEN');
      }
    }

    return result;

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';

    if (config.enableLogging) {
      logger.error('Error opening URL', error as Error, 'SAFE_OPEN');
    }

    return result;
  }
}

/** Ouvrir un lien mailto */
export function openEmail(email: string, options?: {
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}): OpenResult {
  let url = `mailto:${encodeURIComponent(email)}`;

  if (options) {
    const params = new URLSearchParams();
    if (options.subject) params.set('subject', options.subject);
    if (options.body) params.set('body', options.body);
    if (options.cc) params.set('cc', options.cc);
    if (options.bcc) params.set('bcc', options.bcc);

    const paramString = params.toString();
    if (paramString) {
      url += `?${paramString}`;
    }
  }

  return safeOpenWithResult(url, '_self');
}

/** Ouvrir un lien téléphonique */
export function openPhone(phone: string): OpenResult {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return safeOpenWithResult(`tel:${cleaned}`, '_self');
}

/** Ouvrir un lien SMS */
export function openSms(phone: string, message?: string): OpenResult {
  const cleaned = phone.replace(/[^\d+]/g, '');
  let url = `sms:${cleaned}`;

  if (message) {
    url += `?body=${encodeURIComponent(message)}`;
  }

  return safeOpenWithResult(url, '_self');
}

/** Copier une URL dans le presse-papiers */
export async function copyUrl(url: string): Promise<boolean> {
  try {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) return false;

    await navigator.clipboard.writeText(sanitized);

    if (config.enableLogging) {
      logger.info('URL copied', { url: sanitized }, 'SAFE_OPEN');
    }

    return true;
  } catch (error) {
    if (config.enableLogging) {
      logger.error('Failed to copy URL', error as Error, 'SAFE_OPEN');
    }
    return false;
  }
}

/** Partager une URL (Web Share API) */
export async function shareUrl(url: string, options?: {
  title?: string;
  text?: string;
}): Promise<boolean> {
  if (!navigator.share) {
    // Fallback: copier dans le presse-papiers
    return copyUrl(url);
  }

  try {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) return false;

    await navigator.share({
      url: sanitized,
      title: options?.title,
      text: options?.text
    });

    if (config.enableLogging) {
      logger.info('URL shared', { url: sanitized }, 'SAFE_OPEN');
    }

    return true;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      // L'utilisateur a annulé
      return false;
    }

    if (config.enableLogging) {
      logger.error('Failed to share URL', error as Error, 'SAFE_OPEN');
    }

    return false;
  }
}

/** Télécharger une URL */
export function downloadUrl(url: string, filename?: string): boolean {
  try {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) return false;

    const a = document.createElement('a');
    a.href = sanitized;
    a.download = filename || '';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (config.enableLogging) {
      logger.info('URL download initiated', { url: sanitized, filename }, 'SAFE_OPEN');
    }

    return true;
  } catch (error) {
    if (config.enableLogging) {
      logger.error('Failed to download URL', error as Error, 'SAFE_OPEN');
    }
    return false;
  }
}

/** Créer un lien sécurisé (pour insertion dans le DOM) */
export function createSafeLink(url: string, text: string, options?: {
  target?: WindowTarget;
  className?: string;
  rel?: string;
}): HTMLAnchorElement | null {
  try {
    const sanitized = sanitizeUrl(url);
    if (!sanitized) return null;

    const a = document.createElement('a');
    a.href = sanitized;
    a.textContent = text;

    if (options?.target) {
      a.target = options.target;
    }

    if (options?.className) {
      a.className = options.className;
    }

    // Sécurité: toujours ajouter noopener noreferrer pour _blank
    if (a.target === '_blank' || config.noOpenerReferrer) {
      a.rel = options?.rel || 'noopener noreferrer';
    }

    return a;
  } catch {
    return null;
  }
}

/** Extraire les URLs d'un texte */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;
  const matches = text.match(urlRegex) || [];
  return matches.filter(url => validateUrl(url).valid);
}

/** Vérifier si une URL est relative */
export function isRelativeUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

/** Convertir une URL relative en absolue */
export function toAbsoluteUrl(relativeUrl: string, base?: string): string {
  try {
    const baseUrl = base || (typeof window !== 'undefined' ? window.location.origin : '');
    return new URL(relativeUrl, baseUrl).toString();
  } catch {
    return relativeUrl;
  }
}

/** Obtenir les statistiques */
export function getStats(): SafeOpenStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetStats(): void {
  stats.totalOpened = 0;
  stats.successfulOpens = 0;
  stats.blockedOpens = 0;
  stats.sanitizedUrls = 0;
  stats.byProtocol = {};
  stats.byDomain = {};
  stats.lastOpenTime = undefined;
}

/** Obtenir la configuration actuelle */
export function getConfig(): SafeOpenConfig {
  return { ...config };
}

/** Vérifier si le navigateur supporte window.open */
export function supportsPopups(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const test = window.open('', '_blank', 'width=1,height=1');
    if (test) {
      test.close();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Vérifier si le navigateur supporte Web Share API */
export function supportsWebShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

export default {
  safeOpen,
  safeOpenWithResult,
  openEmail,
  openPhone,
  openSms,
  copyUrl,
  shareUrl,
  downloadUrl,
  createSafeLink,
  extractUrls,
  validateUrl,
  sanitizeUrl,
  analyzeUrl,
  isRelativeUrl,
  toAbsoluteUrl,
  configure,
  addTrustedDomains,
  blockDomains,
  getStats,
  resetStats,
  getConfig,
  supportsPopups,
  supportsWebShare
};
