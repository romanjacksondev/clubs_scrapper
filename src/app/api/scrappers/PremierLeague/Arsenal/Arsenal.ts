import * as cheerio from 'cheerio';
import { Product } from '../../shared/Product';
import { launchAndGetPage } from '../../shared/puppeteerUtils';

export default async function scrapeArsenal() {
  const url = 'https://arsenaldirect.arsenal.com/Football-Shirts-and-Kit/c/kit';
  let browser;
  try {
    const { browser: b, page } = await launchAndGetPage(url);
    browser = b;
    await page.waitForSelector("[data-testid='ProductGridItem']", { timeout: 20000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    const products: Product[] = [];
    $("[data-testid='ProductGridItem']").each((i, el) => {
      const anchor = $(el).find('a').first();
      const name = anchor.find('.typography--body3').first().text().trim();
      let priceText = anchor.find('.typography--body3-bold span').last().text().trim();
      if (!priceText) {
        priceText = anchor.find('.typography--body3-bold').text().trim();
      }
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const productUrl = anchor.attr('href')
        ? 'https://arsenaldirect.arsenal.com' + anchor.attr('href')
        : null;
      const currency = 'GBP';
      if (name && price && productUrl) {
        products.push({ name, productUrl, price, currency });
      }
    });
    return products;
  } catch (e) {
    console.error('Error in scrapeArsenal:', e);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}
