import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const scrapeManCity = async () => {
  const urls = [
    'https://shop.mancity.com/en/kits/men/home-kit/',
    'https://shop.mancity.com/en/kits/men/away-kit/',
    'https://shop.mancity.com/en/kits/men/third-kit/',
    'https://shop.mancity.com/en/kits/men/ea-sports-fc-kit/',
    'https://shop.mancity.com/en/kits/men/kidsuper-kit/',
    'https://shop.mancity.com/en/kits/men/goalkeeper-kits/',
  ];

  const allProducts: { name: string; productUrl: string; price: number; currency: string }[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      $('script.product-data[type="application/json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() ?? '');
          const name: string = data.productName || data.GTMName || data.productNameGtm;
          const productUrl: string = data.url;
          let price: number | null = null;
          let currency = 'GBP';
          if (data.price?.sales?.value) {
            price = parseFloat(data.price.sales.value);
            currency = data.price.sales.currency || 'GBP';
          } else if (data.price?.value) {
            price = parseFloat(data.price.value);
            currency = data.price.currency || 'GBP';
          }
          if (!name || !price || !productUrl) return;
          const absoluteUrl = productUrl.startsWith('http')
            ? productUrl
            : `https://shop.mancity.com${productUrl}`;
          if (!seen.has(absoluteUrl)) {
            seen.add(absoluteUrl);
            allProducts.push({ name, productUrl: absoluteUrl, price, currency });
          }
        } catch {
          // ignore individual parse errors
        }
      });
    } catch {
      // ignore per-URL errors
    }
  }

  return allProducts;
};

export default scrapeManCity;
