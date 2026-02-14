/**
 * Secure Storage - Wrapper pour localStorage avec chiffrement
 * Conforme Art. 32 RGPD (sécurité des traitements)
 * 
 * IMPORTANT: N'utiliser que pour données non-critiques côté client
 * Les données sensibles (santé) doivent rester côté serveur avec RLS
 */

import { logger } from '@/lib/logger';

// Clé de chiffrement dérivée du domaine (protection basique, pas crypto forte)
const getEncryptionKey = async (): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(window.location.hostname + '_emotionscare_v1'),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('emotionscare_salt_2025'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Chiffrer une valeur
const encryptValue = async (value: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const key = await getEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(value)
    );

    // Combiner IV + données chiffrées en base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    logger.error('[SecureStorage] Encryption failed', error as Error, 'SYSTEM');
    throw new Error('Encryption failed');
  }
};

// Déchiffrer une valeur
const decryptValue = async (encrypted: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    logger.error('[SecureStorage] Decryption failed', error as Error, 'SYSTEM');
    throw new Error('Decryption failed');
  }
};

/**
 * Stocker une valeur de manière sécurisée (chiffrée)
 * @param key - Clé de stockage
 * @param value - Valeur à stocker (sera stringifiée si objet)
 */
export const setSecureItem = async (key: string, value: unknown): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    const encrypted = await encryptValue(stringValue);
    window.localStorage.setItem(`_sec_${key}`, encrypted);
  } catch (error) {
    logger.error(`[SecureStorage] Failed to set ${key}`, error as Error, 'SYSTEM');
    throw error;
  }
};

/**
 * Récupérer une valeur sécurisée (déchiffrée)
 * @param key - Clé de stockage
 * @returns Valeur déchiffrée ou null si non trouvée
 */
export const getSecureItem = async <T = unknown>(key: string): Promise<T | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const encrypted = window.localStorage.getItem(`_sec_${key}`);
    if (!encrypted) {
      return null;
    }

    const decrypted = await decryptValue(encrypted);
    
    // Tenter de parser en JSON si possible
    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted as T;
    }
  } catch (error) {
    logger.warn(`[SecureStorage] Failed to get ${key}`, error as Error, 'SYSTEM');
    return null;
  }
};

/**
 * Supprimer une valeur sécurisée
 * @param key - Clé de stockage
 */
export const removeSecureItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(`_sec_${key}`);
  } catch (error) {
    logger.warn(`[SecureStorage] Failed to remove ${key}`, error as Error, 'SYSTEM');
  }
};

/**
 * Vérifier si une clé existe
 * @param key - Clé de stockage
 */
export const hasSecureItem = (key: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(`_sec_${key}`) !== null;
};

/**
 * Nettoyer toutes les valeurs sécurisées
 */
export const clearSecureStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith('_sec_')) {
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    logger.warn('[SecureStorage] Failed to clear', error as Error, 'SYSTEM');
  }
};

/**
 * Hook React pour utiliser le secure storage
 */
import { useState, useEffect } from 'react';

export const useSecureStorage = <T = unknown>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      setLoading(true);
      try {
        const stored = await getSecureItem<T>(key);
        if (stored !== null) {
          setValue(stored);
        }
      } catch (error) {
        logger.error(`[useSecureStorage] Load error for ${key}`, error as Error, 'SYSTEM');
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setStoredValue = async (newValue: T) => {
    try {
      setValue(newValue);
      await setSecureItem(key, newValue);
    } catch (error) {
      logger.error(`[useSecureStorage] Set error for ${key}`, error as Error, 'SYSTEM');
      throw error;
    }
  };

  return [value, setStoredValue, loading];
};

// ═══════════════════════════════════════════════════════════
// MIGRATION: Migrer localStorage existant vers secure storage
// ═══════════════════════════════════════════════════════════

/**
 * Migrer une clé localStorage non chiffrée vers secure storage
 * @param oldKey - Ancienne clé localStorage
 * @param newKey - Nouvelle clé secure storage (optionnel, par défaut = oldKey)
 */
export const migrateToSecureStorage = async (
  oldKey: string,
  newKey?: string
): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const targetKey = newKey || oldKey;
    const oldValue = window.localStorage.getItem(oldKey);
    
    if (!oldValue) {
      return false;
    }

    // Stocker en sécurisé
    await setSecureItem(targetKey, oldValue);
    
    // Supprimer l'ancienne valeur non chiffrée
    window.localStorage.removeItem(oldKey);
    
    logger.info(`[SecureStorage] Migrated ${oldKey} to secure storage`, {}, 'SYSTEM');
    return true;
  } catch (error) {
    logger.error(`[SecureStorage] Migration failed for ${oldKey}`, error as Error, 'SYSTEM');
    return false;
  }
};

/**
 * AVERTISSEMENT IMPORTANT:
 * 
 * Ce système de chiffrement côté client offre une protection BASIQUE contre:
 * - Lecture accidentelle dans DevTools
 * - Scripts malveillants tiers sur le même domaine
 * 
 * Il NE PROTÈGE PAS contre:
 * - Attaques XSS (le JS malveillant peut déchiffrer)
 * - Accès physique à la machine
 * - Débogueur avancé
 * 
 * Pour les données vraiment sensibles (santé, paiement):
 * - NE JAMAIS stocker côté client
 * - TOUJOURS utiliser Supabase avec RLS
 * - Minimiser la durée de vie des tokens
 */
