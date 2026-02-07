import puppeteer from 'puppeteer';

const scrapeBrentford = async function () {
  const url = 'https://shop.brentfordfc.com/kit/all-2526-kits/';
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Wait for products to load
    await page.waitForSelector('.cell.product-list__product', { timeout: 20000 });
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.cell.product-list__product').forEach((el) => {
        // Name from .product-list__title inside .product-list__desc-text
        const name = el
          .querySelector('.product-list__desc-text .product-list__title')
          ?.textContent.trim();
        // Price from .product-list__nowprice .price-gbp
        let priceText = el.querySelector('.product-list__nowprice .price-gbp')?.textContent.trim();
        if (!priceText) {
          // Fallback: look for any .price-gbp
          priceText = el.querySelector('.price-gbp')?.textContent.trim() || '';
        }
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        // Product URL from .product-list__desc-text
        let productUrl = el.querySelector('.product-list__desc-text')?.getAttribute('href');
        if (!productUrl) {
          // Fallback: try .measuringProductClick
          productUrl = el.querySelector('.measuringProductClick')?.getAttribute('href');
        }
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://shop.brentfordfc.com' + productUrl;
        }
        const currency = 'GBP';
        if (name && price && productUrl) {
          items.push({ name, productUrl, price, currency });
        }
      });
      return items;
    });
    await browser.close();
    return products;
  } catch (e) {
    if (browser) await browser.close();
    return [];
  }
};
export default scrapeBrentford;
