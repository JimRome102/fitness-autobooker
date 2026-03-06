import crypto from 'crypto';
import { config } from './environment';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(config.encryptionKey, 'hex');

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('Encryption key must be 32 bytes (64 hex characters)');
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt plaintext using AES-256-GCM
 */
export function encrypt(plaintext: string): EncryptedData {
  // Generate random initialization vector
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  // Encrypt the data
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypt ciphertext using AES-256-GCM
 */
export function decrypt(encryptedData: EncryptedData): string {
  const { encrypted, iv, authTag } = encryptedData;

  // Create decipher
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(iv, 'hex')
  );

  // Set authentication tag
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  // Decrypt the data
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate a random encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
