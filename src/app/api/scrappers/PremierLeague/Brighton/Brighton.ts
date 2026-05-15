import { scrapeJonasShop } from '../jonasShopScraper';

const scrapeBrighton = async () => {
  try {
    return await scrapeJonasShop('https://shop.brightonandhovealbion.com', '/kit/all-kits/', 71);
  } catch (e) {
    console.error('Error in scrapeBrighton:', e);
    return [];
  }
};

export default scrapeBrighton;
