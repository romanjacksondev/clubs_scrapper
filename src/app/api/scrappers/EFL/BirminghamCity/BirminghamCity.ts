// Birmingham City official store (clubstore.bcfc.com) — JonasSports platform.
// All-kit category id=62, websales_brch=300.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeBirminghamCity = async () => {
  try {
    return await scrapeJonasShop('https://clubstore.bcfc.com', '/replica-kit/allkit/', 62);
  } catch (e) {
    console.error('Error in scrapeBirminghamCity:', e);
    return [];
  }
};

export default scrapeBirminghamCity;
