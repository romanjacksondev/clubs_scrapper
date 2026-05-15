import { scrapeJonasShop } from '../jonasShopScraper';
import { Product } from '../Product';

// West Ham United official store runs on the JonasSports platform.
// Category ID 128 = "All Kit" listing page.
const scrapeWestHam = async (): Promise<Product[]> => {
  return scrapeJonasShop('https://shop.whufc.com', '/kits/all-kit/', 128);
};

export default scrapeWestHam;
