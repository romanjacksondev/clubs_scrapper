// Leeds United official store (shop.leedsunited.com) — Assembly/custom platform with Akamai bot protection.
// All programmatic requests are blocked with HTTP 403 (Akamai EdgeSuite).
// A browser-automation solution would be needed to bypass this; returning empty until one is available.

import { Product } from '../../shared/Product';

const scrapeLeedsUnited = async (): Promise<Product[]> => {
  return [];
};

export default scrapeLeedsUnited;
