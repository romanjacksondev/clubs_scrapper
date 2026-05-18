import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeBrentford = async function () {
  try {
    return await scrapeJonasShop('https://shop.brentfordfc.com', '/kit/all-2526-kits/', 185);
  } catch (e) {
    console.error('Error in scrapeBrentford:', e);
    return [];
  }
};
export default scrapeBrentford;
