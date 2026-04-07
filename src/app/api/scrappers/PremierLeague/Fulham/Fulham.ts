import * as cheerio from 'cheerio';
import { launchAndGetPage } from '../puppeteerUtils';

const scrapeFulham = async function () {
  const url = 'https://shop.fulhamfc.com/kit/kitviewall/';
  let browser;
  try {
    // ...existing code...
    const { browser: b, page } = await launchAndGetPage(url);
    browser = b;
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
        // ...existing code...
      }
    }
    // ...existing code...
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
            productUrl = 'https://shop.fulhamfc.com' + productUrl;
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
          productUrl = 'https://shop.fulhamfc.com' + productUrl;
        }
        const currency = 'GBP';
        if (name && price && productUrl) {
          products.push({ name, productUrl, price, currency });
        }
      });
      // If still no products, log a snippet of HTML and take a screenshot for debugging
      // ...existing code...
    }
    // ...existing code...
    // Save data to output/fulham.json
    // ...existing code...
    await browser.close();
    return products;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeFulham;
