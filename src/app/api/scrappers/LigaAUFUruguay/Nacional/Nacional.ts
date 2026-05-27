import { Product } from '../../shared/Product';

// Domain nacional.com.uy does not resolve from external servers — stub
export default async function scrapeNacional(): Promise<Product[]> {
  return [];
}
