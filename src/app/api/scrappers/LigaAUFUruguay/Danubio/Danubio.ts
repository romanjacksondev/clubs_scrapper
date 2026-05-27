import { Product } from '../../shared/Product';
import { scrapeMgrsportClub } from '../../shared/mgrsport';

export default async function scrapeDanubio(): Promise<Product[]> {
  try {
    return await scrapeMgrsportClub('danubio');
  } catch (e) {
    console.error('Error in scrapeDanubio:', e);
    return [];
  }
}
