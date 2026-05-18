import { scrapeJonasShop } from '../../shared/jonasShopScraper';
import { Product } from '../../shared/Product';

// Wolverhampton Wanderers official store runs on the JonasSports platform.
// Category ID 55 = "All Kit" listing page.
export default async function scrapeWolves(): Promise<Product[]> {
  return scrapeJonasShop('https://shop.wolves.co.uk', '/kit/all-kit/', 55);
}
