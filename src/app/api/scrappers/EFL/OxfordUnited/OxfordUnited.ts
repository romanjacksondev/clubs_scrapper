// Oxford United official store (www.oufcshop.co.uk) — JonasSports platform.
// Separate category IDs per kit: home=23, away=24, third=25, goalkeeper=26.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';
import { Product } from '../../shared/Product';

const BASE = 'https://www.oufcshop.co.uk';
const KIT_IDS = [23, 24, 25, 26]; // home, away, third, goalkeeper

const scrapeOxfordUnited = async (): Promise<Product[]> => {
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
    console.error('Error in scrapeOxfordUnited:', e);
    return [];
  }
};

export default scrapeOxfordUnited;
