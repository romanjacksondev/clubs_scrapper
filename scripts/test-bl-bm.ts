import scrapeBayerLeverkusen from '../src/app/api/scrappers/Bundesliga/BayerLeverkusen/BayerLeverkusen';
import scrapeBayernMunich from '../src/app/api/scrappers/Bundesliga/BayernMunich/BayernMunich';

async function main() {
  console.log('Testing BayerLeverkusen...');
  const bl = await scrapeBayerLeverkusen();
  console.log(`BayerLeverkusen: ${bl.length} products`);
  console.log('Testing BayernMunich...');
  const bm = await scrapeBayernMunich();
  console.log(`BayernMunich: ${bm.length} products`);
}
main().catch(console.error);
