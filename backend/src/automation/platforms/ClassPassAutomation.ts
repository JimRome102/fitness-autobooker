import { BasePlatform } from './BasePlatform';
import { BrowserManager } from '../core/BrowserManager';
import { BookingPreference, AutomationResult } from '../../types';
import { logger } from '../../utils/logger';

/**
 * ClassPass platform automation
 *
 * NOTE: Selectors may need to be updated based on actual ClassPass website structure.
 * This is a template that should be tested and adjusted with real credentials.
 */
export class ClassPassAutomation extends BasePlatform {
  private readonly LOGIN_URL = 'https://classpass.com/login';
  private readonly SCHEDULE_BASE_URL = 'https://classpass.com/schedule';

  constructor(browser: BrowserManager) {
    super(browser, 'ClassPass');
  }

  /**
   * Login to ClassPass
   */
  async login(username: string, password: string): Promise<void> {
    try {
      // Navigate to login page
      await this.browser.goto(this.LOGIN_URL);
      await this.browser.wait(2000);

      // Check if already logged in
      const isLoggedIn = await this.browser.exists('[data-testid="user-menu"]') ||
                         await this.browser.exists('.user-avatar');

      if (isLoggedIn) {
        logger.info('[ClassPass] Already logged in');
        return;
      }

      // Find and fill email field
      // Common selectors - may need adjustment
      const emailSelectors = [
        'input[name="email"]',
        'input[type="email"]',
        'input[placeholder*="email" i]',
        '#email'
      ];

      let emailFilled = false;
      for (const selector of emailSelectors) {
        if (await this.browser.exists(selector)) {
          await this.browser.type(selector, username);
          emailFilled = true;
          logger.info('[ClassPass] Email entered');
          break;
        }
      }

      if (!emailFilled) {
        throw new Error('Could not find email input field');
      }

      // Find and fill password field
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        'input[placeholder*="password" i]',
        '#password'
      ];

      let passwordFilled = false;
      for (const selector of passwordSelectors) {
        if (await this.browser.exists(selector)) {
          await this.browser.type(selector, password);
          passwordFilled = true;
          logger.info('[ClassPass] Password entered');
          break;
        }
      }

      if (!passwordFilled) {
        throw new Error('Could not find password input field');
      }

      // Find and click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'button:contains("Log in")',
        'button:contains("Sign in")',
        'input[type="submit"]'
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        if (await this.browser.exists(selector)) {
          await this.browser.click(selector);
          submitted = true;
          logger.info('[ClassPass] Login button clicked');
          break;
        }
      }

      if (!submitted) {
        // Try clicking any button with "log" or "sign" in text
        await this.browser.getPage().evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const loginButton = buttons.find(btn =>
            btn.textContent?.toLowerCase().includes('log') ||
            btn.textContent?.toLowerCase().includes('sign')
          );
          if (loginButton) {
            (loginButton as HTMLElement).click();
          }
        });
      }

      // Wait for navigation after login
      await this.browser.wait(3000);

      // Verify login successful
      const loginSuccess = await this.browser.exists('[data-testid="user-menu"]') ||
                          await this.browser.exists('.user-avatar') ||
                          await this.browser.exists('[aria-label*="user" i]');

      if (!loginSuccess) {
        // Take screenshot for debugging
        await this.browser.screenshot('classpass-login-failed.png');
        throw new Error('Login verification failed');
      }

      logger.info('[ClassPass] Login verified successful');

    } catch (error) {
      logger.error('[ClassPass] Login failed:', error);
      await this.browser.screenshot('classpass-login-error.png');
      throw error;
    }
  }

  /**
   * Navigate to class schedule for a specific date
   */
  async navigateToSchedule(date: Date): Promise<void> {
    try {
      // Format date for URL (YYYY-MM-DD)
      const dateString = date.toISOString().split('T')[0];
      const scheduleUrl = `${this.SCHEDULE_BASE_URL}?date=${dateString}`;

      logger.info(`[ClassPass] Navigating to schedule: ${scheduleUrl}`);
      await this.browser.goto(scheduleUrl);
      await this.browser.wait(3000);

      // Wait for schedule to load
      const scheduleLoaded = await this.browser.exists('.class-card') ||
                            await this.browser.exists('[data-testid="class-list"]') ||
                            await this.browser.exists('.schedule-grid');

      if (!scheduleLoaded) {
        await this.browser.screenshot('classpass-schedule-not-loaded.png');
        throw new Error('Schedule did not load');
      }

      logger.info('[ClassPass] Schedule loaded successfully');

    } catch (error) {
      logger.error('[ClassPass] Failed to navigate to schedule:', error);
      throw error;
    }
  }

  /**
   * Find a specific class in the schedule
   */
  async findClass(preference: BookingPreference): Promise<boolean> {
    try {
      logger.info(`[ClassPass] Searching for: ${preference.class_name} at ${preference.class_time}`);

      // Get all class cards
      const page = this.browser.getPage();

      const classFound = await page.evaluate((searchCriteria) => {
        const {className, studioName, time, instructor} = searchCriteria;

        // Find all class elements (adjust selectors as needed)
        const classElements = Array.from(
          document.querySelectorAll('.class-card, [data-testid="class-card"], .schedule-item')
        );

        for (const classEl of classElements) {
          const text = classEl.textContent || '';
          const html = classEl.innerHTML;

          // Check if this class matches our criteria
          const matchesClass = text.toLowerCase().includes(className.toLowerCase());
          const matchesStudio = text.toLowerCase().includes(studioName.toLowerCase());
          const matchesTime = text.includes(time.replace(':', '')) || text.includes(time);
          const matchesInstructor = !instructor || text.toLowerCase().includes(instructor.toLowerCase());

          if (matchesClass && matchesStudio && matchesTime && matchesInstructor) {
            // Found the class! Click it or click a "Book" button within it
            const bookButton = classEl.querySelector('button:not([disabled])') as HTMLElement;
            if (bookButton) {
              bookButton.click();
              return true;
            }

            // Or click the card itself if it's clickable
            (classEl as HTMLElement).click();
            return true;
          }
        }

        return false;
      }, {
        className: preference.class_name,
        studioName: preference.studio_name,
        time: preference.class_time,
        instructor: preference.instructor || ''
      });

      if (classFound) {
        logger.info('[ClassPass] ✅ Class found and selected');
        await this.browser.wait(2000); // Wait for modal/next page to load
        return true;
      }

      logger.warn('[ClassPass] Class not found in schedule');
      await this.browser.screenshot('classpass-class-not-found.png');
      return false;

    } catch (error) {
      logger.error('[ClassPass] Error finding class:', error);
      return false;
    }
  }

  /**
   * Book the selected class
   */
  async bookClass(): Promise<AutomationResult> {
    const startTime = Date.now();

    try {
      logger.info('[ClassPass] Attempting to book class...');

      // Look for booking button or reserve button
      const bookingSelectors = [
        'button:contains("Reserve")',
        'button:contains("Book")',
        'button:contains("Reserve Spot")',
        '[data-testid="book-button"]',
        '[data-testid="reserve-button"]',
        'button.book-button',
        'button.reserve-button'
      ];

      let bookingAttempted = false;

      for (const selector of bookingSelectors) {
        if (await this.browser.exists(selector)) {
          await this.browser.click(selector);
          bookingAttempted = true;
          logger.info('[ClassPass] Booking button clicked');
          break;
        }
      }

      if (!bookingAttempted) {
        // Try finding any enabled button with "book" or "reserve" in text
        const page = this.browser.getPage();
        const clicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button:not([disabled])'));
          const bookButton = buttons.find(btn => {
            const text = btn.textContent?.toLowerCase() || '';
            return text.includes('reserve') || text.includes('book');
          });

          if (bookButton) {
            (bookButton as HTMLElement).click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          return {
            success: false,
            status: 'failed',
            message: 'Could not find booking button',
            executionTimeMs: Date.now() - startTime
          };
        }

        bookingAttempted = true;
      }

      // Wait for confirmation
      await this.browser.wait(3000);

      // Look for success confirmation
      const successIndicators = [
        '.success-message',
        '.confirmation',
        '[data-testid="booking-confirmed"]',
        'text=Successfully',
        'text=Reserved',
        'text=Confirmed'
      ];

      let bookingSuccess = false;
      for (const selector of successIndicators) {
        if (await this.browser.exists(selector)) {
          bookingSuccess = true;
          break;
        }
      }

      // Check page content for success messages
      const page = this.browser.getPage();
      const pageText = await page.evaluate(() => document.body.textContent || '');

      if (pageText.toLowerCase().includes('success') ||
          pageText.toLowerCase().includes('confirmed') ||
          pageText.toLowerCase().includes('reserved')) {
        bookingSuccess = true;
      }

      if (bookingSuccess) {
        await this.browser.screenshot('classpass-booking-success.png');
        return {
          success: true,
          status: 'booked',
          message: 'Class booked successfully',
          executionTimeMs: Date.now() - startTime
        };
      }

      // Check if class is full
      if (pageText.toLowerCase().includes('full') ||
          pageText.toLowerCase().includes('waitlist') ||
          pageText.toLowerCase().includes('sold out')) {

        logger.info('[ClassPass] Class appears to be full');
        return {
          success: false,
          status: 'failed',
          message: 'Class is full',
          executionTimeMs: Date.now() - startTime
        };
      }

      // Unknown result
      await this.browser.screenshot('classpass-booking-unknown.png');
      return {
        success: false,
        status: 'failed',
        message: 'Booking result unclear',
        executionTimeMs: Date.now() - startTime
      };

    } catch (error) {
      logger.error('[ClassPass] Booking error:', error);
      await this.browser.screenshot('classpass-booking-error.png');
      return {
        success: false,
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Join waitlist for a full class
   */
  async joinWaitlist(): Promise<AutomationResult> {
    const startTime = Date.now();

    try {
      logger.info('[ClassPass] Attempting to join waitlist...');

      // Look for waitlist button
      const waitlistSelectors = [
        'button:contains("Join Waitlist")',
        'button:contains("Waitlist")',
        '[data-testid="waitlist-button"]',
        'button.waitlist-button'
      ];

      let waitlistJoined = false;

      for (const selector of waitlistSelectors) {
        if (await this.browser.exists(selector)) {
          await this.browser.click(selector);
          waitlistJoined = true;
          logger.info('[ClassPass] Waitlist button clicked');
          break;
        }
      }

      if (!waitlistJoined) {
        // Try finding button with "waitlist" in text
        const page = this.browser.getPage();
        const clicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button:not([disabled])'));
          const waitlistButton = buttons.find(btn =>
            btn.textContent?.toLowerCase().includes('waitlist')
          );

          if (waitlistButton) {
            (waitlistButton as HTMLElement).click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          return {
            success: false,
            status: 'failed',
            message: 'No waitlist option available',
            executionTimeMs: Date.now() - startTime
          };
        }
      }

      // Wait for confirmation
      await this.browser.wait(2000);

      // Check for waitlist confirmation
      const page = this.browser.getPage();
      const pageText = await page.evaluate(() => document.body.textContent || '');

      if (pageText.toLowerCase().includes('waitlist') &&
          (pageText.toLowerCase().includes('added') ||
           pageText.toLowerCase().includes('joined') ||
           pageText.toLowerCase().includes('success'))) {

        await this.browser.screenshot('classpass-waitlist-success.png');
        return {
          success: true,
          status: 'waitlisted',
          message: 'Successfully added to waitlist',
          executionTimeMs: Date.now() - startTime
        };
      }

      await this.browser.screenshot('classpass-waitlist-unclear.png');
      return {
        success: false,
        status: 'failed',
        message: 'Waitlist join unclear',
        executionTimeMs: Date.now() - startTime
      };

    } catch (error) {
      logger.error('[ClassPass] Waitlist error:', error);
      return {
        success: false,
        status: 'failed',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTimeMs: Date.now() - startTime
      };
    }
  }
}
