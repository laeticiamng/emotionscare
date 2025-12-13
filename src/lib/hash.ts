// @ts-nocheck
/**
 * Hash - Utilitaires de hachage cryptographique
 * SHA-256, SHA-512, MD5 (compatibilité), HMAC et fonctions de dérivation
 */

/** Message d'erreur pour Web Crypto indisponible */
const WEB_CRYPTO_UNAVAILABLE_MESSAGE = 'Web Crypto SubtleCrypto not available';

/** Algorithmes de hachage supportés */
export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'SHA-1';

/** Format de sortie */
export type HashFormat = 'hex' | 'base64' | 'buffer';

/** Options de hachage */
export interface HashOptions {
  algorithm?: HashAlgorithm;
  format?: HashFormat;
  uppercase?: boolean;
}

/** Résultat de hachage */
export interface HashResult {
  hash: string | ArrayBuffer;
  algorithm: HashAlgorithm;
  format: HashFormat;
  inputLength: number;
  computeTime: number;
}

/** Options HMAC */
export interface HmacOptions {
  algorithm?: HashAlgorithm;
  format?: HashFormat;
  keyFormat?: 'raw' | 'base64' | 'hex';
}

/** Options de dérivation PBKDF2 */
export interface Pbkdf2Options {
  iterations?: number;
  keyLength?: number;
  algorithm?: HashAlgorithm;
  format?: HashFormat;
}

/** Stats d'utilisation */
export interface HashStats {
  totalHashes: number;
  byAlgorithm: Record<HashAlgorithm, number>;
  totalBytes: number;
  averageTime: number;
  errors: number;
}

// Stats globales
const stats: HashStats = {
  totalHashes: 0,
  byAlgorithm: {
    'SHA-256': 0,
    'SHA-384': 0,
    'SHA-512': 0,
    'SHA-1': 0
  },
  totalBytes: 0,
  averageTime: 0,
  errors: 0
};

/** Obtenir l'objet crypto */
function getCrypto(): Crypto {
  const cryptoObj: Crypto | undefined = (globalThis as unknown as { crypto?: Crypto }).crypto;

  if (!cryptoObj?.subtle) {
    throw new Error(WEB_CRYPTO_UNAVAILABLE_MESSAGE);
  }

  return cryptoObj;
}

/** Convertir ArrayBuffer en hex */
function bufferToHex(buffer: ArrayBuffer, uppercase: boolean = false): string {
  const hex = Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return uppercase ? hex.toUpperCase() : hex;
}

/** Convertir ArrayBuffer en base64 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Convertir hex en ArrayBuffer */
function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

/** Convertir base64 en ArrayBuffer */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/** Formater le résultat selon le format demandé */
function formatResult(
  buffer: ArrayBuffer,
  format: HashFormat,
  uppercase: boolean = false
): string | ArrayBuffer {
  switch (format) {
    case 'hex':
      return bufferToHex(buffer, uppercase);
    case 'base64':
      return bufferToBase64(buffer);
    case 'buffer':
      return buffer;
    default:
      return bufferToHex(buffer, uppercase);
  }
}

/** Mettre à jour les stats */
function updateStats(algorithm: HashAlgorithm, bytes: number, time: number, error: boolean = false): void {
  if (error) {
    stats.errors++;
    return;
  }

  stats.totalHashes++;
  stats.byAlgorithm[algorithm]++;
  stats.totalBytes += bytes;
  stats.averageTime = (stats.averageTime * (stats.totalHashes - 1) + time) / stats.totalHashes;
}

/**
 * sha256Hex — Web Crypto (SubtleCrypto) only.
 * Compatible navigateur, Deno (Edge), Node >= 18 (globalThis.crypto).
 */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof input !== 'string' || input.length === 0) {
    return '';
  }

  const cryptoObj = getCrypto();
  const startTime = performance.now();

  const data = new TextEncoder().encode(input);
  const digest = await cryptoObj.subtle.digest('SHA-256', data);

  const result = bufferToHex(digest);
  updateStats('SHA-256', data.byteLength, performance.now() - startTime);

  return result;
}

/** Hachage générique avec options */
export async function hash(
  input: string | ArrayBuffer,
  options: HashOptions = {}
): Promise<HashResult> {
  const algorithm = options.algorithm || 'SHA-256';
  const format = options.format || 'hex';
  const uppercase = options.uppercase || false;

  const cryptoObj = getCrypto();
  const startTime = performance.now();

  let data: ArrayBuffer;
  if (typeof input === 'string') {
    data = new TextEncoder().encode(input);
  } else {
    data = input;
  }

  try {
    const digest = await cryptoObj.subtle.digest(algorithm, data);
    const computeTime = performance.now() - startTime;

    updateStats(algorithm, data.byteLength, computeTime);

    return {
      hash: formatResult(digest, format, uppercase),
      algorithm,
      format,
      inputLength: data.byteLength,
      computeTime
    };
  } catch (error) {
    updateStats(algorithm, 0, 0, true);
    throw error;
  }
}

/** SHA-256 avec options */
export async function sha256(
  input: string | ArrayBuffer,
  options?: Omit<HashOptions, 'algorithm'>
): Promise<string | ArrayBuffer> {
  const result = await hash(input, { ...options, algorithm: 'SHA-256' });
  return result.hash;
}

/** SHA-384 */
export async function sha384(
  input: string | ArrayBuffer,
  options?: Omit<HashOptions, 'algorithm'>
): Promise<string | ArrayBuffer> {
  const result = await hash(input, { ...options, algorithm: 'SHA-384' });
  return result.hash;
}

/** SHA-512 */
export async function sha512(
  input: string | ArrayBuffer,
  options?: Omit<HashOptions, 'algorithm'>
): Promise<string | ArrayBuffer> {
  const result = await hash(input, { ...options, algorithm: 'SHA-512' });
  return result.hash;
}

/** SHA-1 (déprécié, à utiliser uniquement pour la compatibilité) */
export async function sha1(
  input: string | ArrayBuffer,
  options?: Omit<HashOptions, 'algorithm'>
): Promise<string | ArrayBuffer> {
  console.warn('SHA-1 is deprecated and should not be used for security purposes');
  const result = await hash(input, { ...options, algorithm: 'SHA-1' });
  return result.hash;
}

/** Hacher un fichier */
export async function hashFile(
  file: File | Blob,
  options: HashOptions = {}
): Promise<HashResult> {
  const buffer = await file.arrayBuffer();
  return hash(buffer, options);
}

/** HMAC - Hash-based Message Authentication Code */
export async function hmac(
  message: string | ArrayBuffer,
  key: string | ArrayBuffer,
  options: HmacOptions = {}
): Promise<string | ArrayBuffer> {
  const algorithm = options.algorithm || 'SHA-256';
  const format = options.format || 'hex';
  const keyFormat = options.keyFormat || 'raw';

  const cryptoObj = getCrypto();

  // Préparer la clé
  let keyData: ArrayBuffer;
  if (typeof key === 'string') {
    switch (keyFormat) {
      case 'hex':
        keyData = hexToBuffer(key);
        break;
      case 'base64':
        keyData = base64ToBuffer(key);
        break;
      default:
        keyData = new TextEncoder().encode(key);
    }
  } else {
    keyData = key;
  }

  // Importer la clé
  const cryptoKey = await cryptoObj.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );

  // Préparer le message
  let messageData: ArrayBuffer;
  if (typeof message === 'string') {
    messageData = new TextEncoder().encode(message);
  } else {
    messageData = message;
  }

  // Calculer le HMAC
  const signature = await cryptoObj.subtle.sign('HMAC', cryptoKey, messageData);

  return formatResult(signature, format);
}

/** Vérifier un HMAC */
export async function verifyHmac(
  message: string | ArrayBuffer,
  key: string | ArrayBuffer,
  expectedHmac: string | ArrayBuffer,
  options: HmacOptions = {}
): Promise<boolean> {
  const computed = await hmac(message, key, options);

  // Comparaison constante en temps
  const expected = typeof expectedHmac === 'string' ? expectedHmac : bufferToHex(expectedHmac);
  const actual = typeof computed === 'string' ? computed : bufferToHex(computed);

  if (expected.length !== actual.length) return false;

  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
  }

  return result === 0;
}

/** PBKDF2 - Password-Based Key Derivation Function 2 */
export async function pbkdf2(
  password: string,
  salt: string | ArrayBuffer,
  options: Pbkdf2Options = {}
): Promise<string | ArrayBuffer> {
  const iterations = options.iterations || 100000;
  const keyLength = options.keyLength || 32;
  const algorithm = options.algorithm || 'SHA-256';
  const format = options.format || 'hex';

  const cryptoObj = getCrypto();

  // Importer le mot de passe
  const passwordKey = await cryptoObj.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Préparer le sel
  let saltData: ArrayBuffer;
  if (typeof salt === 'string') {
    saltData = new TextEncoder().encode(salt);
  } else {
    saltData = salt;
  }

  // Dériver les bits
  const derivedBits = await cryptoObj.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations,
      hash: algorithm
    },
    passwordKey,
    keyLength * 8
  );

  return formatResult(derivedBits, format);
}

/** Générer un sel aléatoire */
export function generateSalt(length: number = 16): string {
  const cryptoObj = getCrypto();
  const bytes = new Uint8Array(length);
  cryptoObj.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
}

/** Générer un UUID v4 cryptographiquement sécurisé */
export function generateUUID(): string {
  const cryptoObj = getCrypto();
  const bytes = new Uint8Array(16);
  cryptoObj.getRandomValues(bytes);

  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant

  const hex = bufferToHex(bytes.buffer);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Générer des bytes aléatoires */
export function randomBytes(length: number): ArrayBuffer {
  const cryptoObj = getCrypto();
  const bytes = new Uint8Array(length);
  cryptoObj.getRandomValues(bytes);
  return bytes.buffer;
}

/** Générer une chaîne aléatoire */
export function randomString(length: number, charset?: string): string {
  const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const chars = charset || defaultCharset;
  const cryptoObj = getCrypto();

  const bytes = new Uint8Array(length);
  cryptoObj.getRandomValues(bytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

/** Comparer deux hashes (constant time) */
export function compareHashes(hash1: string, hash2: string): boolean {
  if (hash1.length !== hash2.length) return false;

  let result = 0;
  for (let i = 0; i < hash1.length; i++) {
    result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
  }

  return result === 0;
}

/** Hacher un mot de passe pour stockage */
export async function hashPassword(password: string, salt?: string): Promise<{
  hash: string;
  salt: string;
}> {
  const actualSalt = salt || generateSalt(32);
  const derivedKey = await pbkdf2(password, actualSalt, {
    iterations: 100000,
    keyLength: 32,
    algorithm: 'SHA-256',
    format: 'hex'
  });

  return {
    hash: derivedKey as string,
    salt: actualSalt
  };
}

/** Vérifier un mot de passe */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const result = await hashPassword(password, salt);
  return compareHashes(result.hash, hash);
}

/** Checksum simple (CRC32-like) */
export function checksum(input: string): string {
  let crc = 0xFFFFFFFF;

  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }

  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0');
}

/** Obtenir les statistiques */
export function getStats(): HashStats {
  return { ...stats };
}

/** Réinitialiser les statistiques */
export function resetStats(): void {
  stats.totalHashes = 0;
  stats.byAlgorithm = { 'SHA-256': 0, 'SHA-384': 0, 'SHA-512': 0, 'SHA-1': 0 };
  stats.totalBytes = 0;
  stats.averageTime = 0;
  stats.errors = 0;
}

/** Vérifier si Web Crypto est disponible */
export function isWebCryptoAvailable(): boolean {
  try {
    getCrypto();
    return true;
  } catch {
    return false;
  }
}

export const webCryptoUnavailableMessage = WEB_CRYPTO_UNAVAILABLE_MESSAGE;

export default {
  sha256Hex,
  sha256,
  sha384,
  sha512,
  sha1,
  hash,
  hashFile,
  hmac,
  verifyHmac,
  pbkdf2,
  generateSalt,
  generateUUID,
  randomBytes,
  randomString,
  compareHashes,
  hashPassword,
  verifyPassword,
  checksum,
  getStats,
  resetStats,
  isWebCryptoAvailable,
  bufferToHex,
  bufferToBase64,
  hexToBuffer,
  base64ToBuffer
};
