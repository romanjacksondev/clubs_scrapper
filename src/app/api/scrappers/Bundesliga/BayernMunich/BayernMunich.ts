// FC Bayern München official store (fcbayern.com/store) — Scayle platform.
// Playwright with de-DE locale + Europe/Berlin timezone. May still return 403 from non-EU IPs (Akamai).
// Category paths: /de-de/c/adidas/trikots-mehr/{home,away,champions-league,torwart}

import { Product } from '../../shared/Product';
import { launchPlaywright } from '../../shared/playwrightUtils';

const STORE_BASE = 'https://fcbayern.com/store';

const CATEGORIES = [
  `${STORE_BASE}/de-de/c/adidas/trikots-mehr/home`,
  `${STORE_BASE}/de-de/c/adidas/trikots-mehr/away`,
  `${STORE_BASE}/de-de/c/adidas/trikots-mehr/champions-league`,
  `${STORE_BASE}/de-de/c/adidas/trikots-mehr/torwart`,
];

const scrapeBayernMunich = async (): Promise<Product[]> => {
  const browser = await launchPlaywright();
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    viewport: { width: 1280, height: 800 },
    extraHTTPHeaders: {
      'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const allProducts: Product[] = [];
  const seen = new Set<string>();

  try {
    const page = await context.newPage();

    for (const catUrl of CATEGORIES) {
      try {
        const response = await page.goto(catUrl, { waitUntil: 'networkidle', timeout: 30000 });

        if (!response || response.status() === 403) {
          console.warn(`scrapeBayernMunich: HTTP ${response?.status()} at ${catUrl}`);
          continue;
        }

        const finalUrl = page.url();
        if (!finalUrl.includes('fcbayern.com/store')) continue;

        // Scayle renders product links with /p/ in path
        await page.waitForSelector('a[href*="/p/"]', { timeout: 10000 }).catch(() => {});

        const catProducts = await page.$$eval(
          'a[href*="/p/"]',
          (links, base) => {
            const results: { name: string; productUrl: string; price: number; currency: string }[] =
              [];
            for (const link of links as HTMLAnchorElement[]) {
              const href = link.href;
              if (!href || !href.includes(base)) continue;

              const nameEl =
                link.querySelector('[class*="name"], [class*="title"], h2, h3') ||
                link
                  .closest('[class*="product"]')
                  ?.querySelector('[class*="name"], [class*="title"]');
              const name = (nameEl?.textContent || link.textContent || '').trim();
              if (!name || name.length < 3) continue;

              const card = link.closest('[class*="product"], article, li') || link.parentElement;
              const priceEl = card?.querySelector('[class*="price"], [class*="Price"]');
              const priceText = priceEl?.textContent || '';
              const priceMatch = priceText.match(/([\d]+[,.][\d]+)/);
              const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : 0;
              if (price > 0) {
                results.push({ name, productUrl: href, price, currency: 'EUR' });
              }
            }
            return results;
          },
          STORE_BASE,
        );

        for (const p of catProducts) {
          if (!seen.has(p.productUrl)) {
            seen.add(p.productUrl);
            allProducts.push(p);
          }
        }
      } catch (e) {
        console.warn(`scrapeBayernMunich: error at ${catUrl}:`, e);
      }
    }

    return allProducts;
  } catch (e) {
    console.error('Error in scrapeBayernMunich:', e);
    return [];
  } finally {
    await browser.close();
  }
};

export default scrapeBayernMunich;
