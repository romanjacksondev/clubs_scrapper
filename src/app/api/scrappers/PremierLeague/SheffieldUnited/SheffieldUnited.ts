// Sheffield United store (sufcdirect.co.uk) runs on the JonasSports platform.
// The Jonas AJAX catalogue API is called with the category ID found in the page
// JS (id=117, websales_brch=201). All kits are currently on clearance so
// display_oos=Y is required to return results.

import { Product } from '../Product';

const BASE_URL = 'https://www.sufcdirect.co.uk';

const scrapeSheffieldUnited = async (): Promise<Product[]> => {
  try {
    const body = new URLSearchParams({
      id: '117',
      subid: '',
      star_shirt: 'Y',
      display_oos: 'Y',
      websales_brch: '201',
      listing_type: '234',
      quickview: 'N',
      criteria: '',
      use_basecolour: 'false',
      start: '0',
    });

    const res = await fetch(`${BASE_URL}/api/product/catalogue/list/getdetails.php`, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: `${BASE_URL}/kit/all-kits/all-kits/`,
        Origin: BASE_URL,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body,
    });

    const data = await res.json();
    const docs: any[] = data?.results?.docs ?? [];

    return docs
      .map((doc) => {
        const name: string = doc.title?.trim();
        const price = parseFloat(doc.price?.rrp);
        const productUrl: string = doc.link?.trim();
        if (!name || !price || !productUrl) return null;
        return { name, productUrl, price, currency: 'GBP' };
      })
      .filter((p): p is Product => p !== null);
  } catch (e) {
    console.error('Error in scrapeSheffieldUnited:', e);
    return [];
  }
};

export default scrapeSheffieldUnited;
