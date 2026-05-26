// Southampton FC official store (store.southamptonfc.com) — JonasSports platform.
// All-kits category id=164, websales_brch=300.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeSouthamptonFC = async () => {
  try {
    return await scrapeJonasShop('https://store.southamptonfc.com', '/kit/all-kits/', 164);
  } catch (e) {
    console.error('Error in scrapeSouthamptonFC:', e);
    return [];
  }
};

export default scrapeSouthamptonFC;
