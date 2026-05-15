import { scrapeVtexStore } from '../vtexScraper';

// Palmeiras official store (VTEX)
// Category 343 = "Uniforme de Jogo" (all match kits)
export default function scrapePalmeiras() {
  return scrapeVtexStore('https://www.palmeirasstore.com', 343);
}
