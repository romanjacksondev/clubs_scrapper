/**
 * Probe script — tests stub stores with Playwright to identify which are reachable.
 * Run with: npx tsx scripts/probe-stubs.ts [league?]
 *
 * Output: probe-results.json
 */
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// ── Stores to probe ───────────────────────────────────────────────────────────
const PROBES: { club: string; league: string; url: string; shopifySlug?: string }[] = [
  // MLS — club-specific stores (Fanatics mlsstore.com is blocked; these are owned stores)
  { club: 'AtlantaUnited', league: 'MLS', url: 'https://shop.atlutd.com', shopifySlug: 'jerseys' },
  { club: 'AustinFC', league: 'MLS', url: 'https://shop.austinfc.com', shopifySlug: 'jerseys' },
  {
    club: 'CFMontreal',
    league: 'MLS',
    url: 'https://boutique.cfmontreal.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'CharlotteFC',
    league: 'MLS',
    url: 'https://shop.charlottefc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'ChicagoFire',
    league: 'MLS',
    url: 'https://store.chicagofire.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'ColoradoRapids',
    league: 'MLS',
    url: 'https://store.coloradorapids.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'ColumbusСrew',
    league: 'MLS',
    url: 'https://store.columbuscrew.com',
    shopifySlug: 'jerseys',
  },
  { club: 'DCUnited', league: 'MLS', url: 'https://shop.dcunited.com', shopifySlug: 'jerseys' },
  {
    club: 'FCCincinnati',
    league: 'MLS',
    url: 'https://store.fccincinnati.com',
    shopifySlug: 'jerseys',
  },
  { club: 'FCDallas', league: 'MLS', url: 'https://store.fcdallas.com', shopifySlug: 'jerseys' },
  {
    club: 'HoustonDynamo',
    league: 'MLS',
    url: 'https://store.houstondynamo.com',
    shopifySlug: 'jerseys',
  },
  { club: 'LAGalaxy', league: 'MLS', url: 'https://shop.lagalaxy.com', shopifySlug: 'jerseys' },
  { club: 'LosAngelesFC', league: 'MLS', url: 'https://store.lafc.com', shopifySlug: 'jerseys' },
  {
    club: 'MinnesotaUnited',
    league: 'MLS',
    url: 'https://store.mnufc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'NashvilleSC',
    league: 'MLS',
    url: 'https://store.nashvillesc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'NewEnglandRevolution',
    league: 'MLS',
    url: 'https://store.revolutionsoccer.net',
    shopifySlug: 'jerseys',
  },
  { club: 'NewYorkCityFC', league: 'MLS', url: 'https://shop.nycfc.com', shopifySlug: 'jerseys' },
  {
    club: 'NewYorkRedBulls',
    league: 'MLS',
    url: 'https://store.newyorkredbulls.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'OrlandoCitySC',
    league: 'MLS',
    url: 'https://store.orlandocitysc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'PhiladelphiaUnion',
    league: 'MLS',
    url: 'https://store.philadelphiaunion.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'PortlandTimbers',
    league: 'MLS',
    url: 'https://store.timbers.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'RealSaltLake',
    league: 'MLS',
    url: 'https://store.realsaltlake.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'SanDiegoFC',
    league: 'MLS',
    url: 'https://store.sandiegofc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'SanJoseEarthquakes',
    league: 'MLS',
    url: 'https://store.sjearthquakes.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'SeattleSounders',
    league: 'MLS',
    url: 'https://store.soundersfc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'SportingKansasCity',
    league: 'MLS',
    url: 'https://store.sportingkc.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'StLouisCitySC',
    league: 'MLS',
    url: 'https://store.stlouiscitysc.com',
    shopifySlug: 'jerseys',
  },
  { club: 'TorontoFC', league: 'MLS', url: 'https://store.torontofc.ca', shopifySlug: 'jerseys' },
  {
    club: 'VancouverWhitecaps',
    league: 'MLS',
    url: 'https://shop.vancouverwhitecaps.com',
    shopifySlug: 'jerseys',
  },
  // LaLiga stubs
  {
    club: 'Alavés',
    league: 'LaLiga',
    url: 'https://www.deportivoalaves.com/tienda',
    shopifySlug: 'camisetas',
  },
  {
    club: 'CeltaVigo',
    league: 'LaLiga',
    url: 'https://shop.celtavigo.net',
    shopifySlug: 'camisetas',
  },
  {
    club: 'Espanyol',
    league: 'LaLiga',
    url: 'https://botiga.rcdespanyol.com',
    shopifySlug: 'equipaciones',
  },
  {
    club: 'Getafe',
    league: 'LaLiga',
    url: 'https://tienda.getafecf.com',
    shopifySlug: 'camisetas',
  },
  { club: 'Osasuna', league: 'LaLiga', url: 'https://tienda.osasuna.es', shopifySlug: 'camisetas' },
  {
    club: 'RayoVallecano',
    league: 'LaLiga',
    url: 'https://www.rayovallecano.es/tienda',
    shopifySlug: 'camisetas',
  },
  {
    club: 'RealBetis',
    league: 'LaLiga',
    url: 'https://store.realbetisbalompie.es',
    shopifySlug: 'camisetas',
  },
  {
    club: 'RealOviedo',
    league: 'LaLiga',
    url: 'https://tienda.realoviedo.es',
    shopifySlug: 'camisetas',
  },
  {
    club: 'RealSociedad',
    league: 'LaLiga',
    url: 'https://tienda.realsociedad.eus',
    shopifySlug: 'camisetas',
  },
  // PrimeiraLiga stubs
  {
    club: 'Arouca',
    league: 'PrimeiraLiga',
    url: 'https://fcarouca.pt/loja',
    shopifySlug: 'camisolas',
  },
  {
    club: 'Famalicão',
    league: 'PrimeiraLiga',
    url: 'https://loja.fcfamalicao.pt',
    shopifySlug: 'camisolas',
  },
  {
    club: 'Farense',
    league: 'PrimeiraLiga',
    url: 'https://loja.scfarense.com',
    shopifySlug: 'camisolas',
  },
  {
    club: 'GilVicente',
    league: 'PrimeiraLiga',
    url: 'https://loja.gilvicente.eu',
    shopifySlug: 'camisolas',
  },
  {
    club: 'SportingCP',
    league: 'PrimeiraLiga',
    url: 'https://store.sporting.pt',
    shopifySlug: 'camisolas',
  },
  // PremierLeague stubs
  {
    club: 'LeedsUnited',
    league: 'PremierLeague',
    url: 'https://store.leedsunited.com',
    shopifySlug: 'jerseys',
  },
  {
    club: 'SunderlandAFC',
    league: 'PremierLeague',
    url: 'https://shop.safc.com',
    shopifySlug: 'jerseys',
  },
  // Brasileirão
  {
    club: 'AtléticoMineiro',
    league: 'Brasileirão',
    url: 'https://loja.atletico.com.br',
    shopifySlug: 'camisas',
  },
  { club: 'Grêmio', league: 'Brasileirão', url: 'https://loja.gremio.net', shopifySlug: 'camisas' },
];

interface ProbeResult {
  club: string;
  league: string;
  url: string;
  reachable: boolean;
  statusCode?: number;
  redirectUrl?: string;
  platform?: string;
  shopifyProductsFound?: number;
  pageTitle?: string;
  error?: string;
}

async function probeShopify(
  page: import('playwright').Page,
  baseUrl: string,
  slug: string,
): Promise<{ found: number; url: string } | null> {
  const testUrl = `${baseUrl}/collections/${slug}/products.json?limit=5`;
  const response = await page.request.get(testUrl).catch(() => null);
  if (!response || !response.ok()) return null;
  try {
    const json = await response.json();
    if (json?.products?.length >= 0) return { found: json.products.length, url: testUrl };
  } catch {
    // not JSON
  }
  return null;
}

async function probeOne(probe: (typeof PROBES)[number]): Promise<ProbeResult> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const result: ProbeResult = {
    club: probe.club,
    league: probe.league,
    url: probe.url,
    reachable: false,
  };

  try {
    const page = await context.newPage();
    const response = await page.goto(probe.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    result.statusCode = response?.status();
    result.redirectUrl = page.url();
    result.pageTitle = await page.title().catch(() => '');
    result.reachable = (result.statusCode ?? 0) < 400;

    // Detect platform from page source
    const html = await page.content();
    if (
      html.includes('Shopify.theme') ||
      html.includes('/cdn/shop/') ||
      html.includes('cdn.shopify.com')
    ) {
      result.platform = 'Shopify';
      // Try to find a products.json endpoint
      if (probe.shopifySlug) {
        const slugs = [
          probe.shopifySlug,
          'jerseys',
          'kits',
          'replicas',
          'camisetas',
          'equipaciones',
          'camisas',
          'camisolas',
          'trikots',
        ];
        for (const slug of slugs) {
          const apiUrl = `${new URL(probe.url).origin}/collections/${slug}/products.json?limit=5`;
          const resp = await page.request.get(apiUrl).catch(() => null);
          if (resp?.ok()) {
            try {
              const json = await resp.json();
              if (json?.products !== undefined) {
                result.shopifyProductsFound = json.products.length;
                result.platform = `Shopify (slug: ${slug}, products: ${json.products.length})`;
                break;
              }
            } catch {
              /* ignore */
            }
          }
        }
      }
    } else if (html.includes('WooCommerce') || html.includes('woocommerce')) {
      result.platform = 'WooCommerce';
    } else if (html.includes('Magento') || html.includes('mage/')) {
      result.platform = 'Magento';
    } else if (html.includes('VTEX') || html.includes('vtex.')) {
      result.platform = 'VTEX';
    } else if (html.includes('BigCommerce') || html.includes('bigcommerce')) {
      result.platform = 'BigCommerce';
    } else if (html.includes('fanatics') || html.includes('Fanatics')) {
      result.platform = 'Fanatics';
    } else {
      result.platform = 'Unknown';
    }
  } catch (err: unknown) {
    result.error = err instanceof Error ? err.message : String(err);
    result.reachable = false;
  } finally {
    await browser.close().catch(() => {});
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function page(): any {
  return null;
}

async function main() {
  const leagueFilter = process.argv[2];
  const probes = leagueFilter
    ? PROBES.filter((p) => p.league.toLowerCase() === leagueFilter.toLowerCase())
    : PROBES;

  console.log(`Probing ${probes.length} stores...\n`);

  const results: ProbeResult[] = [];
  for (const probe of probes) {
    process.stdout.write(`  ${probe.league}/${probe.club} ... `);
    const result = await probeOne(probe);
    results.push(result);
    if (result.reachable) {
      console.log(
        `✓ ${result.statusCode} — ${result.platform ?? 'unknown'} — "${result.pageTitle?.slice(0, 50)}"`,
      );
    } else {
      console.log(
        `✗ ${result.statusCode ?? 'err'} — ${result.error?.slice(0, 80) ?? 'unreachable'}`,
      );
    }
  }

  const outPath = path.join(process.cwd(), 'probe-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outPath}`);

  const reachable = results.filter((r) => r.reachable);
  const shopify = results.filter((r) => r.platform?.startsWith('Shopify'));
  console.log(
    `\nSummary: ${reachable.length}/${results.length} reachable, ${shopify.length} Shopify`,
  );
}

main().catch(console.error);
