/**
 * Client-Side Key Security Helper
 * Implements AES-256-GCM authenticated encryption and key masking.
 */

const SALT = new Uint8Array([79, 119, 110, 65, 73, 95, 83, 101, 99, 117, 114, 101, 95, 50, 48, 50]); // "OwnAI_Secure_202"

async function deriveKey(masterSecret: string = 'OwnAI_Client_Vault_Master_2026'): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterSecret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: SALT,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptKey(rawKey: string): Promise<string> {
  if (!rawKey) return '';
  try {
    const key = await deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(rawKey);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    let binary = '';
    for (let i = 0; i < combined.length; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  } catch (err) {
    console.warn('Encryption fallback to base64 encoding:', err);
    return btoa(rawKey);
  }
}

export async function decryptKey(encryptedBase64: string): Promise<string> {
  if (!encryptedBase64) return '';
  try {
    const binary = atob(encryptedBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (bytes.length < 12) {
      return atob(encryptedBase64);
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);

    const key = await deriveKey();
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    try {
      return atob(encryptedBase64);
    } catch {
      return encryptedBase64;
    }
  }
}

export function maskKey(rawKey: string): string {
  const trimmed = rawKey.trim();
  if (trimmed.length <= 8) {
    return '••••••••';
  }
  const prefix = trimmed.slice(0, 6);
  const suffix = trimmed.slice(-4);
  return `${prefix}••••••••${suffix}`;
}
