import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeCrystalPalace = async function () {
  try {
    return await scrapeJonasShop('https://shop.cpfc.co.uk', '/kit/all-kit/', 142);
  } catch (e) {
    console.error('Error in scrapeCrystalPalace:', e);
    return [];
  }
};

export default scrapeCrystalPalace;
