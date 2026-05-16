import { launchBrowser } from '../puppeteerUtils';

const BASE_URL = 'https://shop.avfc.co.uk';
// Aston Villa shop runs on Fanatics. Direct requests to most URLs are blocked (403)
// by Imperva, but navigating from www.avfc.co.uk first sets a session cookie that
// allows access to /en/kits/. That page fires a JSON API call to
// /api/product-data?type=collection-explorer which returns all 21 kit products.
// We intercept that response instead of scraping the DOM.

export default async function scrapeAstonVilla() {
  let browser;
  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // Visit the main AVFC site first so the shop recognises us as a referral visitor
    await page.goto('https://www.avfc.co.uk/', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // Collect the product-data API response as it loads
    let productData: any = null;
    page.on('response', async (resp: any) => {
      if (resp.url().includes('product-data') && !productData) {
        try {
          productData = await resp.json();
        } catch {
          /* ignore parse errors */
        }
      }
    });

    await page.goto(`${BASE_URL}/en/kits/`, { waitUntil: 'networkidle2', timeout: 60000 });

    const products: any[] = productData?.search?.products ?? [];

    await browser.close();

    return products
      .map((p: any) => {
        const name: string = p.title?.trim();
        const relUrl: string = p.url?.trim();
        if (!name || !relUrl) return null;
        const productUrl = `${BASE_URL}/${relUrl}`;
        const priceStr =
          p.price?.clearance?.money?.userCurrencyValue ||
          p.price?.sale?.money?.userCurrencyValue ||
          p.price?.regular?.money?.userCurrencyValue;
        const price = parseFloat(priceStr);
        if (!price) return null;
        return { name, productUrl, price, currency: 'GBP' };
      })
      .filter(Boolean);
  } catch (e) {
    console.error('Error in scrapeAstonVilla:', e);
    if (browser) await browser.close();
    return [];
  }
}
