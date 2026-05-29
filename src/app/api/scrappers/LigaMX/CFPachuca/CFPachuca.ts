// CF Pachuca (Tuzos) official store — tuzos.com.mx.
// Store returns HTTP 403 / Access Denied to programmatic requests.
// TODO: revisit if the store becomes accessible.

import { Product } from '../../shared/Product';

export default async function scrapeCFPachuca(): Promise<Product[]> {
  return [];
}
