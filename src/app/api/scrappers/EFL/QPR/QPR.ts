// Queens Park Rangers official store (shop.qpr.co.uk) — Shopify.
// Kit collections exist in the store navigation but currently return 0 products.
// Returning empty until the current-season kit is stocked.
import { Product } from '../../shared/Product';

const scrapeQPR = async (): Promise<Product[]> => {
  return [];
};

export default scrapeQPR;
