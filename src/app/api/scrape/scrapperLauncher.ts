// scrapperLauncher.ts
import { readdirSync, statSync } from 'fs';
import path from 'path';

// Build the allowlist by scanning the scrappers directory at startup.
// Only sub-directories under each league directory are considered valid clubs,
// preventing path-traversal while removing the need to maintain a hardcoded list.
function buildAllowList(): Record<string, ReadonlySet<string>> {
  const scrapersDir = path.join(process.cwd(), 'src', 'app', 'api', 'scrappers');
  const result: Record<string, ReadonlySet<string>> = {};
  try {
    for (const league of readdirSync(scrapersDir)) {
      const leaguePath = path.join(scrapersDir, league);
      if (!statSync(leaguePath).isDirectory()) continue;
      const clubs = readdirSync(leaguePath).filter((entry) =>
        statSync(path.join(leaguePath, entry)).isDirectory(),
      );
      result[league] = new Set(clubs);
    }
  } catch {
    // If the scan fails, return empty so every request throws rather than silently skipping.
  }
  return result;
}

const ALLOWED_SCRAPERS = buildAllowList();

export async function launchScrapper(trimmedLeague: string, trimmedClub: string) {
  const allowedClubs = ALLOWED_SCRAPERS[trimmedLeague];
  if (!allowedClubs || !allowedClubs.has(trimmedClub)) {
    throw new Error(`Unknown scrapper: ${trimmedLeague}/${trimmedClub}`);
  }
  const scrapperModule = await import(
    `../scrappers/${trimmedLeague}/${trimmedClub}/${trimmedClub}`
  );
  return scrapperModule.default;
}
