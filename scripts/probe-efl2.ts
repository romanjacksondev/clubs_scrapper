// Deep probe for Charlton, Leicester, Millwall — find exact product selectors
import * as fs from 'fs';
import { chromium } from 'playwright';

const TARGETS = [
  { name: 'CharltonAthletic', url: 'https://clubshop.cafc.co.uk/collections/kits' },
  { name: 'LeicesterCity', url: 'https://shop.lcfc.com/collections/kits' },
  { name: 'MillwallFC', url: 'https://shop.millwallfc.co.uk/collections/kits' },
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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const html = await page.content();
    fs.writeFileSync(`/tmp/${name}-probe.html`, html);

    // Try common Shopify product link patterns
    const samples = await page
      .$$eval('a[href*="/products/"]', (els) =>
        els.slice(0, 5).map((a) => ({
          href: (a as HTMLAnchorElement).href,
          text: a.textContent?.trim().slice(0, 60),
          className: a.className?.slice(0, 80),
        })),
      )
      .catch(() => []);

    console.log(`\n=== ${name} ===`);
    console.log(`  Final URL: ${page.url()}`);
    console.log(`  HTML: ${html.length} bytes`);
    console.log(`  Product links (a[href*="/products/"]): ${samples.length} samples`);
    for (const s of samples) {
      console.log(`    href: ${s.href}`);
      console.log(`    text: ${s.text}`);
      console.log(`    class: ${s.className}`);
    }

    // Also check for price elements
    const priceInfo = await page
      .$$eval('[class*="price"]', (els) =>
        els.slice(0, 3).map((el) => ({
          tag: el.tagName,
          text: el.textContent?.trim().slice(0, 40),
          className: el.className?.slice(0, 80),
        })),
      )
      .catch(() => []);
    console.log(`  Price elements: ${priceInfo.length}`);
    for (const p of priceInfo) {
      console.log(`    <${p.tag} class="${p.className}">${p.text}`);
    }
  } catch (e) {
    console.log(`ERROR ${name}: ${e}`);
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
