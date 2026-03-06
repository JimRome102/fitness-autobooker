import { supabase } from '../config/database';
import { encrypt, decrypt, EncryptedData } from '../config/encryption';
import { logger } from '../utils/logger';
import { AppError, ErrorCode } from '../middleware/errorHandler';
import { Credential, Platform, CreateCredentialRequest } from '../types';

export class CredentialService {
  /**
   * Create a new credential for a platform
   */
  async createCredential(
    userId: string,
    request: CreateCredentialRequest
  ): Promise<Credential> {
    try {
      // Check if credential already exists for this platform
      const existing = await this.getCredentialByPlatform(userId, request.platform);
      if (existing) {
        throw new AppError(
          ErrorCode.DUPLICATE_CREDENTIAL,
          `Credentials for ${request.platform} already exist`,
          409
        );
      }

      // Encrypt username and password
      const encryptedUsername = encrypt(request.username);
      const encryptedPassword = encrypt(request.password);

      // Insert into database
      const { data, error } = await supabase
        .from('credentials')
        .insert({
          user_id: userId,
          platform: request.platform,
          encrypted_username: encryptedUsername.encrypted,
          encrypted_password: encryptedPassword.encrypted,
          iv: encryptedUsername.iv, // Use same IV for both (or could use separate)
          auth_tag: encryptedUsername.authTag,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating credential:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to create credential',
          500
        );
      }

      logger.info(`Created credential for platform: ${request.platform}`);
      return data as Credential;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating credential:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to create credential',
        500
      );
    }
  }

  /**
   * Get all credentials for a user
   */
  async getCredentials(userId: string): Promise<Credential[]> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Database error fetching credentials:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to fetch credentials',
          500
        );
      }

      return (data as Credential[]) || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching credentials:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch credentials',
        500
      );
    }
  }

  /**
   * Get credential by platform
   */
  async getCredentialByPlatform(
    userId: string,
    platform: Platform
  ): Promise<Credential | null> {
    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        logger.error('Database error fetching credential:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to fetch credential',
          500
        );
      }

      return data as Credential;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching credential:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch credential',
        500
      );
    }
  }

  /**
   * Get decrypted credentials for automation
   */
  async getDecryptedCredentials(
    userId: string,
    platform: Platform
  ): Promise<{ username: string; password: string } | null> {
    try {
      const credential = await this.getCredentialByPlatform(userId, platform);
      if (!credential) {
        return null;
      }

      // Decrypt username and password
      const username = decrypt({
        encrypted: credential.encrypted_username,
        iv: credential.iv,
        authTag: credential.auth_tag
      });

      const password = decrypt({
        encrypted: credential.encrypted_password,
        iv: credential.iv,
        authTag: credential.auth_tag
      });

      return { username, password };
    } catch (error) {
      logger.error('Error decrypting credentials:', error);
      throw new AppError(
        ErrorCode.ENCRYPTION_ERROR,
        'Failed to decrypt credentials',
        500
      );
    }
  }

  /**
   * Update credential
   */
  async updateCredential(
    userId: string,
    credentialId: string,
    updates: { username?: string; password?: string }
  ): Promise<Credential> {
    try {
      const updateData: any = {};

      if (updates.username) {
        const encryptedUsername = encrypt(updates.username);
        updateData.encrypted_username = encryptedUsername.encrypted;
        updateData.iv = encryptedUsername.iv;
        updateData.auth_tag = encryptedUsername.authTag;
      }

      if (updates.password) {
        const encryptedPassword = encrypt(updates.password);
        updateData.encrypted_password = encryptedPassword.encrypted;
        if (!updates.username) {
          // Only update IV/authTag if not already updated by username
          updateData.iv = encryptedPassword.iv;
          updateData.auth_tag = encryptedPassword.authTag;
        }
      }

      const { data, error } = await supabase
        .from('credentials')
        .update(updateData)
        .eq('id', credentialId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Database error updating credential:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to update credential',
          500
        );
      }

      if (!data) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Credential not found',
          404
        );
      }

      logger.info(`Updated credential: ${credentialId}`);
      return data as Credential;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating credential:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to update credential',
        500
      );
    }
  }

  /**
   * Delete credential
   */
  async deleteCredential(userId: string, credentialId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('credentials')
        .delete()
        .eq('id', credentialId)
        .eq('user_id', userId);

      if (error) {
        logger.error('Database error deleting credential:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to delete credential',
          500
        );
      }

      logger.info(`Deleted credential: ${credentialId}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting credential:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to delete credential',
        500
      );
    }
  }
}
