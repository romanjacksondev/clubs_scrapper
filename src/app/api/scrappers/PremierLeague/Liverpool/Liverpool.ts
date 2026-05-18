import { launchBrowser } from '../../shared/puppeteerUtils';

const BASE_URL = 'https://store.liverpoolfc.com';
// Liverpool store runs on Magento 2 with a custom Lfc theme, fronted by Queue-it
// (Cloudflare virtual queue). Plain fetch is 302'd to the queue; stealth Puppeteer
// passes as a real browser. Products use standard Magento selectors:
// .product-item > .product-item-name a (name+url) and .price-box .price (price).

const scrapeLiverpool = async () => {
  let browser;
  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    const kitUrls = [
      `${BASE_URL}/kit/home-kit`,
      `${BASE_URL}/kit/away-kit`,
      `${BASE_URL}/kit/third-kit`,
      `${BASE_URL}/kit/goalkeeper`,
    ];

    const seen = new Set<string>();
    const allProducts: { name: string; productUrl: string; price: number; currency: string }[] = [];

    for (const url of kitUrls) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      const products = await page.evaluate(() => {
        const items: { name: string; productUrl: string; price: number }[] = [];
        document.querySelectorAll('.product-item').forEach((el) => {
          const anchor =
            el.querySelector<HTMLAnchorElement>('.product-item-name a') ||
            el.querySelector<HTMLAnchorElement>('.product-item-link');
          const name = anchor?.textContent?.trim();
          const productUrl = anchor?.href;
          const priceEl =
            el.querySelector('[data-price-type="finalPrice"] .price') ||
            el.querySelector('.price-box .price');
          const price = priceEl
            ? parseFloat(priceEl.textContent?.trim().replace(/[^0-9.]/g, '') ?? '')
            : NaN;
          if (name && productUrl && price > 0) items.push({ name, productUrl, price });
        });
        return items;
      });

      for (const p of products) {
        if (!seen.has(p.productUrl)) {
          seen.add(p.productUrl);
          allProducts.push({ ...p, currency: 'GBP' });
        }
      }
    }

    await browser.close();
    return allProducts;
  } catch (e) {
    console.error('Error in scrapeLiverpool:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeLiverpool;
