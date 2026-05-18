import { launchBrowser } from '../../shared/puppeteerUtils';

// Manchester United official store (store.manutd.com) runs on Scayle/Nuxt.
// Each category page embeds a <script type="application/ld+json"> with an
// ItemList schema containing product names, URLs and GBP prices — we parse
// that instead of scraping the DOM (which geo-detects to local currency).

const BASE_URL = 'https://store.manutd.com';

const scrapeManUnited = async function () {
  const urls = [
    `${BASE_URL}/en/c/jerseys/home`,
    `${BASE_URL}/en/c/jerseys/away`,
    `${BASE_URL}/en/c/jerseys/third`,
    `${BASE_URL}/en/c/jerseys/goalkeeper`,
  ];

  let browser;
  const allProducts: { name: string; productUrl: string; price: number; currency: string }[] = [];
  const seen = new Set<string>();

  try {
    browser = await launchBrowser(true);
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en;q=0.9' });

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        const products = await page.evaluate(() => {
          const items: { name: string; productUrl: string; price: number; currency: string }[] = [];
          document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
            try {
              const data = JSON.parse(script.textContent ?? '');
              if (data['@type'] !== 'ItemList') return;
              for (const entry of data.itemListElement ?? []) {
                const name: string = entry.item?.name?.trim();
                const productUrl: string = entry.item?.url?.trim();
                const price = parseFloat(entry.item?.offers?.price);
                const currency: string = entry.item?.offers?.priceCurrency || 'GBP';
                if (name && productUrl && price > 0) {
                  items.push({ name, productUrl, price, currency });
                }
              }
            } catch {
              // ignore parse errors for individual scripts
            }
          });
          return items;
        });

        for (const p of products) {
          if (!seen.has(p.productUrl)) {
            seen.add(p.productUrl);
            allProducts.push(p);
          }
        }
      } catch (err) {
        console.error(`Error scraping Man United URL ${url}:`, err);
      }
    }

    await browser.close();
    return allProducts;
  } catch (e) {
    console.error('Error in scrapeManUnited:', e);
    if (browser) await browser.close();
    return [];
  }
};

export default scrapeManUnited;
