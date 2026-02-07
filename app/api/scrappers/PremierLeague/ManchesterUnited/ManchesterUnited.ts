import path from 'path';
import fs from 'fs';
import { launchAndGetPage } from '../puppeteerUtils';

const scrapeManUnited = async function () {
  const urls = [
    'https://store.manutd.com/en/manchester-united-kits/men/home/',
    'https://store.manutd.com/en/manchester-united-kits/men/away/',
    'https://store.manutd.com/en/manchester-united-kits/men/third/',
    'https://store.manutd.com/en/manchester-united-kits/men/goalkeeper/',
  ];
  let browser;
  let allProducts = [];
  try {
    // ...existing code...
    const { browser: b, page } = await launchAndGetPage(urls[0]);
    browser = b;
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    for (const url of urls) {
      // ...existing code...
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        try {
          // Wait for product articles to load (increase timeout)
          await page.waitForSelector('article[class*="group"]', { timeout: 30000 });
        } catch (waitErr) {
          // Save HTML for debugging if selector fails
          // ...existing code...
        }
        // Auto-scroll to trigger lazy loading
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= document.body.scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 200);
          });
        });
        // ...existing code...
        // Extract product data from articles
        const products = await page.evaluate(() => {
          const items = [];
          document.querySelectorAll('article[class*="group"]').forEach((article) => {
            try {
              // Product URL and Name
              let productUrl = null;
              let name = null;
              const urlEl = article.querySelector('a[href*="/en/p/"]');
              if (urlEl) {
                productUrl = urlEl.getAttribute('href');
                if (!productUrl.startsWith('http')) {
                  productUrl = 'https://store.manutd.com' + productUrl;
                }
                // Name is often in the <a> tag's text or in a child <span>
                const nameSpan = urlEl.querySelector('span');
                if (nameSpan) {
                  name = nameSpan.textContent.trim();
                } else {
                  name = urlEl.textContent.trim();
                }
              }
              // Price: look for span[data-test-id="price"] inside article, or fallback to span with currency
              let price = null;
              let currency = null;
              let priceEl = article.querySelector('span[data-test-id="price"]');
              if (!priceEl) {
                // Try fallback: span with currency symbol or AR$ pattern
                priceEl = Array.from(article.querySelectorAll('span')).find(
                  (s) => /\d/.test(s.textContent) && /\$|£|€|AR\$/.test(s.textContent),
                );
              }
              if (priceEl) {
                // Try to extract price from AR$ or £ or €
                let priceText = priceEl.textContent;
                // Remove non-numeric except comma and dot
                priceText = priceText.replace(/[^\d,.]/g, '');
                // Handle AR$ and other currencies
                price = parseFloat(priceText.replace(/\./g, '').replace(/,/g, '.'));
                currency = priceEl.textContent.match(/AR\$|£|€|\$/)
                  ? priceEl.textContent.match(/AR\$|£|€|\$/)[0]
                  : 'GBP';
              }
              // Sizes
              const sizes = Array.from(
                article.querySelectorAll('button[data-test-id="product-size"] span'),
              ).map((s) => s.textContent.trim());
              if (name && typeof productUrl === 'string' && productUrl.length > 0 && price) {
                items.push({ name, productUrl, price, currency, sizes });
              }
            } catch (err) {
              // Ignore parse errors
            }
          });
          return items;
        });
        log && log(`Total products found on ${url}: ${products.length}`);
        products.forEach((p) => log && log(`Found product: ${p.name} (${p.currency}${p.price})`));
        allProducts = allProducts.concat(products);
      } catch (err) {
        log && log('Error scraping ' + url + ': ' + err.message);
      }
    }

    // Save data to output/man_united.json
    try {
      const outputDir = path.resolve(__dirname, '../output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const outputPath = path.join(outputDir, 'man_united.json');
      fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2), 'utf8');
      log && log(`Saved data to ${outputPath}`);
    } catch (err) {
      log && log('Error saving data to file: ' + err.message);
    }
    await browser.close();
    return allProducts;
  } catch (e) {
    log && log('Man United scraper error: ' + (e.response ? e.response.status : e.message));
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeManUnited;
