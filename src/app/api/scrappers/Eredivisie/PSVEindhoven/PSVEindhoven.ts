// PSV Eindhoven official store (psvfanshop.nl) — Shopify.
// The store has an invalid/self-signed TLS certificate; --ignore-certificate-errors
// is passed to Chromium so Puppeteer can load the page.
// Navigates to the store homepage and follows the main wedstrijdkleding / kits
// navigation link to reach the jersey listing.

import { Product } from '../../PremierLeague/Product';

const STORE_BASE = 'https://psvfanshop.nl';

// Keywords (lowercase) used to pick the kit/jersey navigation link from the menu
const KIT_NAV_KEYWORDS = ['wedstrijd', 'shirt', 'tenu', 'kit', 'jersey', 'thuis'];

const scrapePSVEindhoven = async (): Promise<Product[]> => {
  let browser: any;
  try {
    // --ignore-certificate-errors handles the self-signed cert on psvfanshop.nl
    const isVercel = !!process.env.VERCEL;
    if (isVercel) {
      const chromium = (await import('@sparticuz/chromium')).default;
      const puppeteerCore = await import('puppeteer-core');
      browser = await puppeteerCore.launch({
        args: [...chromium.args, '--ignore-certificate-errors'],
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = await import('puppeteer');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors'],
      });
    }

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8' });

    // Load the homepage to discover the kit collection URL from the navigation
    await page.goto(STORE_BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Find the best-matching nav link for jerseys/kits
    const kitUrl: string | null = await page.evaluate(
      (storeBase: string, keywords: string[]) => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav a, header a'));
        for (const link of links) {
          const text = (link.textContent || '').toLowerCase();
          const href = link.getAttribute('href') || '';
          if (keywords.some((k) => text.includes(k)) && href.includes('/collections/')) {
            return href.startsWith('http') ? href : `${storeBase}${href}`;
          }
        }
        // Fallback: try common Shopify collection slugs
        return null;
      },
      STORE_BASE,
      KIT_NAV_KEYWORDS,
    );

    const targetUrl = kitUrl ?? `${STORE_BASE}/collections/all`;

    const response = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response || response.status() >= 400) {
      await browser.close();
      return [];
    }

    await new Promise((r) => setTimeout(r, 1500));
    await page.waitForSelector('a[href*="/products/"]', { timeout: 8000 }).catch(() => {});

    const products: Product[] = await page.evaluate((storeBase: string) => {
      const results: Array<{ name: string; price: number; productUrl: string; currency: string }> =
        [];
      const seen = new Set<string>();

      const anchors = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/products/"]'),
      );

      for (const anchor of anchors) {
        const href = anchor.getAttribute('href') || '';
        const productUrl = href.startsWith('http') ? href : `${storeBase}${href}`;
        // Skip variant/query links
        if (productUrl.includes('?') || productUrl.includes('#')) continue;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const card =
          anchor.closest<HTMLElement>(
            '.product-card-wrapper, .product-item, [class*="product-card"], [class*="product_card"]',
          ) ?? anchor.parentElement;

        let name = '';
        const img = anchor.querySelector<HTMLImageElement>('img[alt]');
        if (img) name = img.getAttribute('alt')?.trim() || '';
        if (!name) {
          const heading = card?.querySelector('h2, h3, h4, [class*="title"]');
          name = heading?.textContent?.trim() || anchor.textContent?.trim() || '';
        }
        if (!name || name.length < 3) continue;

        let price = 0;
        let el: HTMLElement | null = anchor.parentElement;
        for (let i = 0; i < 8; i++) {
          if (!el) break;
          const m = (el.innerText || '').match(/€\s*([\d]+[.,][\d]+)/);
          if (m) {
            price = parseFloat(m[1].replace(',', '.'));
            break;
          }
          el = el.parentElement;
        }
        if (price <= 0) continue;

        results.push({ name, productUrl, price, currency: 'EUR' });
      }
      return results;
    }, STORE_BASE);

    await browser.close();
    return products;
  } catch (e) {
    console.error('Error in scrapePSVEindhoven:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapePSVEindhoven;
