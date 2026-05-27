import { Product } from '../../shared/Product';
import { scrapeFenicio } from '../../shared/mgrsport';

const STORE_URL = 'https://tienda.montevideocitytorque.com/indumentaria';

export default async function scrapeMontevideoCityTorque(): Promise<Product[]> {
  try {
    return await scrapeFenicio(STORE_URL);
  } catch (e) {
    console.error('Error in scrapeMontevideoCityTorque:', e);
    return [];
  }
}
