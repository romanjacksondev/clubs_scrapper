import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeLutonTown = async () => {
  return await scrapeJonasShop('https://shop.lutontown.co.uk', '/kit/kit/allkit/', 13, 'GBP', 24);
};

export default scrapeLutonTown;
