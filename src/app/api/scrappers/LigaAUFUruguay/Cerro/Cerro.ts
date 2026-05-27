import { Product } from '../../shared/Product';
import { scrapeMgrsportClub } from '../../shared/mgrsport';

export default async function scrapeCerro(): Promise<Product[]> {
  try {
    return await scrapeMgrsportClub('cerro');
  } catch (e) {
    console.error('Error in scrapeCerro:', e);
    return [];
  }
}
