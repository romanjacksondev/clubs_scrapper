import { Product } from '../../shared/Product';
import { scrapeMgrsportClub } from '../../shared/mgrsport';

export default async function scrapeLiverpool(): Promise<Product[]> {
  try {
    return await scrapeMgrsportClub('liverpool');
  } catch (e) {
    console.error('Error in scrapeLiverpool:', e);
    return [];
  }
}
