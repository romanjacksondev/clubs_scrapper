import { scrapeVtexStore } from '../../shared/vtexScraper';

// Fluminense official store (VTEX)
// Category 112 = "Camisas" under the Puma product line (match jerseys)
export default function scrapeFluminense() {
  return scrapeVtexStore('https://loja.fluminense.com.br', 112);
}
