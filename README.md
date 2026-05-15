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

- Every scrape always inserts a new `ProductHistory` row (even if the price is unchanged), enabling a full timeline chart in the future.
- The discount check uses `max(historical price) - current price / max(historical price) >= 0.30`.

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

### Premier League

| Club              | Store                            | Platform    | Approach                                                                      | Status      |
| ----------------- | -------------------------------- | ----------- | ----------------------------------------------------------------------------- | ----------- |
| Arsenal           | `arsenaldirect.arsenal.com`      | —           | —                                                                             | ⚠️ Untested |
| Aston Villa       | `shop.avfc.co.uk`                | Fanatics    | —                                                                             | ⚠️ Untested |
| Bournemouth       | `shop.afcb.co.uk`                | JonasSports | `fetch` POST to `/api/product/catalogue/list/getdetails.php`                  | ⚠️ Untested |
| Brentford         | `shop.brentfordfc.com`           | JonasSports | `scrapeJonasShop` helper                                                      | ✅ Working  |
| Brighton          | `shop.brightonandhovealbion.com` | JonasSports | `scrapeJonasShop` helper (id=71)                                              | ✅ Working  |
| Burnley           | `shop.burnleyfc.com`             | JonasSports | Puppeteer + Cheerio, `.product-list` DOM                                      | ✅ Working  |
| Chelsea           | `store.chelseafc.com`            | Fanatics    | Stealth Puppeteer, intercepts `/api/product-data` JSON                        | ✅ Working  |
| Crystal Palace    | `shop.cpfc.co.uk`                | JonasSports | `scrapeJonasShop` helper (id=142)                                             | ✅ Working  |
| Everton           | `evertondirect.evertonfc.com`    | SFCC        | `fetch` to `demandware.store/Search-Show?cgid=kits`, parses embedded JSON     | ✅ Working  |
| Fulham            | `shop.fulhamfc.com`              | JonasSports | `scrapeJonasShop` helper (id=174)                                             | ✅ Working  |
| Liverpool         | `store.liverpoolfc.com`          | Magento 2   | Stealth Puppeteer (bypasses Queue-it), `.product-item` DOM across 4 kit pages | ✅ Working  |
| Luton Town        | `shop.lutontown.co.uk`           | JonasSports | Stealth Puppeteer + Cheerio, `.product-list` DOM                              | ⚠️ Untested |
| Manchester City   | `shop.mancity.com`               | SFCC        | Stealth Puppeteer, `script.product-data[type="application/json"]`             | ⚠️ Untested |
| Manchester United | `store.manutd.com`               | Scayle      | `fetch`, JSON-LD `ItemList` extraction across 4 kit URLs                      | ✅ Working  |
| Newcastle United  | `shop.newcastleunited.com`       | Shopify     | `fetch` `/collections/{handle}/products.json?country=GB`                      | ✅ Working  |
| Nottingham Forest | `shop.nottinghamforest.co.uk`    | Shopify     | `fetch` `/collections/{handle}/products.json?country=GB`                      | ✅ Working  |
| Sheffield United  | `sufcdirect.co.uk`               | JonasSports | `fetch` POST, custom params (id=117, brch=201, display_oos=Y)                 | ✅ Working  |
| Tottenham Hotspur | `shop.tottenhamhotspur.com`      | SFCC        | `fetch` with `GlobalE_Data` cookie set to GBP, parses product tiles from HTML | ✅ Working  |
| West Ham United   | `shop.whufc.com`                 | JonasSports | `scrapeJonasShop` helper (id=128)                                             | ✅ Working  |
| Wolves            | `shop.wolves.co.uk`              | JonasSports | `scrapeJonasShop` helper (id=55)                                              | ✅ Working  |

### Shared utilities

| File                  | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jonasShopScraper.ts` | Generic scraper for clubs on the **JonasSports** platform. Products are loaded client-side via an internal AJAX endpoint (`/api/product/catalogue/list/getdetails.php`); a plain `fetch` of the page HTML returns no products. The utility POSTs directly to that endpoint using the category `id` embedded in each store's page JS. Used by Brentford (id=185), Brighton (id=71), Crystal Palace (id=142), Fulham (id=174). |
| `puppeteerUtils.ts`   | Shared Puppeteer launch helper for JS-rendered stores.                                                                                                                                                                                                                                                                                                                                                                       |
| `Product.ts`          | Shared `Product` interface.                                                                                                                                                                                                                                                                                                                                                                                                  |

### Primera División (Argentina)

| Club         | Store                 | Platform | Approach                                                                      | Status     |
| ------------ | --------------------- | -------- | ----------------------------------------------------------------------------- | ---------- |
| Boca Juniors | `www.bocashop.com.ar` | VTEX     | `fetch` VTEX catalog API `fq=C:/3/6/` (camisetas category), paginated 50/page | ✅ Working |
