import { Product } from '../../shared/Product';

// Store at tienda.penarol.org is inaccessible (TLS SNI mismatch) — stub
export default async function scrapePenarol(): Promise<Product[]> {
  return [];
}
