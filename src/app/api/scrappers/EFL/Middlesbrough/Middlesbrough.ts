// Middlesbrough FC official store (shop.mfc.co.uk) — JonasSports platform.
// Separate category IDs per kit: home=30, away=31, third=36, goalkeeper=32.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';
import { Product } from '../../shared/Product';

const BASE = 'https://shop.mfc.co.uk';
const KIT_IDS = [30, 31, 36, 32]; // home, away, third, goalkeeper

const scrapeMiddlesbrough = async (): Promise<Product[]> => {
  try {
    const seen = new Set<string>();
    const results: Product[] = [];
    for (const id of KIT_IDS) {
      const products = await scrapeJonasShop(BASE, '/kit/', id);
      for (const p of products) {
        if (!seen.has(p.productUrl)) {
          seen.add(p.productUrl);
          results.push(p);
        }
      }
    }
    return results;
  } catch (e) {
    console.error('Error in scrapeMiddlesbrough:', e);
    return [];
  }
};

export default scrapeMiddlesbrough;
