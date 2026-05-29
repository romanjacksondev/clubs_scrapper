// FC Arouca official store: fcarouca.pt/loja (SSL certificate issues when accessed externally)
// The store cannot be verified programmatically due to SSL configuration.
// TODO: revisit if SSL is fixed or a public API becomes available.

import { Product } from '../../shared/Product';

export default async function scrapeArouca(): Promise<Product[]> {
  return [];
}
