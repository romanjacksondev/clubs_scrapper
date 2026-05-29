// CD Nacional (Madeira) official store: cdnacional.pt/loja/
// The store is a WordPress/WooCommerce site; the WooCommerce REST API requires
// authentication (consumer key/secret) which is not publicly available.
// TODO: revisit if a public API or Shopify migration occurs.

import { Product } from '../../shared/Product';

export default async function scrapeNacional(): Promise<Product[]> {
  return [];
}
