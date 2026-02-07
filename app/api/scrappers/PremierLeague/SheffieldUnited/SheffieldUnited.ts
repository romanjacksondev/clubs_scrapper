import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeSheffieldUnited = async () => {
  const url = 'https://www.sufcdirect.co.uk/kit/all-kits/all-kits/';
  let browser;
  try {
    // ...existing code...
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    // ...existing code...
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait for products to load
    await page.waitForSelector('.product-list__product-wrapper', { timeout: 20000 });
    // ...existing code...
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.product-list__product-wrapper').forEach((el) => {
        const name = el
          .querySelector('.product-list__desc-text .product-list__title')
          ?.textContent.trim();
        let priceText = el.querySelector('.product-list__nowprice .price-gbp')?.textContent.trim();
        if (!priceText) {
          priceText = el.querySelector('.price-gbp')?.textContent.trim() || '';
        }
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        let productUrl = el.querySelector('.product-list__desc-text')?.getAttribute('href');
        if (!productUrl) {
          productUrl = el.querySelector('.measuringProductClick')?.getAttribute('href');
        }
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://www.sufcdirect.co.uk' + productUrl;
        }
        const currency = 'GBP';
        if (name && price && productUrl) {
          items.push({ name, productUrl, price, currency });
        }
      });
      return items;
    });
    // ...existing code...
    // ...existing code...
    await browser.close();
    return products;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeSheffieldUnited;
