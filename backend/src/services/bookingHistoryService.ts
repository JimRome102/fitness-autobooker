import { supabase } from '../config/database';
import { logger } from '../utils/logger';
import { AppError, ErrorCode } from '../middleware/errorHandler';
import { BookingHistory, BookingResult, Platform } from '../types';

export class BookingHistoryService {
  /**
   * Record a booking attempt
   */
  async recordBookingAttempt(
    userId: string,
    preferenceId: string,
    platform: Platform,
    studioName: string,
    className: string,
    classDatetime: Date,
    instructor: string | undefined,
    result: BookingResult,
    errorMessage: string | undefined,
    executionTimeMs: number
  ): Promise<BookingHistory> {
    try {
      const { data, error } = await supabase
        .from('booking_history')
        .insert({
          user_id: userId,
          preference_id: preferenceId,
          platform,
          studio_name: studioName,
          class_name: className,
          class_datetime: classDatetime.toISOString(),
          instructor,
          result,
          error_message: errorMessage,
          execution_time_ms: executionTimeMs
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error recording booking attempt:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to record booking attempt',
          500
        );
      }

      logger.info(`Recorded booking attempt: ${result} for ${className}`);
      return data as BookingHistory;

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error recording booking attempt:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to record booking attempt',
        500
      );
    }
  }

  /**
   * Get booking history for a user
   */
  async getBookingHistory(
    userId: string,
    filters?: {
      platform?: Platform;
      result?: BookingResult;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<BookingHistory[]> {
    try {
      let query = supabase
        .from('booking_history')
        .select('*')
        .eq('user_id', userId);

      if (filters?.platform) {
        query = query.eq('platform', filters.platform);
      }

      if (filters?.result) {
        query = query.eq('result', filters.result);
      }

      if (filters?.startDate) {
        query = query.gte('class_datetime', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('class_datetime', filters.endDate);
      }

      query = query.order('attempt_timestamp', { ascending: false });

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Database error fetching booking history:', error);
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Failed to fetch booking history',
          500
        );
      }

      return (data as BookingHistory[]) || [];

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching booking history:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch booking history',
        500
      );
    }
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(userId: string): Promise<{
    total: number;
    successful: number;
    waitlisted: number;
    failed: number;
    successRate: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('booking_history')
        .select('result')
        .eq('user_id', userId);

      if (error) {
        throw new AppError(ErrorCode.DATABASE_ERROR, 'Failed to fetch stats', 500);
      }

      const history = data || [];
      const total = history.length;
      const successful = history.filter(h => h.result === 'success').length;
      const waitlisted = history.filter(h => h.result === 'waitlisted').length;
      const failed = history.filter(h => h.result === 'failed' || h.result === 'error').length;
      const successRate = total > 0 ? (successful / total) * 100 : 0;

      return {
        total,
        successful,
        waitlisted,
        failed,
        successRate: Math.round(successRate * 10) / 10 // Round to 1 decimal
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching booking stats:', error);
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch booking stats',
        500
      );
    }
  }
}
