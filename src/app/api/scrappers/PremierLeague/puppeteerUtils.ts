import { Browser, Page } from 'puppeteer-core';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/**
 * Launches a browser instance compatible with both local dev and Vercel/Lambda.
 * - On Vercel: uses @sparticuz/chromium + puppeteer-core (no bundled binary).
 * - Locally: uses the bundled Chromium from the `puppeteer` package.
 * @param stealth - wrap with puppeteer-extra stealth plugin to reduce bot detection
 */
export async function launchBrowser(stealth = false): Promise<Browser> {
  const isVercel = !!process.env.VERCEL;

  if (isVercel) {
    const chromium = (await import('@sparticuz/chromium')).default;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const puppeteerCore = require('puppeteer-core');
    const launchOptions = {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless as boolean,
    };
    if (stealth) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { addExtra } = require('puppeteer-extra');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const StealthPlugin = require('puppeteer-extra-plugin-stealth');
      const p = addExtra(puppeteerCore);
      p.use(StealthPlugin());
      return p.launch(launchOptions);
    }
    return puppeteerCore.launch(launchOptions);
  } else {
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    if (stealth) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const puppeteerExtra = require('puppeteer-extra');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const StealthPlugin = require('puppeteer-extra-plugin-stealth');
      puppeteerExtra.use(StealthPlugin());
      return puppeteerExtra.launch(launchOptions);
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('puppeteer').launch(launchOptions);
  }
}

export async function launchAndGetPage(url: string): Promise<{ browser: Browser; page: Page }> {
  const browser = await launchBrowser(false);
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  return { browser, page };
}
