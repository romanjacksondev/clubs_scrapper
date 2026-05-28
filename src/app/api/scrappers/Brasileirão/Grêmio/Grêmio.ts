import { Product } from '../../shared/Product';

// Grêmio official store (loja.gremio.net)
// TODO: Store unreachable from outside Brazil; platform not identified.
// Likely VTEX; implement scrapeVtexStore once category ID is confirmed.
export default async function scrapeGremio(): Promise<Product[]> {
  return [];
}
