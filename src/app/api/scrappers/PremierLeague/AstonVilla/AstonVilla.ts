import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
export default async function scrapeAstonVilla() {
  const url =
    'https://shop3.avfc.co.uk/en/aston-villa-football-kits/t-31876437+d-3405109404+z-96-4265943694';
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    try {
      await page.waitForSelector('.ds-card', { timeout: 20000 });
    } catch (waitErr) {
      const html = await page.content();
      throw waitErr;
    }
    const html = await page.content();
    const $ = cheerio.load(html);
    const products: { name: string; productUrl: string; price: number; currency: string }[] = [];
    $('.ds-card').each((i, el) => {
      const anchor = $(el).find('.ds-card-media a').first();
      const details = $(el).find('.ds-card-details');
      const name = details.find('.ds-card-title').text().trim();
      let productUrl = anchor.attr('href');
      if (productUrl && !productUrl.startsWith('http')) {
        productUrl = 'https://shop3.avfc.co.uk' + productUrl;
      }
      let priceText = details.find('.minimal-price .money-value').first().text().trim();
      let price = null;
      let currency = null;
      if (priceText) {
        const match = priceText.match(/([A-Z]{2}\$|\£|\€)([0-9,.]+)/);
        if (match) {
          price = parseFloat(match[2].replace(/,/g, ''));
          if (match[1] === 'US$') currency = 'USD';
          else if (match[1] === '£') currency = 'GBP';
          else if (match[1] === '€') currency = 'EUR';
        }
      }
      if (!price) {
        priceText = details.find('.money-value').first().text().trim();
        const match = priceText.match(/([A-Z]{2}\$|\£|\€)([0-9,.]+)/);
        if (match) {
          price = parseFloat(match[2].replace(/,/g, ''));
          if (match[1] === 'US$') currency = 'USD';
          else if (match[1] === '£') currency = 'GBP';
          else if (match[1] === '€') currency = 'EUR';
        }
      }
      if (name && price && currency && productUrl) {
        products.push({ name, productUrl, price, currency });
      }
    });
    return products;
  } catch (e) {
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
