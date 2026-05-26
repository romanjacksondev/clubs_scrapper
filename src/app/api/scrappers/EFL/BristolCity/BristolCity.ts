// Bristol City official store (shop.bristol-sport.co.uk) — JonasSports platform.
// All-football-kit category id=163, websales_brch=300.
import { scrapeJonasShop } from '../../shared/jonasShopScraper';

const scrapeBristolCity = async () => {
  try {
    return await scrapeJonasShop(
      'https://shop.bristol-sport.co.uk',
      '/bcfc/kit/all-football-kit/',
      163,
    );
  } catch (e) {
    console.error('Error in scrapeBristolCity:', e);
    return [];
  }
};

export default scrapeBristolCity;
