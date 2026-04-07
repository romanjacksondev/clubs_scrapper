import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeManCity = async () => {
  const urls = [
    'https://shop.mancity.com/en/kits/men/home-kit/',
    'https://shop.mancity.com/en/kits/men/away-kit/',
    'https://shop.mancity.com/en/kits/men/third-kit/',
    'https://shop.mancity.com/en/kits/men/ea-sports-fc-kit/',
    'https://shop.mancity.com/en/kits/men/kidsuper-kit/',
    'https://shop.mancity.com/en/kits/men/goalkeeper-kits/',
  ];
  let browser;
  let allProducts = [];
  try {
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
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        // Extract product data from <script type="application/json" class="product-data">
        const products = await page.evaluate(() => {
          const items = [];
          document
            .querySelectorAll('script.product-data[type="application/json"]')
            .forEach((script) => {
              try {
                const data = JSON.parse(script.textContent);
                const name = data.productName || data.GTMName || data.productNameGtm;
                const productUrl = data.url;
                let price = null;
                let currency = 'GBP';
                if (data.price && data.price.sales && data.price.sales.value) {
                  price = parseFloat(data.price.sales.value);
                  currency = data.price.sales.currency || 'GBP';
                } else if (data.price && data.price.value) {
                  price = parseFloat(data.price.value);
                  currency = data.price.currency || 'GBP';
                }
                if (name && price && productUrl) {
                  items.push({ name, productUrl, price, currency });
                }
              } catch (err) {
                // Ignore parse errors
              }
            });
          return items;
        });
        allProducts = allProducts.concat(products);
      } catch (err) {
        // Ignore scraping errors for individual URLs
      }
    }
    await browser.close();
    return allProducts;
  } catch (e) {
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeManCity;
