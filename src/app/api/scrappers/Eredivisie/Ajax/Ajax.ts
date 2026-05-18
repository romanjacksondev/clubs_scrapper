// Ajax official store (www.ajax.nl/shop) — custom Next.js + Umbraco CMS storefront.
// Products are fetched client-side; Puppeteer is needed to render the page.
// Kit categories live at /shop/wedstrijd/{thuistenue|uittenue|derde-tenue|keeperstenue}.

import { Product } from '../../shared/Product';
import { launchBrowser } from '../../shared/puppeteerUtils';

const STORE_BASE = 'https://www.ajax.nl';

const KIT_URLS = [
  `${STORE_BASE}/shop/wedstrijd/thuistenue`,
  `${STORE_BASE}/shop/wedstrijd/uittenue`,
  `${STORE_BASE}/shop/wedstrijd/derde-tenue`,
  `${STORE_BASE}/shop/wedstrijd/keeperstenue`,
];

const scrapeAjax = async (): Promise<Product[]> => {
  let browser: any;
  try {
    browser = await launchBrowser(true);

    const seen = new Set<string>();
    const allProducts: Product[] = [];

    for (const url of KIT_URLS) {
      const page = await browser.newPage();
      try {
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        );
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8' });

        const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        if (!response || response.status() >= 400) {
          await page.close();
          continue;
        }

        // Wait for product cards to hydrate
        await new Promise((r) => setTimeout(r, 2000));
        await page.waitForSelector('a[href*="/shop/"]', { timeout: 8000 }).catch(() => {});

        const products: Product[] = await page.evaluate((storeBase: string) => {
          const results: Array<{
            name: string;
            price: number;
            productUrl: string;
            currency: string;
          }> = [];
          const seen = new Set<string>();

          // Product links on the ajax.nl shop contain /shop/ in the href
          const anchors = Array.from(
            document.querySelectorAll<HTMLAnchorElement>('a[href*="/shop/"]'),
          );

          for (const anchor of anchors) {
            const href = anchor.getAttribute('href') || '';
            // Skip category/navigation links — product links contain a slug after the category
            if (!href.match(/\/shop\/[^/]+\/[^/]+/)) continue;

            const productUrl = href.startsWith('http') ? href : `${storeBase}${href}`;
            if (seen.has(productUrl)) continue;
            seen.add(productUrl);

            // Look for name in <img alt>, <h2>, <h3>, or the anchor text
            let name = '';
            const img = anchor.querySelector<HTMLImageElement>('img[alt]');
            if (img) {
              name = img.getAttribute('alt')?.trim() || '';
            }
            if (!name) {
              const heading = anchor.querySelector('h2, h3, h4');
              name = heading?.textContent?.trim() || anchor.textContent?.trim() || '';
            }
            if (!name || name.length < 3) continue;

            // Walk up the DOM to find a price (€XX,XX or €XX.XX)
            let price = 0;
            let el: HTMLElement | null = anchor;
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

        for (const p of products) {
          if (!seen.has(p.productUrl)) {
            seen.add(p.productUrl);
            allProducts.push(p);
          }
        }
      } catch (err) {
        console.error(`Ajax: error scraping ${url}:`, err);
      } finally {
        await page.close();
      }
    }

    await browser.close();
    return allProducts;
  } catch (e) {
    console.error('Error in scrapeAjax:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeAjax;
