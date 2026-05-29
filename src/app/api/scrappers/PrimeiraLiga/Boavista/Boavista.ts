// Boavista FC official store: boavistafc.pt/loja/
// The store is embedded in the club's WordPress site and does not expose a public
// product API (Shopify, WooCommerce with auth, etc.).
// TODO: revisit if a public product endpoint becomes available.

import { Product } from '../../shared/Product';

export default async function scrapeBoavista(): Promise<Product[]> {
  return [];
}
