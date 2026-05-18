// Manchester United official store (store.manutd.com) runs on Scayle/Nuxt.
// Each category page embeds a <script type="application/ld+json"> with an
// ItemList schema containing product names, URLs and GBP prices — accessible
// via plain fetch (no bot protection).

const BASE_URL = 'https://store.manutd.com';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-GB,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const scrapeManUnited = async function () {
  const urls = [
    `${BASE_URL}/en/c/jerseys/home`,
    `${BASE_URL}/en/c/jerseys/away`,
    `${BASE_URL}/en/c/jerseys/third`,
    `${BASE_URL}/en/c/jerseys/goalkeeper`,
  ];

  const allProducts: { name: string; productUrl: string; price: number; currency: string }[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      if (!res.ok) continue;
      const html = await res.text();

      // Extract all LD+JSON blocks
      const ldJsonRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
      let match: RegExpExecArray | null;
      while ((match = ldJsonRe.exec(html)) !== null) {
        try {
          const data = JSON.parse(match[1]);
          if (data['@type'] !== 'ItemList') continue;
          for (const entry of data.itemListElement ?? []) {
            const name: string = entry.item?.name?.trim();
            const productUrl: string = entry.item?.url?.trim();
            const price = parseFloat(entry.item?.offers?.price);
            const currency: string = entry.item?.offers?.priceCurrency || 'GBP';
            if (name && productUrl && price > 0 && !seen.has(productUrl)) {
              seen.add(productUrl);
              allProducts.push({ name, productUrl, price, currency });
            }
          }
        } catch {
          // ignore individual LD+JSON parse errors
        }
      }
    } catch {
      // ignore per-URL errors
    }
  }

  return allProducts;
};

export default scrapeManUnited;
