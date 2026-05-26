// West Bromwich Albion official store (shop.wba.co.uk) — JonasSports platform.
// All-kit category id=79, websales_brch=300.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeWestBromwichAlbion = async () => {
  try {
    return await scrapeJonasShop('https://shop.wba.co.uk', '/kit/all-kit/', 79);
  } catch (e) {
    console.error('Error in scrapeWestBromwichAlbion:', e);
    return [];
  }
};

export default scrapeWestBromwichAlbion;
