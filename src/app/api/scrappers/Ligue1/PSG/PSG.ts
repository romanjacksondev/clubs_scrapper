// Paris Saint-Germain official store (shop.psg.fr) — Fanatics platform.
// The store is protected by Akamai bot detection and returns HTTP 403
// to all programmatic requests. A browser-automation solution would be
// needed to bypass this; returning empty until one is available.

import { Product } from '../../shared/Product';

const scrapePSG = async (): Promise<Product[]> => {
  return [];
};

export default scrapePSG;
