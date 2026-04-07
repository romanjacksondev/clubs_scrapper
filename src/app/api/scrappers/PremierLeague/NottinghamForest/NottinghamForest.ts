import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
puppeteer.use(StealthPlugin());

const scrapeNottinghamForest = async () => {
  const urls = [
    'https://shop.nottinghamforest.co.uk/collections/home-kit',
    'https://shop.nottinghamforest.co.uk/collections/goalkeeper-kit',
    'https://shop.nottinghamforest.co.uk/collections/third-kit',
    'https://shop.nottinghamforest.co.uk/collections/away-kit',
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
        await page.waitForSelector('.product-item', { timeout: 15000 });
        foundSelector = '.product-item';
      } catch {
        // ...existing code...
      }
      // ...existing code...
      let products = [];
      if (foundSelector) {
        products = await page.evaluate((selector) => {
          const items = [];
          document.querySelectorAll(selector).forEach((card) => {
            // Name
            const name = card.querySelector('.product-item-meta__title')?.textContent.trim();
            // Price
            let priceText = card.querySelector('.price.price--highlight')?.textContent.trim();
            let comparePriceText = card.querySelector('.price.price--compare')?.textContent.trim();
            let price = priceText
              ? parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
              : null;
            let comparePrice = comparePriceText
              ? parseFloat(comparePriceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
              : null;
            // Product URL
            let productUrl = card
              .querySelector('.product-item-meta__title')
              ?.closest('a')
              ?.getAttribute('href');
            if (!productUrl)
              productUrl = card.querySelector('a.product-item-meta__title')?.getAttribute('href');
            if (productUrl && productUrl.startsWith('/')) {
              productUrl = 'https://shop.nottinghamforest.co.uk' + productUrl;
            }
            // Images
            let img = card.querySelector('img.product-item__primary-image')?.getAttribute('src');
            if (img && img.startsWith('//')) img = 'https:' + img;
            let img2 = card.querySelector('img.product-item__secondary-image')?.getAttribute('src');
            if (img2 && img2.startsWith('//')) img2 = 'https:' + img2;
            // Badges
            let badge = card.querySelector('.label--custom')?.textContent.trim();
            let highlight = card.querySelector('.label--highlight')?.textContent.trim();
            // Sizes
            let sizes = [];
            card.querySelectorAll('.product-item-size-button').forEach((btn) => {
              if (!btn.classList.contains('is-disabled')) {
                sizes.push(btn.textContent.trim());
              }
            });
            let currency = 'ARS';
            if (name && productUrl && price) {
              items.push({
                name,
                productUrl,
                price,
                comparePrice,
                img,
                img2,
                badge,
                highlight,
                sizes,
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
        $('.product-item').each((i, el) => {
          const name = $(el).find('.product-item-meta__title').text().trim();
          let priceText = $(el).find('.price.price--highlight').text().trim();
          let comparePriceText = $(el).find('.price.price--compare').text().trim();
          let price = priceText
            ? parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
            : null;
          let comparePrice = comparePriceText
            ? parseFloat(comparePriceText.replace(/[^0-9.,]/g, '').replace(/,/g, ''))
            : null;
          let productUrl = $(el).find('.product-item-meta__title').closest('a').attr('href');
          if (!productUrl) productUrl = $(el).find('a.product-item-meta__title').attr('href');
          if (productUrl && productUrl.startsWith('/')) {
            productUrl = 'https://shop.nottinghamforest.co.uk' + productUrl;
          }
          let img = $(el).find('img.product-item__primary-image').attr('src');
          if (img && img.startsWith('//')) img = 'https:' + img;
          let img2 = $(el).find('img.product-item__secondary-image').attr('src');
          if (img2 && img2.startsWith('//')) img2 = 'https:' + img2;
          let badge = $(el).find('.label--custom').text().trim();
          let highlight = $(el).find('.label--highlight').text().trim();
          let sizes = [];
          $(el)
            .find('.product-item-size-button')
            .each((i, btn) => {
              if (!$(btn).hasClass('is-disabled')) {
                sizes.push($(btn).text().trim());
              }
            });
          let currency = 'ARS';
          if (name && productUrl && price) {
            products.push({
              name,
              productUrl,
              price,
              comparePrice,
              img,
              img2,
              badge,
              highlight,
              sizes,
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

export default scrapeNottinghamForest;
