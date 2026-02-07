import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeTottenham = async () => {
  const url = 'https://shop.tottenhamhotspur.com/all-spurs-kit';
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
    await page.waitForSelector('.product-card', { timeout: 20000 });
    // ...existing code...
    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.product-card').forEach((el) => {
        const name = el.querySelector('.product-card__title')?.textContent.trim();
        let productUrl = el.querySelector('a.product-card__title')?.getAttribute('href');
        if (!productUrl) {
          productUrl = el.querySelector('a[href]')?.getAttribute('href');
        }
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://shop.tottenhamhotspur.com' + productUrl;
        }
        let priceText =
          el.querySelector('.product-price__price')?.getAttribute('ge-priceformat-baseprice') ||
          el.querySelector('.product-price__price')?.textContent.trim() ||
          '';
        let price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        let currency = 'GBP';
        let image = el.querySelector('img')?.getAttribute('src') || '';
        if (name && productUrl && price) {
          items.push({ name, productUrl, price, currency, image });
        }
      });
      return items;
    });
    // ...existing code...
    // Save data to output/tottenham.json
    // ...existing code...
    await browser.close();
    return products;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeTottenham;
