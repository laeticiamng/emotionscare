const encoder = new TextEncoder();

let cachedKey: CryptoKey | null = null;
let cachedSecret: string | null = null;

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

async function getKey(secret: string): Promise<CryptoKey> {
  if (cachedKey && cachedSecret === secret) {
    return cachedKey;
  }

  const keyData = encoder.encode(secret);
  cachedKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign'],
  );
  cachedSecret = secret;
  return cachedKey;
}

export async function signPayload(secret: string | null | undefined, payload: string): Promise<string | null> {
  if (!secret || secret.length === 0) {
    return null;
  }

  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(signature);
}

export async function signJsonPayload(secret: string | null | undefined, value: unknown): Promise<string | null> {
  try {
    const payload = JSON.stringify(value);
    return signPayload(secret, payload);
  } catch {
    return null;
  }
}
