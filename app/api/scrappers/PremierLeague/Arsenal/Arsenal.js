import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export default async function scrapeArsenal() {
  const url = 'https://arsenaldirect.arsenal.com/Football-Shirts-and-Kit/c/kit';
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector("[data-testid='ProductGridItem']", { timeout: 20000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    const shirts = [];
    $("[data-testid='ProductGridItem']").each((i, el) => {
      const anchor = $(el).find('a').first();
      const name = anchor.find('.typography--body3').first().text().trim();
      let priceText = anchor.find('.typography--body3-bold span').last().text().trim();
      if (!priceText) {
        priceText = anchor.find('.typography--body3-bold').text().trim();
      }
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const productUrl = anchor.attr('href') ? 'https://arsenaldirect.arsenal.com' + anchor.attr('href') : null;
      const currency = 'GBP';
      if (name && price && productUrl) {
        shirts.push({ name, productUrl, price, currency });
      }
    });
    return shirts;
  } catch (e) {
    console.error('Error in scrapeArsenal:', e);
    return [];
  } finally {
    if (browser) await browser.close();
  }
};
