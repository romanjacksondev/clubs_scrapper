import { launchPlaywright } from '../src/app/api/scrappers/shared/playwrightUtils';
import fs from 'fs';

async function main() {
  const browser = await launchPlaywright();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: { 'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8' },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  try {
    const page = await context.newPage();
    try {
      await page.goto('https://www.bayer04.de/de-de/shop/trikots/', { waitUntil: 'domcontentloaded', timeout: 25000 });
    } catch { /* timeout ok */ }
    await page.waitForTimeout(3000);
    console.log('Final URL:', page.url());
    const html = await page.content();
    fs.writeFileSync('/tmp/bayer04-page.html', html);
    console.log('Saved HTML, size:', html.length);
    // Check for any product-like elements
    const counts = await page.evaluate(() => ({
      article: document.querySelectorAll('article').length,
      productItem: document.querySelectorAll('[class*="product-item"]').length,
      ProductCard: document.querySelectorAll('[class*="ProductCard"]').length,
      productCard: document.querySelectorAll('[class*="product-card"]').length,
      anyCard: document.querySelectorAll('[class*="card"]').length,
      links: document.querySelectorAll('a[href*="trikot"], a[href*="jersey"], a[href*="shop"]').length,
    }));
    console.log('Element counts:', counts);
  } finally {
    await browser.close();
  }
}
main().catch(console.error);
