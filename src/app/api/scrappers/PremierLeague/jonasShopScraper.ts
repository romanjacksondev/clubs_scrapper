import { Product } from './Product';

/**
 * Generic scraper for clubs whose official store runs on the JonasSports platform
 * (Brentford, Brighton, Crystal Palace, etc.).
 *
 * JonasSports pages are NOT server-rendered — products are fetched client-side via an
 * internal AJAX endpoint (/api/product/catalogue/list/getdetails.php). We call that
 * endpoint directly with the category ID embedded in the page's JS.
 *
 * @param baseUrl       e.g. "https://shop.brentfordfc.com"
 * @param kitListPath   e.g. "/kit/all-2526-kits/" — used as Referer header
 * @param categoryId    The numeric `id` param in the page's displayListing() call
 * @param currency      Default "GBP"
 */
export async function scrapeJonasShop(
  baseUrl: string,
  kitListPath: string,
  categoryId: number,
  currency: string = 'GBP',
): Promise<Product[]> {
  const base = baseUrl.replace(/\/$/, '');
  const referer = base + '/' + kitListPath.replace(/^\//, '');
  const apiUrl = `${base}/api/product/catalogue/list/getdetails.php`;

  const body = new URLSearchParams({
    id: String(categoryId),
    subid: '',
    star_shirt: 'Y',
    display_oos: 'N',
    websales_brch: '300',
    listing_type: '234',
    quickview: 'N',
    criteria: '',
    use_basecolour: 'false',
    start: '0',
  }).toString();

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: referer,
      Origin: base,
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
      return { name, productUrl, price, currency };
    })
    .filter((p): p is Product => p !== null);
}
