# Clubs Scrapper

A Next.js app that scrapes football club official stores, tracks product prices over time, and surfaces deals with at least 30% discount.

---

## Architecture

```
src/
  app/
    page.tsx                  # Home — shows 30%+ discounted products across all clubs
    scrape/page.tsx           # Scrape page — select league/club and trigger a scrape
    products/[id]/history/    # Price history page for a single product
    api/
      leagues/                # GET all leagues
      clubs/                  # GET all clubs
      products/               # GET products by clubId
      products/[id]/history/  # GET price history for a product
      scrape/                 # POST trigger scrape for a club
        route.ts              # Entry point — calls launchScrapper + processProducts
        scrapperLauncher.ts   # Dynamically imports the right scrapper by league/club name
        productsProcessor.ts  # Upserts products, records history, purges old entries
      discounts/              # GET products with 30%+ price drop vs historical max
      scrappers/
        shared/
          Product.ts          # Shared product interface
          puppeteerUtils.ts   # Shared Puppeteer launch helper
          jonasShopScraper.ts # Generic JonasSports platform scraper
          vtexScraper.ts      # Generic VTEX platform scraper
        PremierLeague/
          <ClubName>/         # One folder per club, one scrapper file inside
        Bundesliga/
          <ClubName>/
        LaLiga/
          <ClubName>/
        Brasileirão/
          <ClubName>/
        Eredivisie/
          <ClubName>/
        SerieA/
          <ClubName>/
        PrimeraDivisión/
          <ClubName>/
  hooks/
    useLeagues.ts
    useClubs.ts
    useProducts.ts
    useScrape.ts
    useDiscountedProducts.ts
  components/
lib/
  prisma.ts                   # Prisma client singleton (root-level, used by lib/)
src/lib/
  prisma.ts                   # Prisma client singleton (src-level, used by API routes)
prisma/
  schema.prisma               # DB schema
  generated/                  # Generated Prisma client (output of prisma generate)
  seed.ts                     # Seed leagues and clubs
```

### Data flow

1. User selects a league + club on `/scrape` and clicks **Scrape Products**.
2. `POST /api/scrape` launches the club-specific scraper (Shopify JSON API, `fetch` + Cheerio, or platform-specific API — Puppeteer is no longer used).
3. `processProducts` upserts each product in the `Product` table and writes a `ProductHistory` snapshot for every scrape run.
4. History entries older than 90 days are automatically purged after each scrape.
5. `GET /api/discounts` compares the current price against the max historical price and returns products with ≥30% discount.
6. The home page shows those discounted products; clicking **History** on any row shows the full price timeline.

### Price history logic

- A history snapshot is recorded only when the price changes between scrape runs, so the timeline reflects real price movements.
- The discount query uses a `LATERAL` join to find the most recent `ProductHistory` entry with a price higher than the current price — not the all-time maximum.

---

## Database

PostgreSQL. Connection string is read from `DATABASE_URL` in `.env`.

The Prisma client is generated into `prisma/generated/` (not `src/generated/`).

### Useful Prisma commands

```bash
# Push schema changes to the DB (dev, no migration file)
npx prisma db push

# Generate the Prisma client after schema changes
npx prisma generate

# Open Prisma Studio to browse data
npx prisma studio

# Run migrations (production)
npx prisma migrate deploy

# Create a new migration (dev)
npx prisma migrate dev --name <migration_name>

# Seed the database (leagues + clubs)
npx prisma db seed
```

---

## Scrappers

Each scrapper lives in `src/app/api/scrappers/<League>/<ClubName>/<ClubName>.ts` and exports a default async function that returns an array of `{ name, price, productUrl, currency }`.

The `scrapperLauncher.ts` dynamically imports the right file by stripping spaces from the league and club names (e.g. "Premier League" → `PremierLeague`, "Aston Villa" → `AstonVilla`).

| Club                     | League           | Store                                       | Platform           | Approach                                                                          | Status                                           |
| ------------------------ | ---------------- | ------------------------------------------- | ------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| Arsenal                  | Premier League   | `arsenaldirect.arsenal.com`                 | —                  | —                                                                                 | ✅ Working (48 products)                         |
| Aston Villa              | Premier League   | `shop.avfc.co.uk`                           | Fanatics           | —                                                                                 | ⚠️ 0 products (Fanatics/Akamai bot protection)   |
| Bournemouth              | Premier League   | `shop.afcb.co.uk`                           | JonasSports        | `fetch` POST to `/api/product/catalogue/list/getdetails.php`                      | ✅ Working (53 products)                         |
| Brentford                | Premier League   | `shop.brentfordfc.com`                      | JonasSports        | `scrapeJonasShop` helper                                                          | ✅ Working (31 products)                         |
| Brighton                 | Premier League   | `shop.brightonandhovealbion.com`            | JonasSports        | `scrapeJonasShop` helper (id=71)                                                  | ✅ Working (30 products)                         |
| Burnley                  | Premier League   | `shop.burnleyfc.com`                        | JonasSports        | `scrapeJonasShop` helper (id=10, subid=66)                                        | ✅ Working (49 products)                         |
| Chelsea                  | Premier League   | `store.chelseafc.com`                       | Fanatics           | —                                                                                 | ⚠️ 0 products (Fanatics/Akamai bot protection)   |
| Crystal Palace           | Premier League   | `shop.cpfc.co.uk`                           | JonasSports        | `scrapeJonasShop` helper (id=142)                                                 | ✅ Working (36 products)                         |
| Everton                  | Premier League   | `evertondirect.evertonfc.com`               | Fanatics           | —                                                                                 | ⚠️ 0 products (Fanatics HTTP 403)                |
| Fulham                   | Premier League   | `shop.fulhamfc.com`                         | JonasSports        | `scrapeJonasShop` helper (id=174)                                                 | ✅ Working (64 products)                         |
| Liverpool                | Premier League   | `store.liverpoolfc.com`                     | Magento 2          | —                                                                                 | ⚠️ 0 products (Queue-it bot protection)          |
| Luton Town               | Premier League   | `shop.lutontown.co.uk`                      | JonasSports        | `scrapeJonasShop` helper (id=13, subid=24)                                        | ✅ Working (24 products)                         |
| Manchester City          | Premier League   | `shop.mancity.com`                          | SFCC               | `fetch` + Cheerio, `script.product-data` JSON blocks across 6 kit URLs            | ✅ Working (41 products)                         |
| Manchester United        | Premier League   | `store.manutd.com`                          | Scayle             | `fetch`, JSON-LD `ItemList` extraction across 4 kit URLs                          | ✅ Working (80 products)                         |
| Newcastle United         | Premier League   | `shop.newcastleunited.com`                  | Shopify            | `fetch` `/collections/{handle}/products.json?country=GB`                          | ✅ Working (40 products)                         |
| Nottingham Forest        | Premier League   | `shop.nottinghamforest.co.uk`               | Shopify            | `fetch` `/collections/{handle}/products.json?country=GB`                          | ✅ Working (11 products)                         |
| Sheffield United         | Premier League   | `sufcdirect.co.uk`                          | JonasSports        | `fetch` POST, custom params (id=117, brch=201, display_oos=Y)                     | ✅ Working (64 products)                         |
| Tottenham Hotspur        | Premier League   | `shop.tottenhamhotspur.com`                 | SFCC               | `fetch` with `GlobalE_Data` cookie set to GBP, parses product tiles from HTML     | ✅ Working (24 products)                         |
| West Ham United          | Premier League   | `shop.whufc.com`                            | JonasSports        | `scrapeJonasShop` helper (id=128)                                                 | ✅ Working (51 products)                         |
| Wolves                   | Premier League   | `shop.wolves.co.uk`                         | JonasSports        | `scrapeJonasShop` helper (id=55)                                                  | ✅ Working (38 products)                         |
| Bayer Leverkusen         | Bundesliga       | `www.bayer04.de/de-de/shop/`                | —                  | Stealth Puppeteer; all `browser.close()` fire-and-forget to avoid hangs           | ⚠️ 0 products (Queue-it bot protection)          |
| Bayern München           | Bundesliga       | `fcbayern.com/store`                        | Scayle             | Stealth Puppeteer, kit category URLs                                              | ⚠️ 0 products (Akamai geo-block from non-EU IPs) |
| Borussia Dortmund        | Bundesliga       | `shop.bvb.de`                               | —                  | Stealth Puppeteer; returns `[]` if Queue-it detected                              | ✅ Working (6 products)                          |
| Borussia Mönchengladbach | Bundesliga       | `shop.borussia.de`                          | Scayle             | Stealth Puppeteer, `/de-de/trikots`                                               | ✅ Working (16 products)                         |
| Darmstadt 98             | Bundesliga       | `shop.sv98.de`                              | Shopware 6         | Stealth Puppeteer, `.product-box` across 4 category URLs                          | ✅ Working (17 products)                         |
| Eintracht Frankfurt      | Bundesliga       | `stores.eintracht.de`                       | Gatsby SPA         | Stealth Puppeteer (fetch returns empty shell), `a.ef-product-card`                | ✅ Working (11 products)                         |
| FC Augsburg              | Bundesliga       | `shop.fcaugsburg.de`                        | LMS Sport GmbH     | `fetch` + Cheerio; links start with `fca-`                                        | ✅ Working (38 products)                         |
| 1. FC Heidenheim         | Bundesliga       | `merchandising-onlineshop.com/fcheidenheim` | Shopware           | Stealth Puppeteer; returns `[]` when Queue-it is active                           | ✅ Working (26 products)                         |
| Mainz 05                 | Bundesliga       | `shop.mainz05.de`                           | Shopware 6         | Stealth Puppeteer, `.product-box` / `.product-price-info`                         | ✅ Working (15 products)                         |
| RB Leipzig               | Bundesliga       | `www.redbullshop.com`                       | Red Bull Shop      | Stealth Puppeteer, `/de-int/c/rbl-official-kit-by-puma/`                          | ✅ Working (24 products)                         |
| SC Freiburg              | Bundesliga       | `shop.scfreiburg.com`                       | Custom (004 GmbH)  | `fetch` + Cheerio, category 2 (Trikots & Training)                                | ✅ Working (23 products)                         |
| TSG Hoffenheim           | Bundesliga       | `shop.tsg-hoffenheim.de`                    | SAP Commerce Cloud | SAP OCC REST API — no Puppeteer needed                                            | ✅ Working (24 products)                         |
| 1. FC Union Berlin       | Bundesliga       | `fanartikel.union-zeughaus.de`              | Shopify            | `fetch` Shopify JSON API `/collections/trikots-co/products.json`                  | ✅ Working (38 products)                         |
| VfB Stuttgart            | Bundesliga       | `shop.vfb.de`                               | Next.js / Tailwind | Stealth Puppeteer, `/en/jerseys-and-training/jerseys`                             | ✅ Working (9 products)                          |
| VfL Wolfsburg            | Bundesliga       | `shop.vfl-wolfsburg.de`                     | Shopware 6         | Stealth Puppeteer, `.product-box`                                                 | ✅ Working (27 products)                         |
| Werder Bremen            | Bundesliga       | `shop.werder.de`                            | BigCommerce        | Stealth Puppeteer, `/trikots.html/`, `<product-card>` web component               | ✅ Working (12 products)                         |
| Flamengo                 | Brasileirão      | `loja.flamengo.com.br`                      | VTEX               | `scrapeVtexStore` — catalog API `fq=C:/115/`, paginated 50/page                   | ✅ Working (124 products)                        |
| Palmeiras                | Brasileirão      | `www.palmeirasstore.com`                    | VTEX               | `scrapeVtexStore` — catalog API `fq=C:/343/`, paginated 50/page                   | ✅ Working (259 products)                        |
| Corinthians              | Brasileirão      | `www.shoptimao.com.br`                      | Netshoes           | `fetch` `/api/friendly/camisas?page=N`; paginated by `totalPages`                 | ✅ Working (130 products)                        |
| Boca Juniors             | Primera División | `www.bocashop.com.ar`                       | VTEX               | `fetch` VTEX catalog API `fq=C:/3/6/`, paginated 50/page                          | ✅ Working (43 products)                         |
| Atlético Madrid          | La Liga          | `shop.atleticodemadrid.com`                 | SFCC               | `fetch` LD+JSON `ItemList` from category pages, then product page `Offer` data    | ✅ Working (27 products, EUR 79.95)              |
| Barcelona                | La Liga          | `store.fcbarcelona.com`                     | Shopify            | `fetch` Shopify JSON API `/collections/kits/products.json`                        | ✅ Working (83 products, EUR 134.99)             |
| Real Madrid              | La Liga          | `shop.realmadrid.com`                       | Shopify            | `fetch` Shopify JSON API `/collections/jerseys-kits/products.json`                | ✅ Working (40 products, EUR 150.00)             |
| Sevilla                  | La Liga          | `shop.sevillafc.es`                         | Shopify            | `fetch` Shopify JSON API `/collections/equipaciones-25-26/products.json`          | ✅ Working (34 products, EUR 66.50)              |
| Valencia                 | La Liga          | `shop.valenciacf.com`                       | Magento + Hyvä     | `fetch` category pages → LD+JSON `ItemList` → product pages → `Product` block     | ✅ Working (13 products, EUR 87.00)              |
| AC Milan                 | Serie A          | `store.acmilan.com`                         | Shopify            | `fetch` `/collections/milan-match-kit/products.json`                              | ✅ Working                                       |
| AS Roma                  | Serie A          | `store.asroma.com`                          | Shopify            | `fetch` `/collections/kit-gara/products.json`                                     | ✅ Working                                       |
| Atalanta                 | Serie A          | `store.atalanta.it`                         | officialstore.it   | `fetch` + Cheerio, `data-product-*` card attrs, sub-category navigation           | ✅ Working                                       |
| Bologna                  | Serie A          | `www.bolognafcstore.com`                    | Fanatics Italy     | `fetch` + regex, `data-product-price` attrs (cents), sub-category pages           | ✅ Working                                       |
| Cagliari                 | Serie A          | `store.cagliaricalcio.com`                  | WooCommerce        | `fetch` + Cheerio, `.woocommerce-Price-amount bdi`, paginated                     | ✅ Working                                       |
| Empoli                   | Serie A          | `shop.empolifc.it`                          | Wix (JS-rendered)  | Returns `[]` — store fully JS-rendered, no server-side product data               | ⚠️ 0 products (JS-rendered)                      |
| Fiorentina               | Serie A          | `www.fiorentinastore.com`                   | Fanatics Italy     | `fetch` + regex, `data-product-price` attrs (cents), sub-category pages           | ✅ Working                                       |
| Frosinone                | Serie A          | `store.frosinonecalcio.com`                 | Shopify            | `fetch` + Cheerio, WooCommerce `.woocommerce-Price-amount`, paginated             | ✅ Working                                       |
| Genoa                    | Serie A          | `genoacfc.it`                               | WooCommerce        | `fetch` + Cheerio, `.card-product`, sub-category navigation                       | ✅ Working                                       |
| Hellas Verona            | Serie A          | `store.hellasverona.it`                     | Shopify            | `fetch` `/collections/kit-gara/products.json`, detects Cloudflare challenge       | ✅ Working                                       |
| Inter Milan              | Serie A          | `store.inter.it`                            | Fanatics Italy     | `fetch` + regex, `data-product-price` attrs (cents), sub-category pages           | ✅ Working                                       |
| Juventus                 | Serie A          | `store.juventus.com`                        | Fanatics Italy     | `fetch` + regex, `data-product-price` attrs (cents), sub-category pages           | ✅ Working                                       |
| Lazio                    | Serie A          | `www.laziostylestore.com`                   | Fanatics Italy     | `fetch` + regex, `data-product-price` attrs (cents), sub-category pages           | ✅ Working                                       |
| Lecce                    | Serie A          | `www.usleccestore.it`                       | Shopify            | `fetch` `/collections/kit-gara/products.json`                                     | ✅ Working                                       |
| Monza                    | Serie A          | `zeroplayer.it`                             | Shopify            | `fetch` `/collections/new-maglie-gare-ac-monza/products.json`                     | ✅ Working                                       |
| Napoli                   | Serie A          | `store.sscnapoli.it`                        | Shopify            | `fetch` `/collections/ea7-maglie-gara/products.json`                              | ✅ Working                                       |
| Torino                   | Serie A          | `torinofcstore.com`                         | PrestaShop         | `fetch` + regex, extracts `wk_category_products` JSON from `/it/18-kit-gara`      | ✅ Working                                       |
| Udinese                  | Serie A          | `store.udinese.it`                          | —                  | Returns `[]` — store currently offline / under maintenance                        | ⚠️ 0 products (store offline)                    |
| Ajax                     | Eredivisie       | `www.ajax.nl`                               | Next.js/Umbraco    | `fetch` + Cheerio; tries `__NEXT_DATA__` then HTML link parsing                   | ⚠️ 0 products (JS-rendered)                      |
| AZ                       | Eredivisie       | `azshop.nl`                                 | Shopify            | `fetch` + Cheerio nav discovery, then `/collections/{slug}/products.json`         | ✅ Working                                       |
| FC Twente                | Eredivisie       | —                                           | Shopify            | `fetch` Shopify `/collections/.../products.json`                                  | ✅ Working (52 products)                         |
| FC Utrecht               | Eredivisie       | —                                           | Shopify            | `fetch` Shopify `/collections/.../products.json`                                  | ✅ Working (55 products)                         |
| Feyenoord                | Eredivisie       | `www.feyenoordshop.nl`                      | Custom (bad TLS)   | `https` module (`rejectUnauthorized: false`) + Cheerio HTML parsing               | ⚠️ 0 products (bot protection)                   |
| NEC                      | Eredivisie       | `necfanshop.nl`                             | Shopify            | `fetch` `/collections/wedstrijd/products.json`, filters by jersey keywords        | ✅ Working (15 products)                         |
| PSV Eindhoven            | Eredivisie       | `psvfanshop.nl`                             | Shopify (bad TLS)  | `https` module (`rejectUnauthorized: false`), `/collections/{slug}/products.json` | ✅ Working                                       |
| SC Heerenveen            | Eredivisie       | `feanstoreonline.nl`                        | Custom             | `fetch` + Cheerio, `.card` elements with jersey/trikot/shirt keywords             | ✅ Working (26 products)                         |

### Shared utilities

All shared code lives in `src/app/api/scrappers/shared/`.

| File                         | Purpose                                                                                                                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/jonasShopScraper.ts` | Generic scraper for the **JonasSports** platform. POSTs directly to the internal AJAX endpoint using the category `id` embedded in each store's page JS. Used by Brentford, Brighton, Crystal Palace, Fulham, West Ham United, Wolves. |
| `shared/puppeteerUtils.ts`   | Shared Puppeteer launch helper — uses `@sparticuz/chromium` on Vercel, bundled Chromium locally. Supports optional stealth mode. Still used by Bundesliga scrapers that require JS rendering.                                          |
| `shared/Product.ts`          | Shared `Product` interface `{ name, price, productUrl, currency }`.                                                                                                                                                                    |
| `shared/vtexScraper.ts`      | Generic VTEX catalog scraper. Paginates through `fq=` category results 50 products at a time. Used by Flamengo and Palmeiras.                                                                                                          |

---

## Test results

Run all scrapers with:

```bash
npx tsx tests/all-scrapers.test.ts
# or filter to a single club:
npx tsx tests/all-scrapers.test.ts "Arsenal"
```

Each scraper has a 120-second timeout. Returning 0 products is treated as **skipped** (⚠️), not a failure.

### Latest run summary

| Result                  | Count |
| ----------------------- | ----- |
| ✅ Passed               | 53    |
| ⚠️ Skipped (0 products) | 10    |
| ❌ Failed               | 0     |

### Known limitations

| Club             | Reason                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Aston Villa      | Fanatics/Akamai — returns HTTP 403 regardless of headers                |
| Chelsea          | Fanatics/Akamai — returns HTTP 403 regardless of headers                |
| Everton          | Fanatics — returns HTTP 403 on all requests                             |
| Liverpool        | Queue-it virtual waiting room — redirects to queue.liverpoolfc.com      |
| Bayer Leverkusen | Queue-it virtual waiting room active — bot requests queued indefinitely |
| Bayern München   | Akamai CDN returns HTTP 403 for non-EU IP addresses                     |
| Ajax             | Bot protection blocks headless Chromium                                 |
| AZ               | Bot protection blocks headless Chromium                                 |
| Feyenoord        | Bot protection blocks headless Chromium                                 |
| PSV Eindhoven    | Bot protection blocks headless Chromium                                 |
