// scrapperLauncher.ts

// Explicit allowlist — both league and club must be present before the path is
// constructed. This prevents path-traversal attacks via user-supplied strings.
const ALLOWED_SCRAPERS: Record<string, ReadonlySet<string>> = {
  PremierLeague: new Set([
    'Arsenal',
    'AstonVilla',
    'Bournemouth',
    'Brentford',
    'Brighton',
    'Burnley',
    'Chelsea',
    'CrystalPalace',
    'Everton',
    'Fulham',
    'Liverpool',
    'LutonTown',
    'ManchesterCity',
    'ManchesterUnited',
    'Newcastle',
    'NewcastleUnited',
    'NottinghamForest',
    'SheffieldUnited',
    'TottenhamHotspur',
    'WestHamUnited',
    'Wolves',
  ]),
  Bundesliga: new Set([
    '1.FCHeidenheim',
    'BayerLeverkusen',
    'BayernMunich',
    'BorussiaDortmund',
    'BorussiaMönchengladbach',
    'Darmstadt98',
    'EintrachtFrankfurt',
    'FCAugsburg',
    'Mainz05',
    'RBLeipzig',
    'SCFreiburg',
    'TSGHoffenheim',
    'UnionBerlin',
    'VfBStuttgart',
    'VfLWolfsburg',
    'WerderBremen',
  ]),
  Brasileirão: new Set(['Corinthians', 'Flamengo', 'Palmeiras']),
  PrimeraDivisión: new Set(['BocaJuniors']),
};

export async function launchScrapper(trimmedLeague: string, trimmedClub: string) {
  const allowedClubs = ALLOWED_SCRAPERS[trimmedLeague];
  if (!allowedClubs || !allowedClubs.has(trimmedClub)) {
    throw new Error(`Unknown scrapper: ${trimmedLeague}/${trimmedClub}`);
  }
  const scrapperModule = await import(
    `../scrappers/${trimmedLeague}/${trimmedClub}/${trimmedClub}.ts`
  );
  return scrapperModule.default;
}
