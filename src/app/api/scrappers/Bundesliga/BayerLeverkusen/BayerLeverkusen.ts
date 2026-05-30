// Bayer 04 Leverkusen official store (www.bayer04.de/de-de/shop/) — protected by Queue-it.
// Playwright with de-DE locale + Europe/Berlin timezone bypasses Queue-it bot detection.
// Products are SSR — grab page.content() immediately after domcontentloaded before Queue-it
// JS can navigate away ("Execution context was destroyed" race condition).
// Selectors: a[class*="c-product-box-link"] → [class*="c-product-box__title"] + last .price-value

import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';
import { launchPlaywright } from '../../shared/playwrightUtils';

const STORE_BASE = 'https://www.bayer04.de';
const JERSEYS_URL = `${STORE_BASE}/de-de/shop/trikots/`;

const QUEUEIT_MARKERS = ['queue-it', 'queueit', 'staytuned', 'waitingroom'];
const isQueueIt = (s: string) => QUEUEIT_MARKERS.some((m) => s.toLowerCase().includes(m));

const scrapeBayerLeverkusen = async (): Promise<Product[]> => {
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

  try {
    const page = await context.newPage();

    let html = '';
    try {
      await page.goto(JERSEYS_URL, { waitUntil: 'domcontentloaded', timeout: 25000 });
      // Capture HTML immediately — before Queue-it JS can navigate away
      html = await page.content();
    } catch {
      html = await page.content().catch(() => '');
    }

    if (isQueueIt(page.url()) || isQueueIt(html)) {
      console.warn('scrapeBayerLeverkusen: Queue-it detected');
      return [];
    }

    const $ = cheerio.load(html);
    const products: Product[] = [];
    const seen = new Set<string>();

    $('a[class*="c-product-box-link"]').each((_, el) => {
      const rawHref = $(el).attr('href') || '';
      if (!rawHref) return;
      const productUrl = rawHref.startsWith('http') ? rawHref : `${STORE_BASE}${rawHref}`;
      if (seen.has(productUrl)) return;
      seen.add(productUrl);

      const name = $(el).find('[class*="c-product-box__title"]').first().text().trim();
      if (!name || name.length < 3) return;

      // Last price-value is the actual selling price (sale overrides regular)
      const priceEls = $(el).find('[class*="price-value"]');
      const priceText = priceEls.last().text().trim();
      const price = parseFloat(priceText.replace(',', '.'));
      if (price <= 0) return;

      products.push({ name, productUrl, price, currency: 'EUR' });
    });

    return products;
  } catch (e) {
    console.error('Error in scrapeBayerLeverkusen:', e);
    return [];
  } finally {
    await browser.close();
  }
};

export default scrapeBayerLeverkusen;
