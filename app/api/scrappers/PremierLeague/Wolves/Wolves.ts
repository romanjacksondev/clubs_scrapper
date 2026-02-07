import { launchAndGetPage } from '../puppeteerUtils';

export default async function scrapeWolves() {
  const url = 'https://shop.wolves.co.uk/kit/all-kit/';
  let browser;
  try {
    // ...existing code...
    const { browser: b, page } = await launchAndGetPage(url);
    browser = b;
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
          productUrl = 'https://shop.wolves.co.uk' + productUrl;
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
          image = 'https://shop.wolves.co.uk' + image;
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
    // Save data to output/wolves.json
    // ...existing code...
    await browser.close();
    return products;
  } catch (e) {
    // ...existing code...
    if (browser) await browser.close();
    return [];
  }
}
