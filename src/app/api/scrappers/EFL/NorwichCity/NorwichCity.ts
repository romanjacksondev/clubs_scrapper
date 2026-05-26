// Norwich City official store (shop.canaries.co.uk) — JonasSports platform.
// All-kits category id=170, websales_brch=300.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeNorwichCity = async () => {
  try {
    return await scrapeJonasShop('https://shop.canaries.co.uk', '/kit/all-kits/', 170);
  } catch (e) {
    console.error('Error in scrapeNorwichCity:', e);
    return [];
  }
};

export default scrapeNorwichCity;
