// Watford FC official store (www.thehornetsshop.co.uk) — JonasSports platform.
// Separate category IDs per kit: home=127, away=128, third=129.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';
import { Product } from '../../shared/Product';

const BASE = 'https://www.thehornetsshop.co.uk';
const KIT_IDS = [127, 128, 129]; // home, away, third

const scrapeWatfordFC = async (): Promise<Product[]> => {
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
    console.error('Error in scrapeWatfordFC:', e);
    return [];
  }
};

export default scrapeWatfordFC;
