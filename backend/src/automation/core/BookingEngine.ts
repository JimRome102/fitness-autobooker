import { BrowserManager } from './BrowserManager';
import { ClassPassAutomation } from '../platforms/ClassPassAutomation';
import { BasePlatform } from '../platforms/BasePlatform';
import { CredentialService } from '../../services/credentialService';
import { PreferenceService } from '../../services/preferenceService';
import { BookingHistoryService } from '../../services/bookingHistoryService';
import { logger } from '../../utils/logger';
import { Platform, AutomationResult } from '../../types';

export interface BookingRunResult {
  total: number;
  successful: number;
  waitlisted: number;
  failed: number;
  details: Array<{
    preferenceId: string;
    platform: Platform;
    className: string;
    result: string;
    message: string;
    executionTimeMs: number;
  }>;
}

export class BookingEngine {
  private credentialService: CredentialService;
  private preferenceService: PreferenceService;
  private historyService: BookingHistoryService;

  constructor() {
    this.credentialService = new CredentialService();
    this.preferenceService = new PreferenceService();
    this.historyService = new BookingHistoryService();
  }

  /**
   * Run the booking process for a user
   */
  async runBookingProcess(userId: string): Promise<BookingRunResult> {
    logger.info(`🚀 Starting booking process for user: ${userId}`);

    const result: BookingRunResult = {
      total: 0,
      successful: 0,
      waitlisted: 0,
      failed: 0,
      details: []
    };

    try {
      // Get all active booking preferences, sorted by priority
      const preferences = await this.preferenceService.getPreferences(userId, {
        active: true
      });

      if (preferences.length === 0) {
        logger.info('No active booking preferences found');
        return result;
      }

      // Sort by priority (high > medium > low)
      const sortedPreferences = preferences.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      logger.info(`Found ${sortedPreferences.length} active preferences to process`);

      result.total = sortedPreferences.length;

      // Process each preference
      for (const preference of sortedPreferences) {
        logger.info(`\n📅 Processing: ${preference.class_name} at ${preference.studio_name}`);

        try {
          const bookingResult = await this.bookSingleClass(userId, preference);

          // Update result counters
          if (bookingResult.status === 'booked') {
            result.successful++;
          } else if (bookingResult.status === 'waitlisted') {
            result.waitlisted++;
          } else {
            result.failed++;
          }

          // Add to details
          result.details.push({
            preferenceId: preference.id,
            platform: preference.platform,
            className: preference.class_name,
            result: bookingResult.status,
            message: bookingResult.message,
            executionTimeMs: bookingResult.executionTimeMs
          });

        } catch (error) {
          logger.error(`Error processing preference ${preference.id}:`, error);

          result.failed++;
          result.details.push({
            preferenceId: preference.id,
            platform: preference.platform,
            className: preference.class_name,
            result: 'failed',
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            executionTimeMs: 0
          });
        }

        // Small delay between bookings
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      logger.info(`\n✅ Booking process complete!`);
      logger.info(`Results: ${result.successful} successful, ${result.waitlisted} waitlisted, ${result.failed} failed`);

      return result;

    } catch (error) {
      logger.error('Booking process failed:', error);
      throw error;
    }
  }

  /**
   * Book a single class
   */
  private async bookSingleClass(
    userId: string,
    preference: any
  ): Promise<AutomationResult> {
    const browser = new BrowserManager();

    try {
      // Get credentials for this platform
      const credentials = await this.credentialService.getDecryptedCredentials(
        userId,
        preference.platform
      );

      if (!credentials) {
        const errorMsg = `No credentials found for ${preference.platform}`;
        logger.error(errorMsg);

        // Record failed attempt
        await this.recordBookingAttempt(userId, preference, {
          success: false,
          status: 'failed',
          message: errorMsg,
          executionTimeMs: 0
        });

        return {
          success: false,
          status: 'failed',
          message: errorMsg,
          executionTimeMs: 0
        };
      }

      // Launch browser
      await browser.launch();

      // Get platform-specific automation
      const platformAutomation = this.getPlatformAutomation(browser, preference.platform);

      // Execute booking
      const result = await platformAutomation.executeBooking(
        credentials.username,
        credentials.password,
        preference
      );

      // Record attempt in database
      await this.recordBookingAttempt(userId, preference, result);

      return result;

    } catch (error) {
      logger.error(`Error booking class:`, error);

      const errorResult: AutomationResult = {
        success: false,
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTimeMs: 0
      };

      // Record failed attempt
      await this.recordBookingAttempt(userId, preference, errorResult);

      return errorResult;

    } finally {
      // Always close browser
      await browser.cleanup();
    }
  }

  /**
   * Get platform-specific automation class
   */
  private getPlatformAutomation(browser: BrowserManager, platform: Platform): BasePlatform {
    switch (platform) {
      case 'classpass':
        return new ClassPassAutomation(browser);

      // TODO: Add other platforms
      // case 'mindbody':
      //   return new MindbodyAutomation(browser);
      // case 'barrys':
      //   return new BarrysAutomation(browser);
      // case 'slt':
      //   return new SLTAutomation(browser);
      // case 'y7':
      //   return new Y7Automation(browser);

      default:
        throw new Error(`Platform "${platform}" not yet implemented`);
    }
  }

  /**
   * Record booking attempt to database
   */
  private async recordBookingAttempt(
    userId: string,
    preference: any,
    result: AutomationResult
  ): Promise<void> {
    try {
      // Convert booking result status to database result type
      const dbResult = result.status === 'booked' ? 'success' :
                      result.status === 'waitlisted' ? 'waitlisted' :
                      result.status === 'failed' ? 'failed' : 'error';

      // Combine date and time into datetime
      const classDatetime = new Date(`${preference.class_date}T${preference.class_time}`);

      await this.historyService.recordBookingAttempt(
        userId,
        preference.id,
        preference.platform,
        preference.studio_name,
        preference.class_name,
        classDatetime,
        preference.instructor,
        dbResult,
        result.success ? undefined : result.message,
        result.executionTimeMs
      );

    } catch (error) {
      logger.error('Failed to record booking attempt to database:', error);
      // Don't throw - we don't want database errors to stop the booking process
    }
  }
}
