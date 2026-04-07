import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { Product } from '../Product';

const scrapeBournemouth = async function () {
  const url = 'https://superstore.afcb.co.uk/afc-bournemouth/kit';
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    const html = await page.content();
    await browser.close();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    $('.ProductCell').each((i, el) => {
      // Name from .productTitle a
      const name = $(el).find('.productTitle a').text().trim();
      // Price from .productPrice .displayPrice
      let priceText = $(el).find('.productPrice .displayPrice').first().text().trim();
      if (!priceText) {
        priceText =
          $(el)
            .text()
            .match(/\£[0-9,.]+/)?.[0] || '';
      }
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      // Product URL from .productTitle a
      let productUrl = $(el).find('.productTitle a').attr('href');
      if (productUrl && productUrl.startsWith('..')) {
        productUrl = 'https://superstore.afcb.co.uk' + productUrl.replace('..', '');
      } else if (productUrl && productUrl.startsWith('/')) {
        productUrl = 'https://superstore.afcb.co.uk' + productUrl;
      }
      const currency = 'GBP';
      if (name && price && productUrl) {
        products.push({ name, productUrl, price, currency });
      }
    });
    return products;
  } catch (e) {
    return [];
  }
};
export default scrapeBournemouth;
