// SC Heerenveen official store (www.heerenveenshop.nl).
// Platform is unconfirmed; Puppeteer with stealth handles both Shopify and
// other e-commerce platforms.
// Navigates to the homepage, discovers the jersey/kit collection link in the
// navigation, then scrapes product cards.

import { Product } from '../../PremierLeague/Product';
import { launchBrowser } from '../../PremierLeague/puppeteerUtils';

const STORE_BASE = 'https://www.heerenveenshop.nl';

const KIT_NAV_KEYWORDS = ['wedstrijd', 'shirt', 'tenu', 'kit', 'jersey', 'thuis'];

const scrapeSCHeerenveen = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8' });

    await page.goto(STORE_BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Try to discover a kit/jersey collection from the navigation
    const kitUrl: string | null = await page.evaluate(
      (storeBase: string, keywords: string[]) => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('nav a, header a'));
        for (const link of links) {
          const text = (link.textContent || '').toLowerCase();
          const href = link.getAttribute('href') || '';
          if (keywords.some((k) => text.includes(k)) && href.length > 1) {
            return href.startsWith('http') ? href : `${storeBase}${href}`;
          }
        }
        return null;
      },
      STORE_BASE,
      KIT_NAV_KEYWORDS,
    );

    if (kitUrl && kitUrl !== STORE_BASE) {
      const response = await page.goto(kitUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      if (!response || response.status() >= 400) {
        await browser.close();
        return [];
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    await page
      .waitForSelector('a[href*="/products/"], a[href*="product"], .product-card, .product-item', {
        timeout: 8000,
      })
      .catch(() => {});

    const products: Product[] = await page.evaluate((storeBase: string) => {
      const results: Array<{ name: string; price: number; productUrl: string; currency: string }> =
        [];
      const seen = new Set<string>();

      // Cover both Shopify (/products/) and generic product link patterns
      const anchors = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href*="/products/"], a[href*="product"]'),
      );

      for (const anchor of anchors) {
        const href = anchor.getAttribute('href') || '';
        if (!href || href.includes('?') || href.includes('#')) continue;
        const productUrl = href.startsWith('http') ? href : `${storeBase}${href}`;
        if (seen.has(productUrl)) continue;
        seen.add(productUrl);

        const card =
          anchor.closest<HTMLElement>(
            '.product-card-wrapper, .product-item, [class*="product-card"], [class*="product_card"], [class*="ProductCard"]',
          ) ?? anchor.parentElement;

        let name = '';
        const img = anchor.querySelector<HTMLImageElement>('img[alt]');
        if (img) name = img.getAttribute('alt')?.trim() || '';
        if (!name) {
          const heading = card?.querySelector('h2, h3, h4, [class*="title"], [class*="name"]');
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
    console.error('Error in scrapeSCHeerenveen:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeSCHeerenveen;
