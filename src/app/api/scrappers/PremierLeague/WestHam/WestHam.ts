import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeWestHam = async () => {
  const url = 'https://shop.whufc.com/kits/all-kit/';
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

    // Click 'Load More' button until all products are loaded
    let loadMoreSelector = '.js-load-more';
    let loadMoreVisible = true;
    while (loadMoreVisible) {
      loadMoreVisible = (await page.$(loadMoreSelector)) !== null;
      if (loadMoreVisible) {
        // ...existing code...
        await page.click(loadMoreSelector);
        await page.waitForTimeout(2000); // Wait for products to load
      }
    }

    // ...existing code...
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.product-list__product-wrapper').forEach((el) => {
        const name = el.querySelector('.product-list__title')?.textContent.trim();
        let productUrl = el.querySelector('a.measuringProductClick')?.getAttribute('href');
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://shop.whufc.com' + productUrl;
        }
        let priceText =
          el.querySelector('.product-list__nowprice .price-gbp')?.textContent.trim() || '';
        let price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        let currency = 'GBP';
        let image =
          el.querySelector('img.product-list__image')?.getAttribute('data-original') ||
          el.querySelector('img.product-list__image')?.getAttribute('src') ||
          '';
        if (image && image.startsWith('/')) {
          image = 'https://shop.whufc.com' + image;
        }
        // Sizes
        const sizes = [];
        el.querySelectorAll(
          '.product-list__quick-add-button-container input[type="submit"]',
        ).forEach((input) => {
          sizes.push({
            size: input.value,
            disabled: input.disabled,
          });
        });
        if (name && productUrl && price) {
          items.push({ name, productUrl, price, currency, image, sizes });
        }
      });
      return items;
    });
    // ...existing code...
    // Save data to output/west_ham.json
    // ...existing code...
    await browser.close();
    return products;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeWestHam;
