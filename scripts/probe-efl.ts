// Probe script to check all EFL stub stores with Playwright
import { chromium } from 'playwright';

const TARGETS = [
  { name: 'BlackburnRovers', url: 'https://www.rovers.co.uk/store/football-shirts-and-kits' },
  {
    name: 'CharltonAthletic',
    url: 'https://clubshop.cafc.co.uk/collections/all?sort_by=best-selling',
  },
  { name: 'CoventryCity', url: 'https://shop.ccfc.co.uk' },
  { name: 'DerbyCounty', url: 'https://www.dcfcmegastore.co.uk/football-shirts-kits.html' },
  { name: 'LeicesterCity', url: 'https://shop.lcfc.com/collections/kits' },
  { name: 'MillwallFC', url: 'https://shop.millwallfc.co.uk/collections/kits' },
  { name: 'PortsmouthFC', url: 'https://pompey.clubstore.co.uk/replica' },
];

async function probe(name: string, url: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-GB',
    viewport: { width: 1280, height: 800 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  try {
    const page = await context.newPage();
    let statusCode = 0;
    page.on('response', (r) => {
      if (r.url() === url) statusCode = r.status();
    });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch {
      /* timeout ok */
    }
    await page.waitForTimeout(3000);
    const finalUrl = page.url();
    const html = await page.content();
    const title = await page.title();
    console.log(`\n=== ${name} ===`);
    console.log(`  URL: ${finalUrl}`);
    console.log(`  Title: ${title}`);
    console.log(`  HTML size: ${html.length}`);
    console.log(`  Status hint: ${statusCode || '(not captured)'}`);
    // Look for product-related elements
    const indicators = [
      ['Shopify products', 'products.json'],
      ['Cloudflare', 'cloudflare'],
      ['Akamai', 'akamai'],
      ['Product cards', 'product-card'],
      ['Product items', 'product-item'],
      ['Product grid', 'product-grid'],
    ];
    for (const [label, keyword] of indicators) {
      if (html.toLowerCase().includes(keyword.toLowerCase())) {
        console.log(`  Found: ${label}`);
      }
    }
    // Count common product link patterns
    const countLinks = (pattern: string) => (html.match(new RegExp(pattern, 'g')) || []).length;
    console.log(`  Links with /product: ${countLinks('/product')}`);
    console.log(`  Links with /p/: ${countLinks('/p/')}`);
    console.log(`  <a href links: ${countLinks('<a href')}`);
  } catch (e) {
    console.log(`\n=== ${name} ERROR: ${e} ===`);
  } finally {
    await browser.close();
  }
}

async function main() {
  for (const { name, url } of TARGETS) {
    await probe(name, url);
  }
}
main();
