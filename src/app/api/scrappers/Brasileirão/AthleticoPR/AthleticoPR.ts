import { scrapeVtexStore } from '../../shared/vtexScraper';

// Athletico Paranaense official store (VTEX)
// Category 4 = "Linha Oficial" under MASCULINO (match kits)
export default function scrapeAthleticoPR() {
  return scrapeVtexStore('https://loja.athletico.com.br', 4);
}
