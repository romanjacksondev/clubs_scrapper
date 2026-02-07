import puppeteer from 'puppeteer';

const scrapeEverton = async function () {
  const url =
    'https://store.evertonfc.com/en/everton-football-kits/t-20548909+d-0149874993+z-90-1284331857';
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
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
      await page.waitForSelector('.ds-card', { timeout: 15000 });
      foundSelector = '.ds-card';
    } catch {
      try {
        await page.waitForSelector('.product-card', { timeout: 10000 });
        foundSelector = '.product-card';
      } catch {
        // Could not find expected product selectors, falling back to HTML extraction.
      }
    }
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
            productUrl = 'https://store.evertonfc.com' + productUrl;
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
      const cheerio = require('cheerio');
      const $ = cheerio.load(html);
      $('.ds-card').each((i, el) => {
        const name = $(el).find('.ds-card-title').text().trim();
        let priceText = $(el).find('.money-value').first().text().trim();
        const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, '')) : null;
        let productUrl =
          $(el).find('.ds-card-details a').attr('href') ||
          $(el).find('.ds-card-media a').attr('href');
        if (productUrl && productUrl.startsWith('/')) {
          productUrl = 'https://store.evertonfc.com' + productUrl;
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

export default scrapeEverton;
