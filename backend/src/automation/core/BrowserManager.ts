import puppeteer, { Browser, Page } from 'puppeteer';
import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { config } from '../../config/environment';
import { logger } from '../../utils/logger';

// Add stealth plugin to avoid detection
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());

export class BrowserManager {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Launch a new browser instance
   */
  async launch(): Promise<void> {
    try {
      logger.info('Launching browser...');

      this.browser = await puppeteerExtra.launch({
        headless: config.puppeteerHeadless,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage'
        ],
        defaultViewport: {
          width: 1920,
          height: 1080
        }
      });

      this.page = await this.browser.newPage();

      // Set a realistic user agent
      await this.page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Set extra headers to look more like a real browser
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      });

      logger.info('✅ Browser launched successfully');
    } catch (error) {
      logger.error('Failed to launch browser:', error);
      throw error;
    }
  }

  /**
   * Get the current page
   */
  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2' }): Promise<void> {
    const page = this.getPage();
    logger.info(`Navigating to: ${url}`);

    await page.goto(url, {
      waitUntil: options?.waitUntil || 'networkidle2',
      timeout: config.puppeteerTimeout
    });
  }

  /**
   * Wait for a selector to appear
   */
  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    const page = this.getPage();
    await page.waitForSelector(selector, {
      timeout: timeout || config.puppeteerTimeout
    });
  }

  /**
   * Click an element
   */
  async click(selector: string): Promise<void> {
    const page = this.getPage();
    await page.click(selector);
    await this.wait(500); // Small delay after click
  }

  /**
   * Type text into an input
   */
  async type(selector: string, text: string, options?: { delay?: number }): Promise<void> {
    const page = this.getPage();
    await page.type(selector, text, {
      delay: options?.delay || 100 // Simulate human typing
    });
  }

  /**
   * Get text content from an element
   */
  async getText(selector: string): Promise<string> {
    const page = this.getPage();
    const element = await page.$(selector);
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    const text = await page.evaluate(el => el.textContent, element);
    return text?.trim() || '';
  }

  /**
   * Check if an element exists
   */
  async exists(selector: string): Promise<boolean> {
    const page = this.getPage();
    const element = await page.$(selector);
    return element !== null;
  }

  /**
   * Wait for a specified time
   */
  async wait(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Take a screenshot (for debugging)
   */
  async screenshot(filename: string): Promise<void> {
    const page = this.getPage();
    await page.screenshot({ path: `screenshots/${filename}` });
    logger.info(`Screenshot saved: ${filename}`);
  }

  /**
   * Get page HTML (for debugging)
   */
  async getHTML(): Promise<string> {
    const page = this.getPage();
    return await page.content();
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      logger.info('Closing browser...');
      await this.browser.close();
      this.browser = null;
      this.page = null;
      logger.info('✅ Browser closed');
    }
  }

  /**
   * Cleanup on error
   */
  async cleanup(): Promise<void> {
    try {
      await this.close();
    } catch (error) {
      logger.error('Error during cleanup:', error);
    }
  }
}
