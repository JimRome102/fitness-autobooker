import { BrowserManager } from '../core/BrowserManager';
import { BookingPreference, AutomationResult } from '../../types';
import { logger } from '../../utils/logger';

export abstract class BasePlatform {
  protected browser: BrowserManager;
  protected platformName: string;

  constructor(browser: BrowserManager, platformName: string) {
    this.browser = browser;
    this.platformName = platformName;
  }

  /**
   * Login to the platform
   * @param username - User's login username/email
   * @param password - User's login password
   */
  abstract login(username: string, password: string): Promise<void>;

  /**
   * Navigate to the class schedule for a specific date
   * @param date - Date to view schedule for
   */
  abstract navigateToSchedule(date: Date): Promise<void>;

  /**
   * Search for and select a specific class
   * @param preference - Booking preference with class details
   * @returns true if class found, false otherwise
   */
  abstract findClass(preference: BookingPreference): Promise<boolean>;

  /**
   * Attempt to book the selected class
   * @returns Result of booking attempt
   */
  abstract bookClass(): Promise<AutomationResult>;

  /**
   * Attempt to join waitlist for a full class
   * @returns Result of waitlist attempt
   */
  abstract joinWaitlist(): Promise<AutomationResult>;

  /**
   * Main booking flow - orchestrates the entire process
   * @param username - Platform login username
   * @param password - Platform login password
   * @param preference - Class booking preference
   */
  async executeBooking(
    username: string,
    password: string,
    preference: BookingPreference
  ): Promise<AutomationResult> {
    const startTime = Date.now();

    try {
      logger.info(`[${this.platformName}] Starting booking process for ${preference.class_name}`);

      // Step 1: Login
      logger.info(`[${this.platformName}] Logging in...`);
      await this.login(username, password);
      logger.info(`[${this.platformName}] ✅ Login successful`);

      // Step 2: Navigate to schedule
      const classDate = new Date(preference.class_date);
      logger.info(`[${this.platformName}] Navigating to schedule for ${classDate.toDateString()}`);
      await this.navigateToSchedule(classDate);
      logger.info(`[${this.platformName}] ✅ Schedule loaded`);

      // Step 3: Find the class
      logger.info(`[${this.platformName}] Searching for class: ${preference.class_name} at ${preference.class_time}`);
      const classFound = await this.findClass(preference);

      if (!classFound) {
        logger.warn(`[${this.platformName}] Class not found`);
        return {
          success: false,
          status: 'failed',
          message: `Class "${preference.class_name}" not found in schedule`,
          executionTimeMs: Date.now() - startTime
        };
      }

      logger.info(`[${this.platformName}] ✅ Class found`);

      // Step 4: Try to book
      logger.info(`[${this.platformName}] Attempting to book class...`);
      const bookingResult = await this.bookClass();

      // If booking failed but class is full, try waitlist
      if (!bookingResult.success && bookingResult.status === 'failed') {
        logger.info(`[${this.platformName}] Class appears full, trying waitlist...`);
        const waitlistResult = await this.joinWaitlist();
        return waitlistResult;
      }

      logger.info(`[${this.platformName}] ✅ Booking result: ${bookingResult.status}`);
      return bookingResult;

    } catch (error) {
      logger.error(`[${this.platformName}] Booking failed with error:`, error);
      return {
        success: false,
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Helper: Wait for element and get its text
   */
  protected async getElementText(selector: string): Promise<string> {
    try {
      await this.browser.waitForSelector(selector, 5000);
      return await this.browser.getText(selector);
    } catch (error) {
      logger.warn(`Element not found: ${selector}`);
      return '';
    }
  }

  /**
   * Helper: Check if element contains text
   */
  protected async elementContainsText(selector: string, text: string): Promise<boolean> {
    const elementText = await this.getElementText(selector);
    return elementText.toLowerCase().includes(text.toLowerCase());
  }

  /**
   * Helper: Wait for navigation
   */
  protected async waitForNavigation(): Promise<void> {
    await this.browser.wait(2000); // Simple wait for now
  }
}
