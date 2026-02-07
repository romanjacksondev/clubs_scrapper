import puppeteer, { Browser, Page } from 'puppeteer';

export async function launchAndGetPage(url: string): Promise<{ browser: Browser; page: Page }> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  return { browser, page };
}
