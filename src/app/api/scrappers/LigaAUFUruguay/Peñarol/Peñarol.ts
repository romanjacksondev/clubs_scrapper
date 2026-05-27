import { Product } from '../../shared/Product';
import { scrapeFenicio } from '../../shared/mgrsport';

const STORE_URL = 'https://www.tiendapenarol.com.uy/indumentaria';

export default async function scrapePenarol(): Promise<Product[]> {
  try {
    return await scrapeFenicio(STORE_URL);
  } catch (e) {
    console.error('Error in scrapePenarol:', e);
    return [];
  }
}
