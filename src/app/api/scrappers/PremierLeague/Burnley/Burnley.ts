import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeBurnley = async function () {
  return await scrapeJonasShop(
    'https://shop.burnleyfc.com',
    '/kits/replicakit/view-all/',
    10,
    'GBP',
    66,
  );
};

export default scrapeBurnley;
