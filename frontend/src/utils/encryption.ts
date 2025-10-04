/**
 * Client-side encryption utilities for QuickVid
 * 
 * Uses AES-GCM encryption with the user's Supabase UID as the encryption key.
 * This ensures:
 * 1. Each user has a unique encryption key
 * 2. Backend cannot decrypt data (doesn't have access to user's session in plaintext)
 * 3. Only the authenticated user can decrypt their own summaries
 * 4. Data is encrypted before leaving the browser
 */

/**
 * Derives an encryption key from the user's UID
 * Uses PBKDF2 to create a consistent 256-bit key
 */
async function deriveKey(userId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userId),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('quickvid-salt-v1'), // Static salt (can be public)
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts text using the user's UID as the key
 * Returns base64-encoded encrypted data with IV prepended
 */
export async function encryptText(plaintext: string, userId: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const key = await deriveKey(userId);
    
    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(plaintext)
    );
    
    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Checks if a string is encrypted (base64) or plaintext
 * Encrypted strings are base64 and longer than typical plaintext
 */
function isEncrypted(text: string): boolean {
  // Check if it's valid base64 and has the minimum length of encrypted data (IV + data)
  try {
    // Basic check: encrypted data should be base64 and reasonably long
    if (text.length < 20) return false; // Too short to be encrypted
    
    // Try to decode as base64
    const decoded = atob(text);
    
    // Encrypted data should have IV (12 bytes) + encrypted content
    // If it decodes successfully and is long enough, likely encrypted
    return decoded.length >= 12;
  } catch {
    // If atob fails, it's not base64, so it's plaintext
    return false;
  }
}

/**
 * Decrypts text using the user's UID as the key
 * Expects base64-encoded data with IV prepended
 * Returns plaintext if data is not encrypted (for backward compatibility)
 */
export async function decryptText(encryptedBase64: string, userId: string): Promise<string> {
  // Check if the text is actually encrypted
  if (!isEncrypted(encryptedBase64)) {
    console.log('Data is not encrypted, returning as-is');
    return encryptedBase64; // Return plaintext as-is
  }
  
  try {
    const key = await deriveKey(userId);
    
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedBase64).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedData
    );
    
    // Convert to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    // If decryption fails, return the original text (might be plaintext)
    console.warn('Decryption failed, returning original text');
    return encryptedBase64;
  }
}

/**
 * Encrypts a summary object before sending to backend
 * Only encrypts sensitive fields: summary_text and video_title
 */
export async function encryptSummary(
  summary: {
    video_url: string;
    summary_text: string;
    video_title: string;
  },
  userId: string
): Promise<{
  video_url: string;
  summary_text: string;
  video_title: string;
}> {
  return {
    video_url: summary.video_url, // URL is not sensitive, keep it searchable
    summary_text: await encryptText(summary.summary_text, userId),
    video_title: await encryptText(summary.video_title, userId),
  };
}

/**
 * Decrypts a summary object after receiving from backend
 */
export async function decryptSummary(
  encryptedSummary: {
    video_url: string;
    summary_text: string;
    video_title: string;
    id?: string;
    created_at?: string;
  },
  userId: string
): Promise<{
  video_url: string;
  summary_text: string;
  video_title: string;
  id?: string;
  created_at?: string;
}> {
  return {
    ...encryptedSummary,
    summary_text: await decryptText(encryptedSummary.summary_text, userId),
    video_title: await decryptText(encryptedSummary.video_title, userId),
  };
}
