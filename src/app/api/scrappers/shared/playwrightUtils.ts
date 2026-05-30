import { Browser, BrowserContext, Page } from 'playwright';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function launchPlaywright(headless = true): Promise<Browser> {
  const { chromium } = await import('playwright');
  return chromium.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
}

export async function newStealthContext(browser: Browser): Promise<BrowserContext> {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
      Accept:
        'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  });
  // Mask webdriver property
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Array;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Promise;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
  });
  return context;
}

export async function openPage(
  context: BrowserContext,
  url: string,
  opts: { waitUntil?: 'domcontentloaded' | 'load' | 'networkidle'; timeout?: number } = {},
): Promise<Page> {
  const page = await context.newPage();
  await page.goto(url, {
    waitUntil: opts.waitUntil ?? 'domcontentloaded',
    timeout: opts.timeout ?? 30000,
  });
  return page;
}

/**
 * Convenience: open a browser + context + page, navigate, and return all three.
 * Caller is responsible for closing browser when done.
 */
export async function launchAndNavigate(
  url: string,
  opts: { waitUntil?: 'domcontentloaded' | 'load' | 'networkidle'; timeout?: number } = {},
): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await launchPlaywright();
  const context = await newStealthContext(browser);
  const page = await openPage(context, url, opts);
  return { browser, context, page };
}
