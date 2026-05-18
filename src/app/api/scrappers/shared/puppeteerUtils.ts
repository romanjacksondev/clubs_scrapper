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
    const puppeteerCore = await import('puppeteer-core');
    const launchOptions = {
      args: [...chromium.args, '--single-process'],
      executablePath: await chromium.executablePath(),
      headless: true as const,
    };
    if (stealth) {
      const { addExtra } = await import('puppeteer-extra');
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = addExtra(puppeteerCore as any);
      p.use(StealthPlugin());
      return p.launch(launchOptions) as unknown as Browser;
    }
    return puppeteerCore.launch(launchOptions);
  } else {
    const launchOptions = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    if (stealth) {
      const puppeteerExtra = (await import('puppeteer-extra')).default;
      const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;
      puppeteerExtra.use(StealthPlugin());
      return puppeteerExtra.launch(launchOptions) as unknown as Browser;
    }
    const puppeteer = await import('puppeteer');
    return puppeteer.launch(launchOptions) as unknown as Browser;
  }
}

export async function launchAndGetPage(
  url: string,
  stealth = false,
): Promise<{ browser: Browser; page: Page }> {
  const browser = await launchBrowser(stealth);
  const page = await browser.newPage();
  try {
    await page.setUserAgent(USER_AGENT);
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (err) {
    await browser.close();
    throw err;
  }
  return { browser, page };
}
