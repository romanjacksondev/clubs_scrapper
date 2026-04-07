import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const scrapeCrystalPalace = async function () {
  const url = 'https://shop.cpfc.co.uk/kit/all-kit/';
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Try to wait for multiple possible selectors
    let foundSelector = null;
    try {
      await page.waitForSelector('.cell.product-list__product', { timeout: 15000 });
      foundSelector = '.cell.product-list__product';
    } catch {
      try {
        await page.waitForSelector('.product-list__product-wrapper', { timeout: 10000 });
        foundSelector = '.product-list__product-wrapper';
      } catch {
        // Could not find expected product selectors, falling back to HTML extraction.
      }
    }
    let products = [];
    if (foundSelector) {
      products = await page.evaluate((selector) => {
        const items: any[] = [];
        document.querySelectorAll(selector).forEach((el) => {
          // Name from .product-list__title inside .product-list__desc-text
          const name = el
            .querySelector('.product-list__desc-text .product-list__title')
            ?.textContent.trim();
          // Price from .product-list__nowprice .price-gbp
          let priceText = el
            .querySelector('.product-list__nowprice .price-gbp')
            ?.textContent.trim();
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
            productUrl = 'https://shop.cpfc.co.uk' + productUrl;
          }
          const currency = 'GBP';
          if (name && price && productUrl) {
            items.push({ name, productUrl, price, currency });
          }
        });
        return items;
      }, foundSelector);
    } else {
      // Fallback: get page HTML and use cheerio
      const html = await page.content();
      const $ = cheerio.load(html);
      $('.product-list__product-wrapper').each((i, el) => {
        const name = $(el).find('.product-list__desc-text .product-list__title').text().trim();
        let priceText = $(el).find('.product-list__nowprice .price-gbp').first().text().trim();
        if (!priceText) {
          priceText = $(el).find('.price-gbp').first().text().trim();
        }
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        let productUrl = $(el).find('.product-list__desc-text').attr('href');
        if (!productUrl) {
          productUrl = $(el).find('.measuringProductClick').attr('href');
        }
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://shop.cpfc.co.uk' + productUrl;
        }
        const currency = 'GBP';
        if (name && price && productUrl) {
          products.push({ name, productUrl, price, currency });
        }
      });
    }
    await browser.close();
    return products;
  } catch (e) {
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeCrystalPalace;
