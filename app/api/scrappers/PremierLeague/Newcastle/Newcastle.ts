import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as cheerio from 'cheerio';
puppeteer.use(StealthPlugin());

const scrapeNewcastle = async () => {
  const urls = [
    'https://shop.newcastleunited.com/collections/all-25-26-home-kit',
    'https://shop.newcastleunited.com/collections/all-25-26-away-kit',
    'https://shop.newcastleunited.com/collections/all-25-26-third-kit',
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
    for (const url of urls) {
      // ...existing code...
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      let foundSelector = null;
      try {
        await page.waitForSelector('.product-card', { timeout: 15000 });
        foundSelector = '.product-card';
      } catch {
        // ...existing code...
      }
      // ...existing code...
      let products = [];
      if (foundSelector) {
        products = await page.evaluate((selector) => {
          const items = [];
          document.querySelectorAll(selector).forEach((card) => {
            const name = card.querySelector('.product-card__title a')?.textContent.trim();
            let priceText =
              card.querySelector('sale-price')?.textContent.trim() ||
              card.querySelector('sale-price span')?.textContent.trim();
            if (!priceText) priceText = card.querySelector('price-list .price')?.textContent.trim();
            let comparePriceText = card.querySelector('compare-at-price')?.textContent.trim();
            let price = priceText
              ? parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
              : null;
            let comparePrice = comparePriceText
              ? parseFloat(comparePriceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
              : null;
            let productUrl = card.querySelector('.product-card__title a')?.getAttribute('href');
            if (productUrl && productUrl.startsWith('/')) {
              productUrl = 'https://shop.newcastleunited.com' + productUrl;
            }
            let img = card.querySelector('img.product-card__image--primary')?.getAttribute('src');
            if (img && img.startsWith('//')) img = 'https:' + img;
            let badge = card.querySelector('.characteristic-badge')?.textContent.trim();
            let soldOut = !!card.querySelector('.badge--sold-out');
            let onSale = !!card.querySelector('.badge--on-sale');
            let currency = 'ARS';
            if (name && productUrl && price) {
              items.push({
                name,
                productUrl,
                price,
                comparePrice,
                img,
                badge,
                soldOut,
                onSale,
                currency,
              });
            }
          });
          return items;
        }, foundSelector);
      } else {
        // Fallback: get page HTML and use cheerio
        const html = await page.content();
        const $ = cheerio.load(html);
        $('.product-card').each((i, el) => {
          const name = $(el).find('.product-card__title a').text().trim();
          let priceText =
            $(el).find('sale-price').text().trim() || $(el).find('sale-price span').text().trim();
          if (!priceText) priceText = $(el).find('price-list .price').text().trim();
          let comparePriceText = $(el).find('compare-at-price').text().trim();
          let price = priceText
            ? parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
            : null;
          let comparePrice = comparePriceText
            ? parseFloat(comparePriceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
            : null;
          let productUrl = $(el).find('.product-card__title a').attr('href');
          if (productUrl && productUrl.startsWith('/')) {
            productUrl = 'https://shop.newcastleunited.com' + productUrl;
          }
          let img = $(el).find('img.product-card__image--primary').attr('src');
          if (img && img.startsWith('//')) img = 'https:' + img;
          let badge = $(el).find('.characteristic-badge').text().trim();
          let soldOut = $(el).find('.badge--sold-out').length > 0;
          let onSale = $(el).find('.badge--on-sale').length > 0;
          let currency = 'ARS';
          if (name && productUrl && price) {
            products.push({
              name,
              productUrl,
              price,
              comparePrice,
              img,
              badge,
              soldOut,
              onSale,
              currency,
            });
          }
        });
        // ...existing code...
      }
      // ...existing code...
      allProducts = allProducts.concat(products);
    }
    // ...existing code...
    await browser.close();
    return allProducts;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeNewcastle;
