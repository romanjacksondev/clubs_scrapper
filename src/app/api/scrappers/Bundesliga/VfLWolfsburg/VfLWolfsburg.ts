// VfL Wolfsburg official store (shop.vfl-wolfsburg.de) — Shopware 6.
// Jerseys at /trikots-co/spieloutfits/heim/ and /auswaerts/ (products are JS-rendered, requires Puppeteer).
// Card: .product-box, name: a.product-image-link[title], price: .product-price-info

import { Product } from '../../PremierLeague/Product';
import { launchBrowser } from '../../PremierLeague/puppeteerUtils';

const BASE_URL = 'https://shop.vfl-wolfsburg.de';

const KIT_PAGES = [
  `${BASE_URL}/trikots-co/spieloutfits/heim/`,
  `${BASE_URL}/trikots-co/spieloutfits/auswaerts/`,
];

export default async function scrapeVfLWolfsburg(): Promise<Product[]> {
  let browser: any;
  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'de-DE,de;q=0.9' });

    const products: Product[] = [];
    const seen = new Set<string>();

    for (const pageUrl of KIT_PAGES) {
      const response = await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      if (!response || response.status() >= 400) continue;

      await new Promise((r) => setTimeout(r, 1000));
      await page.waitForSelector('.product-box', { timeout: 8000 }).catch(() => {});

      const pageProducts: Product[] = await page.evaluate((base: string) => {
        return Array.from(document.querySelectorAll<HTMLElement>('.product-box')).map((card) => {
          const link = card.querySelector<HTMLAnchorElement>('a.product-image-link');
          const name = link?.getAttribute('title')?.trim() || '';
          const href = link?.getAttribute('href') || '';
          const productUrl = href.startsWith('http') ? href : `${base}${href}`;
          const priceText = card.querySelector('.product-price-info')?.textContent || '';
          const m = priceText.match(/([\d]+,[\d]+)\s*€/);
          const price = m ? parseFloat(m[1].replace(',', '.')) : 0;
          return { name, productUrl, price, currency: 'EUR' };
        });
      }, BASE_URL);

      for (const p of pageProducts) {
        if (p.name && p.price > 0 && !seen.has(p.productUrl)) {
          seen.add(p.productUrl);
          products.push(p);
        }
      }
    }

    await browser.close();
    return products;
  } catch (e) {
    console.error('scrapeVfLWolfsburg error:', e);
    if (browser) await browser.close();
    return [];
  }
}
