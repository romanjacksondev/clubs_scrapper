/**
 * Test for the Chelsea scrapper
 * Run with: node tests/chelsea.test.mjs
 */
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteerExtra.use(StealthPlugin());

const BASE_URL = 'https://store.chelseafc.com';
let browser;
try {
  browser = await puppeteerExtra.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

  let productData = null;
  page.on('response', async (resp) => {
    if (resp.url().includes('product-data') && !productData) {
      try { productData = await resp.json(); } catch {}
    }
  });

  console.log('Navigating...');
  await page.goto(BASE_URL + '/collections/mens-kits', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('URL:', page.url());

  if (productData) {
    const products = productData?.search?.products ?? [];
    console.log('Products from API:', products.length);
    products.slice(0,5).forEach(p => {
      const price = p.price?.clearance?.money?.userCurrencyValue || p.price?.sale?.money?.userCurrencyValue || p.price?.regular?.money?.userCurrencyValue;
      console.log({ name: p.title, price, url: p.url?.slice(0,60) });
    });
  } else {
    console.log('No product-data API — checking DOM...');
    const dom = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.product-card').forEach(el => {
        const a = el.querySelector('a');
        const name = a?.getAttribute('aria-label')?.trim() || el.querySelector('[class*="product-name"]')?.textContent?.trim();
        const price = el.querySelector('[class*="price"]')?.textContent?.trim();
        if (name) items.push({ name: name.slice(0,70), price, href: a?.href?.slice(0,80) });
      });
      return items;
    });
    console.log('DOM products (first 5):', dom.slice(0,5));
  }
} finally {
  if (browser) await browser.close();
}
