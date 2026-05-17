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
        PremierLeague/
          <ClubName>/         # One folder per club, one scrapper file inside
          puppeteerUtils.ts   # Shared Puppeteer launch helper
          Product.ts          # Shared product type
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
2. `POST /api/scrape` launches the club-specific Puppeteer scrapper.
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

| Club                     | League           | Store                                       | Platform           | Approach                                                                      | Status      |
| ------------------------ | ---------------- | ------------------------------------------- | ------------------ | ----------------------------------------------------------------------------- | ----------- |
| Arsenal                  | Premier League   | `arsenaldirect.arsenal.com`                 | —                  | —                                                                             | ⚠️ Untested |
| Aston Villa              | Premier League   | `shop.avfc.co.uk`                           | Fanatics           | —                                                                             | ⚠️ Untested |
| Bournemouth              | Premier League   | `shop.afcb.co.uk`                           | JonasSports        | `fetch` POST to `/api/product/catalogue/list/getdetails.php`                  | ⚠️ Untested |
| Brentford                | Premier League   | `shop.brentfordfc.com`                      | JonasSports        | `scrapeJonasShop` helper                                                      | ✅ Working  |
| Brighton                 | Premier League   | `shop.brightonandhovealbion.com`            | JonasSports        | `scrapeJonasShop` helper (id=71)                                              | ✅ Working  |
| Burnley                  | Premier League   | `shop.burnleyfc.com`                        | JonasSports        | Puppeteer + Cheerio, `.product-list` DOM                                      | ✅ Working  |
| Chelsea                  | Premier League   | `store.chelseafc.com`                       | Fanatics           | Stealth Puppeteer, intercepts `/api/product-data` JSON                        | ✅ Working  |
| Crystal Palace           | Premier League   | `shop.cpfc.co.uk`                           | JonasSports        | `scrapeJonasShop` helper (id=142)                                             | ✅ Working  |
| Everton                  | Premier League   | `evertondirect.evertonfc.com`               | SFCC               | `fetch` to `demandware.store/Search-Show?cgid=kits`, parses embedded JSON     | ✅ Working  |
| Fulham                   | Premier League   | `shop.fulhamfc.com`                         | JonasSports        | `scrapeJonasShop` helper (id=174)                                             | ✅ Working  |
| Liverpool                | Premier League   | `store.liverpoolfc.com`                     | Magento 2          | Stealth Puppeteer (bypasses Queue-it), `.product-item` DOM across 4 kit pages | ✅ Working  |
| Luton Town               | Premier League   | `shop.lutontown.co.uk`                      | JonasSports        | Stealth Puppeteer + Cheerio, `.product-list` DOM                              | ⚠️ Untested |
| Manchester City          | Premier League   | `shop.mancity.com`                          | SFCC               | Stealth Puppeteer, `script.product-data[type="application/json"]`             | ⚠️ Untested |
| Manchester United        | Premier League   | `store.manutd.com`                          | Scayle             | `fetch`, JSON-LD `ItemList` extraction across 4 kit URLs                      | ✅ Working  |
| Newcastle United         | Premier League   | `shop.newcastleunited.com`                  | Shopify            | `fetch` `/collections/{handle}/products.json?country=GB`                      | ✅ Working  |
| Nottingham Forest        | Premier League   | `shop.nottinghamforest.co.uk`               | Shopify            | `fetch` `/collections/{handle}/products.json?country=GB`                      | ✅ Working  |
| Sheffield United         | Premier League   | `sufcdirect.co.uk`                          | JonasSports        | `fetch` POST, custom params (id=117, brch=201, display_oos=Y)                 | ✅ Working  |
| Tottenham Hotspur        | Premier League   | `shop.tottenhamhotspur.com`                 | SFCC               | `fetch` with `GlobalE_Data` cookie set to GBP, parses product tiles from HTML | ✅ Working  |
| West Ham United          | Premier League   | `shop.whufc.com`                            | JonasSports        | `scrapeJonasShop` helper (id=128)                                             | ✅ Working  |
| Wolves                   | Premier League   | `shop.wolves.co.uk`                         | JonasSports        | `scrapeJonasShop` helper (id=55)                                              | ✅ Working  |
| Bayer Leverkusen         | Bundesliga       | `www.bayer04.de/de-de/shop/`                | —                  | Stealth Puppeteer; returns `[]` if Queue-it waiting room detected             | ✅ Working  |
| Bayern München           | Bundesliga       | `fcbayern.com/store`                        | Scayle             | Stealth Puppeteer, kit category URLs; may 403 from non-EU IPs                 | ✅ Working  |
| Borussia Dortmund        | Bundesliga       | `shop.bvb.de`                               | —                  | Stealth Puppeteer; returns `[]` if Queue-it detected                          | ⚠️ Untested |
| Borussia Mönchengladbach | Bundesliga       | `shop.borussia.de`                          | Scayle             | Stealth Puppeteer, `/de-de/trikots`                                           | ✅ Working  |
| Darmstadt 98             | Bundesliga       | `shop.sv98.de`                              | Shopware 6         | Stealth Puppeteer, `.product-box` across 4 category URLs                      | ✅ Working  |
| Eintracht Frankfurt      | Bundesliga       | `stores.eintracht.de`                       | Gatsby SPA         | Stealth Puppeteer (fetch returns empty shell), `a.ef-product-card`            | ✅ Working  |
| FC Augsburg              | Bundesliga       | `shop.fcaugsburg.de`                        | LMS Sport GmbH     | `fetch` + Cheerio; links start with `fca-`                                    | ✅ Working  |
| 1. FC Heidenheim         | Bundesliga       | `merchandising-onlineshop.com/fcheidenheim` | Shopware           | Stealth Puppeteer; returns `[]` when Queue-it is active                       | ⚠️ Untested |
| Mainz 05                 | Bundesliga       | `shop.mainz05.de`                           | Shopware 6         | Stealth Puppeteer, `.product-box` / `.product-price-info`                     | ✅ Working  |
| RB Leipzig               | Bundesliga       | `www.redbullshop.com`                       | Red Bull Shop      | Stealth Puppeteer, `/de-int/c/rbl-official-kit-by-puma/`                      | ✅ Working  |
| SC Freiburg              | Bundesliga       | `shop.scfreiburg.com`                       | Custom (004 GmbH)  | `fetch` + Cheerio, category 2 (Trikots & Training)                            | ⚠️ Untested |
| TSG Hoffenheim           | Bundesliga       | `shop.tsg-hoffenheim.de`                    | SAP Commerce Cloud | SAP OCC REST API — no Puppeteer needed                                        | ✅ Working  |
| 1. FC Union Berlin       | Bundesliga       | `fanartikel.union-zeughaus.de`              | Shopify            | `fetch` Shopify JSON API `/collections/trikots-co/products.json`              | ✅ Working  |
| VfB Stuttgart            | Bundesliga       | `shop.vfb.de`                               | Next.js / Tailwind | Stealth Puppeteer, `/en/jerseys-and-training/jerseys`                         | ✅ Working  |
| VfL Wolfsburg            | Bundesliga       | `shop.vfl-wolfsburg.de`                     | Shopware 6         | Stealth Puppeteer, `.product-box`                                             | ✅ Working  |
| Werder Bremen            | Bundesliga       | `shop.werder.de`                            | BigCommerce        | Stealth Puppeteer, `/trikots.html/`, `<product-card>` web component           | ✅ Working  |
| Flamengo                 | Brasileirão      | `loja.flamengo.com.br`                      | VTEX               | `scrapeVtexStore` — catalog API `fq=C:/115/`, paginated 50/page               | ✅ Working  |
| Palmeiras                | Brasileirão      | `www.palmeirasstore.com`                    | VTEX               | `scrapeVtexStore` — catalog API `fq=C:/343/`, paginated 50/page               | ✅ Working  |
| Corinthians              | Brasileirão      | `www.shoptimao.com.br`                      | Netshoes           | `fetch` `/api/friendly/camisas?page=N`; paginated by `totalPages`             | ✅ Working  |
| Boca Juniors             | Primera División | `www.bocashop.com.ar`                       | VTEX               | `fetch` VTEX catalog API `fq=C:/3/6/`, paginated 50/page                      | ✅ Working  |

### Shared utilities

| File                                | Purpose                                                                                                                                                                                                                                |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PremierLeague/jonasShopScraper.ts` | Generic scraper for the **JonasSports** platform. POSTs directly to the internal AJAX endpoint using the category `id` embedded in each store's page JS. Used by Brentford, Brighton, Crystal Palace, Fulham, West Ham United, Wolves. |
| `PremierLeague/puppeteerUtils.ts`   | Shared Puppeteer launch helper — uses `@sparticuz/chromium` on Vercel, bundled Chromium locally. Supports optional stealth mode.                                                                                                       |
| `PremierLeague/Product.ts`          | Shared `Product` interface `{ name, price, productUrl, currency }`.                                                                                                                                                                    |
| `Brasileirão/vtexScraper.ts`        | Generic VTEX catalog scraper. Paginates through `fq=` category results 50 products at a time. Used by Flamengo and Palmeiras.                                                                                                          |

