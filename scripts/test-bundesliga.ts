import scrapeBorussiaMönchengladbach from '../src/app/api/scrappers/Bundesliga/BorussiaMönchengladbach/BorussiaMönchengladbach';
import scrapeFCAugsburg from '../src/app/api/scrappers/Bundesliga/FCAugsburg/FCAugsburg';
import scrapeRBLeipzig from '../src/app/api/scrappers/Bundesliga/RBLeipzig/RBLeipzig';
import scrapeVfBStuttgart from '../src/app/api/scrappers/Bundesliga/VfBStuttgart/VfBStuttgart';
import scrapeWerderBremen from '../src/app/api/scrappers/Bundesliga/WerderBremen/WerderBremen';
import scrapeBorussiaDortmund from '../src/app/api/scrappers/Bundesliga/BorussiaDortmund/BorussiaDortmund';
import scrape1FCHeidenheim from '../src/app/api/scrappers/Bundesliga/1FCHeidenheim/1FCHeidenheim';

async function main() {
  const tests: [string, () => Promise<unknown[]>][] = [
    ['BorussiaMönchengladbach', scrapeBorussiaMönchengladbach],
    ['FCAugsburg', scrapeFCAugsburg],
    ['RBLeipzig', scrapeRBLeipzig],
    ['VfBStuttgart', scrapeVfBStuttgart],
    ['WerderBremen', scrapeWerderBremen],
    ['BorussiaDortmund', scrapeBorussiaDortmund],
    ['1FCHeidenheim', scrape1FCHeidenheim],
  ];
  for (const [name, fn] of tests) {
    try {
      const r = await fn();
      console.log(`${name}: ${r.length} products`);
    } catch (e) {
      console.log(`${name}: ERROR - ${e}`);
    }
  }
}
main().catch(console.error);
