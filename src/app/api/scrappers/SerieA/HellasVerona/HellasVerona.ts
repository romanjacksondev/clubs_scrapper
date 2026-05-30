// Shopify store (store.hellasverona.it) — JS-rendered, Shopify API returns 401.
// Uses Playwright to render the kit-gara collection page and scrape product cards.

import { Product } from '../../shared/Product';

const BASE_URL = 'https://store.hellasverona.it';
const COLLECTION_URL = `${BASE_URL}/collections/kit-gara`;

const scrapeHellasVerona = async (): Promise<Product[]> => {
  let browser = null;
  try {
    const { launchAndNavigate } = await import('../../shared/playwrightUtils');
    const { browser: b, page } = await launchAndNavigate(COLLECTION_URL, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    browser = b;

    // Wait for Shopify product cards to render
    await page
      .waitForSelector('.product-card, .product-item, .card--product, [data-product-id]', {
        timeout: 10000,
      })
      .catch(() => {});

    const items = await page.evaluate((baseUrl: string) => {
      const results: Array<{ name: string; url: string; price: number }> = [];
      const cards = document.querySelectorAll(
        '.product-card, .product-item, .card--product, [data-product-id], .grid__item',
      );
      cards.forEach((card) => {
        const link = card.querySelector('a[href*="/products/"]') as HTMLAnchorElement | null;
        const titleEl = card.querySelector(
          '.product-card__title, .card__heading, .product-item__title, h3, h2',
        );
        const priceEl = card.querySelector('.price, .price__regular, .money');
        if (!link || !titleEl) return;
        const name = titleEl.textContent?.trim() ?? '';
        const href = link.getAttribute('href') ?? '';
        const url = href.startsWith('http') ? href : baseUrl + href;
        const priceText = priceEl?.textContent ?? '';
        const price =
          parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
        if (name && url) results.push({ name, url, price });
      });
      return results;
    }, BASE_URL);

    const seen = new Set<string>();
    return items.flatMap((p) => {
      if (!p.name || !p.url || seen.has(p.url)) return [];
      seen.add(p.url);
      return [{ name: p.name, productUrl: p.url, price: p.price, currency: 'EUR' }];
    });
  } catch {
    return [];
  } finally {
    if (browser) await (browser as import('playwright').Browser).close();
  }
};

export default scrapeHellasVerona;
