const HEX_TABLE = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

function resolveSubtleCrypto(): SubtleCrypto | null {
  const globalCrypto = typeof globalThis !== "undefined" ? (globalThis as typeof globalThis & { webcrypto?: Crypto }) : undefined;
  if (globalCrypto?.crypto?.subtle) {
    return globalCrypto.crypto.subtle;
  }

  if (globalCrypto?.webcrypto?.subtle) {
    return globalCrypto.webcrypto.subtle;
  }

  if (typeof globalThis !== "undefined" && (globalThis as { crypto?: Crypto }).crypto?.subtle) {
    return (globalThis as { crypto?: Crypto }).crypto!.subtle;
  }

  return null;
}

function toHex(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer);
  let hex = "";
  for (let index = 0; index < view.length; index += 1) {
    hex += HEX_TABLE[view[index]!];
  }
  return hex;
}

function fallbackHash(value: string): string {
  if (!value.length) {
    return "";
  }

  // Non cryptographique : suffisant pour des identifiants anonymisés en fallback.
  const encoder = new TextEncoder();
  const input = encoder.encode(value);
  const bytes = new Uint8Array(32);

  for (let index = 0; index < bytes.length; index += 1) {
    const charCode = input[index % input.length] ?? index;
    const prev = bytes[(index + bytes.length - 1) % bytes.length] ?? 0;
    const mixed = prev ^ charCode ^ ((index * 31) & 0xff);
    bytes[index] = (mixed + ((mixed << 3) & 0xff)) & 0xff;
  }

  return Array.from(bytes, byte => HEX_TABLE[byte]).join("");
}

export async function hashString(value: string): Promise<string> {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }

  const subtle = resolveSubtleCrypto();

  if (!subtle) {
    return fallbackHash(value);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await subtle.digest("SHA-256", data);
  return toHex(digest);
}

export const __hashInternals = {
  resolveSubtleCrypto,
  fallbackHash,
};
