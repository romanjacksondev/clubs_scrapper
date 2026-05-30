// Blackburn Rovers store: www.roverstore.co.uk (custom PHP platform)
// Products are loaded via a JSON API endpoint.
// Department IDs: 149 = 25/26 Home Kit, 150 = Away Kit, 151 = 3rd Kit
import { Product } from '../../shared/Product';

const API_URL = 'https://www.roverstore.co.uk/api/product/catalogue/list/getdetails.php';
const KIT_DEPARTMENT_IDS = [149, 150, 151];

const scrapeBlackburnRovers = async (): Promise<Product[]> => {
  const products: Product[] = [];
  const seen = new Set<string>();

  for (const deptId of KIT_DEPARTMENT_IDS) {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://www.roverstore.co.uk/',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      body: `id=${deptId}`,
    });

    if (!resp.ok) continue;

    const data = (await resp.json()) as {
      results: {
        docs: Array<{
          title: string;
          link: string;
          price: { rrp: string };
        }>;
      };
    };

    for (const doc of data.results.docs) {
      if (seen.has(doc.link)) continue;
      seen.add(doc.link);
      products.push({
        name: doc.title,
        productUrl: doc.link,
        price: parseFloat(doc.price.rrp),
        currency: 'GBP',
      });
    }
  }

  return products;
};

export default scrapeBlackburnRovers;
