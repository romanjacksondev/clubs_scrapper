import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
puppeteer.use(StealthPlugin());

const scrapeLiverpool = async () => {
  const URLs = [
    'https://store.liverpoolfc.com/kit/home-kit',
    'https://store.liverpoolfc.com/kit/away-kit',
    'https://store.liverpoolfc.com/kit/third-kit',
    'https://store.liverpoolfc.com/kit/goalkeeper',
  ];
  let browser;
  let allProducts = [];
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
    for (const url of URLs) {
      // ...existing code...
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      // Try to wait for multiple possible selectors
      let foundSelector = null;
      try {
        await page.waitForSelector('.ds-card', { timeout: 15000 });
        foundSelector = '.ds-card';
      } catch {
        try {
          await page.waitForSelector('.product-card', { timeout: 10000 });
          foundSelector = '.product-card';
        } catch {
          // ...existing code...
        }
      }
      // ...existing code...
      let products = [];
      if (foundSelector) {
        products = await page.evaluate((selector) => {
          const items = [];
          document.querySelectorAll(selector).forEach((card) => {
            // Name from .ds-card-title
            const name = card.querySelector('.ds-card-title')?.textContent.trim();
            // Price from .money-value
            let priceText = card.querySelector('.money-value')?.textContent.trim();
            const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
            // Product URL from .ds-card-details > a or .ds-card-media > a
            let productUrl =
              card.querySelector('.ds-card-details a')?.getAttribute('href') ||
              card.querySelector('.ds-card-media a')?.getAttribute('href');
            if (productUrl && productUrl.startsWith('/')) {
              productUrl = 'https://store.liverpoolfc.com' + productUrl;
            }
            const currency = 'GBP';
            if (name && price && productUrl) {
              items.push({ name, productUrl, price, currency });
            }
          });
          // Also extract from .result-wrapper
          document.querySelectorAll('.result-wrapper').forEach((el) => {
            const name = el.querySelector('h3[itemprop="name"]')?.textContent.trim();
            let productUrl =
              el.querySelector('meta[itemprop="url"]')?.getAttribute('content') ||
              el.querySelector('a.result')?.getAttribute('href');
            let priceText =
              el.querySelector('meta[itemprop="price"]')?.getAttribute('content') ||
              el.querySelector('.after_special')?.textContent.trim();
            let currency =
              el.querySelector('meta[itemprop="priceCurrency"]')?.getAttribute('content') || 'GBP';
            if (!priceText) {
              priceText = el.querySelector('.price')?.textContent.trim();
            }
            let price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
            if (productUrl && productUrl.startsWith('/')) {
              productUrl = 'https://store.liverpoolfc.com' + productUrl;
            }
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
        $('.ds-card').each((i, el) => {
          const name = $(el).find('.ds-card-title').text().trim();
          let priceText = $(el).find('.money-value').first().text().trim();
          const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
          let productUrl =
            $(el).find('.ds-card-details a').attr('href') ||
            $(el).find('.ds-card-media a').attr('href');
          if (productUrl && productUrl.startsWith('/')) {
            productUrl = 'https://store.liverpoolfc.com' + productUrl;
          }
          const currency = 'GBP';
          if (name && price && productUrl) {
            products.push({ name, productUrl, price, currency });
          }
        });
        // Also extract from .result-wrapper
        $('.result-wrapper').each((i, el) => {
          const name = $(el).find('h3[itemprop="name"]').text().trim();
          let productUrl =
            $(el).find('meta[itemprop="url"]').attr('content') ||
            $(el).find('a.result').attr('href');
          let priceText =
            $(el).find('meta[itemprop="price"]').attr('content') ||
            $(el).find('.after_special').text().trim();
          let currency = $(el).find('meta[itemprop="priceCurrency"]').attr('content') || 'GBP';
          if (!priceText) {
            priceText = $(el).find('.price').text().trim();
          }
          let price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
          if (productUrl && productUrl.startsWith('/')) {
            productUrl = 'https://store.liverpoolfc.com' + productUrl;
          }
          if (name && price && productUrl) {
            products.push({ name, productUrl, price, currency });
          }
        });
        // If still no products, log a snippet of HTML and take a screenshot for debugging
        if (products.length === 0) {
          const debugDir = path.resolve(__dirname, '../output');
          if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir, { recursive: true });
          }
          const htmlSnippet = html.slice(0, 2000);
          fs.writeFileSync(path.join(debugDir, 'liverpool_debug.html'), htmlSnippet, 'utf8');
          await page.screenshot({
            path: path.join(debugDir, 'liverpool_debug.png'),
            fullPage: true,
          });
          // ...existing code...
        }
      }
      // ...existing code...
      allProducts = allProducts.concat(products);
    }
    // Save data to output/liverpool.json
    // ...existing code...
    await browser.close();
    return allProducts;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeLiverpool;
