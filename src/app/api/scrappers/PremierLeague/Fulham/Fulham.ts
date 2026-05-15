import { scrapeJonasShop } from '../jonasShopScraper';

const scrapeFulham = async function () {
  return scrapeJonasShop('https://shop.fulhamfc.com', '/kit/kitviewall/', 174);
};

export default scrapeFulham;
