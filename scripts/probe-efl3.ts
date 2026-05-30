// Isolated probes for Charlton, Portsmouth, Leicester, Millwall, Derby
import * as fs from 'fs';
import { chromium } from 'playwright';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function probe(name: string, url: string, waitSel?: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: UA,
    locale: 'en-GB',
    viewport: { width: 1280, height: 800 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  const page = await context.newPage();
  console.log(`\n[${name}] navigating to ${url}`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  } catch {
    console.log(`  goto timeout (ok)`);
  }
  if (waitSel) {
    await page
      .waitForSelector(waitSel, { timeout: 10000 })
      .catch(() => console.log(`  selector not found: ${waitSel}`));
  } else {
    await page.waitForTimeout(5000);
  }
  const html = await page.content();
  fs.writeFileSync(`/tmp/${name}-iso.html`, html);
  console.log(`  Final URL: ${page.url()}`);
  console.log(`  HTML: ${html.length} bytes`);
  // Count links
  const aLinks = await page
    .$$eval('a[href]', (els) => els.map((a) => (a as HTMLAnchorElement).href))
    .catch(() => [] as string[]);
  const productLinks = aLinks.filter((h) => h.includes('/product'));
  console.log(`  Total <a> links: ${aLinks.length}, with /product: ${productLinks.length}`);
  if (productLinks.length > 0) {
    console.log(`  First 3 product links:`);
    for (const l of productLinks.slice(0, 3)) console.log(`    ${l}`);
  }
  await browser.close();
}

async function main() {
  const name = process.argv[2];
  if (name === 'charlton') {
    await probe('Charlton', 'https://clubshop.cafc.co.uk/collections/all', 'a[href*="/products/"]');
  } else if (name === 'portsmouth') {
    await probe('Portsmouth', 'https://pompey.clubstore.co.uk/replica-kit', undefined);
    // Also check HTML for product structure
    const html = fs.readFileSync('/tmp/Portsmouth-iso.html', 'utf8');
    const lines = html
      .split('\n')
      .filter((l) => l.includes('product') || l.includes('price') || l.includes('href'))
      .slice(0, 30);
    lines.forEach((l) => console.log('  |', l.trim().slice(0, 120)));
  } else if (name === 'leicester') {
    await probe(
      'Leicester',
      'https://shop.lcfc.com/en/collections/kits',
      '.product-item, .card, [data-product-handle]',
    );
  } else if (name === 'millwall') {
    await probe(
      'Millwall',
      'https://shop.millwallfc.co.uk/collections/kits',
      'a[href*="/products/"]',
    );
  } else if (name === 'derby') {
    await probe('Derby', 'https://www.dcfcmegastore.co.uk/football-shirts-kits.html', undefined);
    const html = fs.readFileSync('/tmp/Derby-iso.html', 'utf8');
    const lines = html
      .split('\n')
      .filter((l) => l.includes('product-item') || l.includes('price') || l.includes('href'))
      .slice(0, 20);
    lines.forEach((l) => console.log('  |', l.trim().slice(0, 120)));
  } else {
    console.log('Usage: npx tsx probe-efl3.ts <charlton|portsmouth|leicester|millwall|derby>');
  }
}
main();
