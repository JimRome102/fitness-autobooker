import { supabase } from '../config/database';
import { logger } from '../utils/logger';
import { AppError, ErrorCode } from '../middleware/errorHandler';
import { BookingPreference, CreatePreferenceRequest, UpdatePreferenceRequest } from '../types';

export class PreferenceService {
  /**
   * Create a new booking preference
   */
  async createPreference(
    userId: string,
    request: CreatePreferenceRequest
  ): Promise<BookingPreference> {
    try {
      const { data, error } = await supabase
        .from('booking_preferences')
        .insert({
          user_id: userId,
          platform: request.platform,
          studio_name: request.studio_name,
          class_name: request.class_name,
          class_date: request.date,
          class_time: request.time,
          instructor: request.instructor,
          priority: request.priority,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating preference:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to create booking preference',
          500
        );
      }

      logger.info(`Created booking preference for ${request.platform} - ${request.class_name}`);
      return data as BookingPreference;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating preference:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to create booking preference',
        500
      );
    }
  }

  /**
   * Get all preferences for a user
   */
  async getPreferences(
    userId: string,
    filters?: {
      active?: boolean;
      platform?: string;
      date?: string;
    }
  ): Promise<BookingPreference[]> {
    try {
      let query = supabase
        .from('booking_preferences')
        .select('*')
        .eq('user_id', userId);

      if (filters?.active !== undefined) {
        query = query.eq('is_active', filters.active);
      }

      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }

      if (filters?.date) {
        query = query.eq('class_date', filters.date);
      }

      query = query.order('class_date', { ascending: true });
      query = query.order('class_time', { ascending: true });

      const { data, error } = await query;

      if (error) {
        logger.error('Database error fetching preferences:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to fetch preferences',
          500
        );
      }

      return (data as BookingPreference[]) || [];
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching preferences:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch preferences',
        500
      );
    }
  }

  /**
   * Get preference by ID
   */
  async getPreferenceById(
    userId: string,
    preferenceId: string
  ): Promise<BookingPreference | null> {
    try {
      const { data, error } = await supabase
        .from('booking_preferences')
        .select('*')
        .eq('id', preferenceId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Database error fetching preference:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to fetch preference',
          500
        );
      }

      return data as BookingPreference;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching preference:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch preference',
        500
      );
    }
  }

  /**
   * Update preference
   */
  async updatePreference(
    userId: string,
    preferenceId: string,
    updates: UpdatePreferenceRequest
  ): Promise<BookingPreference> {
    try {
      const updateData: any = {};

      if (updates.studio_name) updateData.studio_name = updates.studio_name;
      if (updates.class_name) updateData.class_name = updates.class_name;
      if (updates.date) updateData.class_date = updates.date;
      if (updates.time) updateData.class_time = updates.time;
      if (updates.instructor !== undefined) updateData.instructor = updates.instructor;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

      const { data, error } = await supabase
        .from('booking_preferences')
        .update(updateData)
        .eq('id', preferenceId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Database error updating preference:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to update preference',
          500
        );
      }

      if (!data) {
        throw new AppError(
          ErrorCode.NOT_FOUND,
          'Preference not found',
          404
        );
      }

      logger.info(`Updated preference: ${preferenceId}`);
      return data as BookingPreference;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating preference:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to update preference',
        500
      );
    }
  }

  /**
   * Delete preference
   */
  async deletePreference(userId: string, preferenceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('booking_preferences')
        .delete()
        .eq('id', preferenceId)
        .eq('user_id', userId);

      if (error) {
        logger.error('Database error deleting preference:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to delete preference',
          500
        );
      }

      logger.info(`Deleted preference: ${preferenceId}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting preference:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to delete preference',
        500
      );
    }
  }
}
