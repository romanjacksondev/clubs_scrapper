import { Product } from '../../shared/Product';

// Store not accessible via public API (JS-rendered / WAF blocked) — stub
export default async function scrapeRealBetis(): Promise<Product[]> {
  return [];
}
