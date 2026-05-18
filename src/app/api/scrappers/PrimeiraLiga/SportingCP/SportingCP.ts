// Sporting CP official store: lojaverde.sporting.pt (Angular SPA).
// The store is fully client-side rendered and the backend API (/api/product)
// requires authenticated sessions — not accessible without browser execution.
// TODO: revisit if a public product API becomes available.

import { Product } from '../../shared/Product';

export default async function scrapeSpotingCP(): Promise<Product[]> {
  return [];
}
