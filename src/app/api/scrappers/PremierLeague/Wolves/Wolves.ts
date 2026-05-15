import { scrapeJonasShop } from '../jonasShopScraper';
import { Product } from '../Product';

// Wolverhampton Wanderers official store runs on the JonasSports platform.
// Category ID 55 = "All Kit" listing page.
export default async function scrapeWolves(): Promise<Product[]> {
  return scrapeJonasShop('https://shop.wolves.co.uk', '/kit/all-kit/', 55);
}
