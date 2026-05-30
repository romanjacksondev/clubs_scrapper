# Stub Scrapers — Teams with No Functioning Scraper

> Last updated: 29 May 2026 — **190 teams** across 13 leagues.

---

## Brasileirão Série A (Brazil) (12 teams)

| Team             | Reason                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Atlético Mineiro | Atlético Mineiro official store (loja.atletico.com.br) Platform not identified — store unreachable from outside Brazil.            |
| Bahia            | Bahia official store (loja.esporteclubebahia.com.br) Store unreachable from outside Brazil; platform not identified.               |
| Bragantino       | Red Bull Bragantino official store (www.redbullbragantino.com.br) VTEX HTML detected but the legacy search API redirects to login. |
| Fortaleza        | Fortaleza official store (loja.fortalezaec.com.br) Store unreachable from outside Brazil; platform not identified.                 |
| Grêmio           | Grêmio official store (loja.gremio.net) Store unreachable from outside Brazil; platform not identified.                            |
| Internacional    | Internacional official store (loja.internacional.com.br) Custom Next.js storefront — no public product API discovered.             |
| Juventude        | Juventude official store (loja.ecjuventude.com.br) Store unreachable from outside Brazil; platform not identified.                 |
| Mirassol         | Mirassol official store (loja.mirassolfc.com.br) Small club — no accessible online store found.                                    |
| Novorizontino    | Novorizontino official store (loja.novorizontino.com.br) Small club — no accessible online store found.                            |
| Santos           | Santos official store (loja.santosfc.com.br) Store unreachable from outside Brazil; platform not identified.                       |
| Sport Recife     | Sport Recife official store (loja.sport.com.br) Store unreachable from outside Brazil; platform not identified.                    |
| Vitória          | Vitória official store (loja.ecvitoria.com.br) Store returned HTTP 530 (Cloudflare origin error); platform not identified.         |

## Bundesliga (Germany) (1 team)

> Implemented: 1FC Heidenheim (Puppeteer), Bayer Leverkusen (Playwright/de-DE), Borussia Dortmund (Puppeteer), Borussia Mönchengladbach (fetch+Cheerio), FC Augsburg (fetch+Cheerio), RB Leipzig (fetch+Cheerio), VfB Stuttgart (fetch+RSC JSON), Werder Bremen (fetch+Cheerio)

| Team          | Reason                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bayern Munich | FC Bayern München official store (fcbayern.com/store) — Scayle platform. Akamai geo-block: all jersey category URLs return HTTP 403 from non-EU IPs. Needs EU VPS (e.g., Hetzner Frankfurt) to scrape. |

## EFL Championship (England) (23 teams)

| Team                 | Reason                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Birmingham City      | Birmingham City official store (clubstore.bcfc.com) — JonasSports platform. All-kit category id=62, websales_brch=300.                                                  |
| Blackburn Rovers     | Blackburn Rovers official store (www.rovers.co.uk/store) — custom GC platform. All product listings are dynamically rendered via client-side JavaScript.                |
| Bristol City         | Bristol City official store (shop.bristol-sport.co.uk) — JonasSports platform. All-football-kit category id=163, websales_brch=300.                                     |
| Cardiff City         | Cardiff City official store (www.cardiffcityfcstore.com) — JonasSports platform. Product listings are JS-rendered, but individual product detail pages include a        |
| Charlton Athletic    | Charlton Athletic official store (clubshop.cafc.co.uk) — Cloudflare bot protection. All programmatic requests are blocked with HTTP 403 (Cloudflare).                   |
| Coventry City        | Coventry City official store (shop.ccfc.co.uk) — connection times out consistently. The store may have geo-restrictions or anti-scraping measures at the network level. |
| Derby County         | Derby County official store (www.dcfcmegastore.co.uk) — Akamai bot protection. All programmatic requests are blocked with HTTP 403 (Akamai EdgeSuite).                  |
| Hull City            | Hull City official store (www.tigerleisure.com) — JonasSports platform. Product listings are JS-rendered, but individual product detail pages include a                 |
| Ipswich Town         | Ipswich Town official store (shop.itfc.co.uk) — Shopify. The 'kit' collection covers all current season kits.                                                           |
| Leicester City       | Leicester City official store (shop.lcfc.com) — Magento with Hyvä/Vue frontend. All product listings are dynamically rendered via client-side JavaScript.               |
| Middlesbrough        | Middlesbrough FC official store (shop.mfc.co.uk) — JonasSports platform. Separate category IDs per kit: home=30, away=31, third=36, goalkeeper=32.                      |
| Millwall FC          | Millwall FC official store (shop.millwallfc.co.uk) — Akamai bot protection. All programmatic requests are blocked with HTTP 403 (Akamai EdgeSuite).                     |
| Norwich City         | Norwich City official store (shop.canaries.co.uk) — JonasSports platform. All-kits category id=170, websales_brch=300.                                                  |
| Oxford United        | Oxford United official store (www.oufcshop.co.uk) — JonasSports platform. Separate category IDs per kit: home=23, away=24, third=25, goalkeeper=26.                     |
| Portsmouth FC        | Portsmouth FC official store (pompey.clubstore.co.uk) — nopCommerce / custom SPA. All product pages are dynamically rendered via client-side JavaScript.                |
| Preston NE           | Preston North End official store (shop.pnefc.net) — Shopify. The '25-26-all-kits' collection covers all current season kits.                                            |
| QPR                  | Queens Park Rangers official store (shop.qpr.co.uk) — Shopify. Kit collections exist in the store navigation but currently return 0 products.                           |
| Southampton FC       | Southampton FC official store (store.southamptonfc.com) — JonasSports platform. All-kits category id=164, websales_brch=300.                                            |
| Stoke City           | Stoke City official store (store.stokecityfc.com) — JonasSports platform. The store carries only leisurewear, gifts, and retro items — no current replica kits.         |
| Swansea City         | Swansea City official store (store.swanseacity.com) — Shopify. Separate collections per kit type: home-kit, away, third.                                                |
| Watford FC           | Watford FC official store (www.thehornetsshop.co.uk) — JonasSports platform. Separate category IDs per kit: home=127, away=128, third=129.                              |
| West Bromwich Albion | West Bromwich Albion official store (shop.wba.co.uk) — JonasSports platform. All-kit category id=79, websales_brch=300.                                                 |
| Wrexham AFC          | Wrexham AFC official store (shop.wrexhamafc.co.uk) — Shopify. Separate collections per kit type for the 25/26 season.                                                   |

## Eredivisie (Netherlands) (5 teams)

| Team          | Reason                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZ            | AZ Alkmaar official store (azshop.nl) — Shopify.                                                                                                                     |
| Ajax          | Ajax official store (www.ajax.nl/shop) — custom Next.js + Umbraco CMS storefront. Kit category pages embed product data in **NEXT_DATA** JSON which is parsed first. |
| Feyenoord     | Feyenoord official store (www.feyenoordshop.nl). The store has an invalid TLS certificate and the Shopify JSON API returns HTML                                      |
| PSV Eindhoven | PSV Eindhoven official store (psvfanshop.nl) — Shopify. The store has an invalid/self-signed TLS certificate; Node's https module                                    |
| SC Heerenveen | SC Heerenveen official store (www.feanstoreonline.nl) — custom Umbraco/TRES platform. Products are server-rendered on the /shop/wedstrijd page.                      |

## La Liga (Spain) (15 teams)

> ✅ Implemented via Playwright: Getafe (Magento 1.x), Osasuna (Magento 2), Alavés (PrestaShop), Real Sociedad (PrestaShop), Rayo Vallecano (PrestaShop)

| Team            | Reason                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Athletic Bilbao | Shopify store — the 'kits' collection covers all kit types for all seasons.                                                                                      |
| Atlético Madrid | SFCC-based store (Salesforce Commerce Cloud). Category pages contain an `ItemList` LD+JSON block with product URLs.                                              |
| Barcelona       | Shopify store — the 'kits' collection covers home, away, third, and goalkeeper kits.                                                                             |
| Celta Vigo      | Store is Sucuri WAF protected — needs EU VPS.                                                                                                                    |
| Elche           | WooCommerce store — category 'equipaciones' (ID 32) contains all kits.                                                                                           |
| Espanyol        | Store requires JS rendering (redirects / SPA) — needs EU VPS.                                                                                                    |
| Girona          | WooCommerce store — category ID 1971 ("T. 25-26") holds all 25/26 season products. The Store API does not support filtering by category ID directly, so we fetch |
| Levante         | Shopify store — the 'equipacions' collection covers all kit types.                                                                                               |
| Mallorca        | Shopify store — the 'equipaciones' collection covers all kit types.                                                                                              |
| Real Betis      | Store not accessible via public API (JS-rendered / WAF blocked) — needs EU VPS.                                                                                  |
| Real Madrid     | Shopify store — the 'jerseys-kits' collection covers all kit types.                                                                                              |
| Real Oviedo     | No dedicated accessible store found — needs EU VPS.                                                                                                              |
| Sevilla         | Shopify store — the 'equipaciones-25-26' collection covers all kit types for the current season.                                                                 |
| Valencia        | Magento + Hyvä store. Category pages contain an `ItemList` LD+JSON block with product URLs.                                                                      |
| Villarreal      | Shopify store — the 'equipaciones' collection covers home/away/third kits.                                                                                       |

## Liga AUF Uruguay (16 teams)

| Team                   | Reason                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- |
| Albion FC              | No accessible public store found — stub                                          |
| Boston River           | No accessible public store found — stub                                          |
| Central Español        | No accessible public store found — stub                                          |
| Cerro                  | Store not yet identified.                                                        |
| Cerro Largo            | No accessible public store found — stub                                          |
| Club Dep Maldonado     | No accessible public store found — stub                                          |
| Danubio                | Store not yet identified.                                                        |
| Defensor Sporting      | No accessible public store found — stub                                          |
| Juventud               | No accessible public store found — stub                                          |
| Liverpool              | Store not yet identified.                                                        |
| Montevideo City Torque | Store not yet identified.                                                        |
| Montevideo Wanderers   | No accessible public store found — stub                                          |
| Nacional               | Domain nacional.com.uy does not resolve from external servers — stub             |
| Peñarol                | Store not yet identified.                                                        |
| Progreso               | No accessible public store found — stub                                          |
| Racing Club            | WooCommerce Store API — small catalog (~27 products), no category filter needed. |

## Liga MX (Mexico) (18 teams)

| Team               | Reason                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atlas FC           | Atlas FC official store (shop.atlasfc.com.mx) — Shopify. Uses the Shopify /collections/jersey/products.json API.                                        |
| Atletico San Luis  | Atlético de San Luis official store — atleticosanluis.com. Store is inaccessible to programmatic requests (server error / WAF).                         |
| CF Monterrey       | CF Monterrey (Rayados) official store (tienda.rayados.com) — Cloudflare-protected. All programmatic requests receive a 403 / Cloudflare challenge page. |
| CF Pachuca         | CF Pachuca (Tuzos) official store — tuzos.com.mx. Store returns HTTP 403 / Access Denied to programmatic requests.                                      |
| Chivas Guadalajara | Chivas Guadalajara official store (tiendachivas.com.mx) — BigCommerce. Scrapes the search results page for "jersey" queries.                            |
| Club America       | Club América official store (tiendaclubamerica.com.mx). The domain is currently unresolvable and the store is inaccessible to                           |
| Club Puebla        | Club Puebla official store — clubpuebla.com. Store is inaccessible to programmatic requests (HTTP 530 / Cloudflare).                                    |
| Club Tijuana       | Club Tijuana (Xoloitzcuintles) official store — xoloitzcuintles.com. Store is inaccessible to programmatic requests (SSL certificate mismatch / WAF).   |
| Cruz Azul          | Cruz Azul official store (tiendacruzazul.mx) — Shopify. Uses the Shopify /products.json API for the 'jersey' collection.                                |
| Deportivo Toluca   | Deportivo Toluca FC official store — deportivotoluca.mx. Store is inaccessible to programmatic requests (no accessible store API found).                |
| FC Juarez          | FC Juárez official store (bravotienda.com) — Shopify. Uses the Shopify /collections/jersey-25-26/products.json API for football jerseys.                |
| Leon FC            | León FC official store — clubleon.com. Store returns HTTP 403 to programmatic requests.                                                                 |
| Mazatlan FC        | Mazatlán FC official store — mazatlanfc.com. No accessible public store API found.                                                                      |
| Necaxa             | Necaxa official store — clubnecaxa.com. No accessible public store API found; the store frontend is not programmatically reachable.                     |
| Pumas UNAM         | Pumas UNAM official store (tiendapumas.com) — Shopify. Uses the Shopify /collections/jerseys/products.json API.                                         |
| Queretaro FC       | Querétaro FC (Gallos Blancos) official store — gallos.mx. No accessible public store API found.                                                         |
| Santos Laguna      | Santos Laguna official store — santoslaguna.com.mx. No accessible public store API found.                                                               |
| Tigres UNAM        | Tigres UNAM official store (tigretienda.com) — Shopify. Uses the Shopify /collections/playera/products.json API.                                        |

## Ligue 1 (France) (4 teams)

| Team               | Reason                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Marseille          | Olympique de Marseille official store (boutique.om.fr) — Shopify. Uses the Shopify /products.json API for the home (domicile-flocage)           |
| Monaco             | AS Monaco official store (shop.asmonaco.com) — Shopify. Uses the Shopify /products.json API for the kits collection,                            |
| Olympique Lyonnais | Olympique Lyonnais official store (boutique.ol.fr) — custom PrestaShop. The store exposes an AJAX endpoint for category pages that returns JSON |
| PSG                | Paris Saint-Germain official store (shop.psg.fr) — Fanatics platform. The store is protected by Akamai bot detection and returns HTTP 403       |

## MLS (USA/Canada) (30 teams)

| Team                   | Reason                                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atlanta United         | Atlanta United FC official store: shop.atlutd.com / www.mlsstore.com/atlanta-united (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                         |
| Austin FC              | Austin FC official store: www.mlsstore.com/austin-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                                        |
| CF Montreal            | CF Montréal official store: boutique.cfmontreal.com / www.mlsstore.com/cf-montreal (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                          |
| Charlotte FC           | Charlotte FC official store: shop.charlottefc.com / www.mlsstore.com/charlotte-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                           |
| Chicago Fire           | Chicago Fire FC official store: store.chicagofire.com / www.mlsstore.com/chicago-fire-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                    |
| Colorado Rapids        | Colorado Rapids official store: store.coloradorapids.com / www.mlsstore.com/colorado-rapids (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                 |
| ColumbusСrew           | Columbus Crew official store: store.columbuscrew.com / www.mlsstore.com/columbus-crew (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                       |
| DC United              | D.C. United official store: shop.dcunited.com / www.mlsstore.com/dc-united (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                  |
| FC Cincinnati          | FC Cincinnati official store: store.fccincinnati.com / www.mlsstore.com/fc-cincinnati (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                       |
| FC Dallas              | FC Dallas official store: store.fcdallas.com / www.mlsstore.com/fc-dallas (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                   |
| Houston Dynamo         | Houston Dynamo FC official store: store.houstondynamo.com / www.mlsstore.com/houston-dynamo (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                 |
| Inter Miami            | Inter Miami CF official store: www.mlsstore.com/inter-miami-cf (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                              |
| LA Galaxy              | LA Galaxy official store: www.mlsstore.com/la-galaxy (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                                        |
| Los Angeles FC         | Los Angeles FC (LAFC) official store: store.lafc.com / www.mlsstore.com/los-angeles-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                      |
| Minnesota United       | Minnesota United FC official store: store.mnufc.com / www.mlsstore.com/minnesota-united-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                  |
| Nashville SC           | Nashville SC official store: store.nashvillesc.com / www.mlsstore.com/nashville-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                          |
| New England Revolution | New England Revolution official store: store.revolutionsoccer.net / www.mlsstore.com/new-england-revolution (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager — |
| New York City FC       | New York City FC official store: www.mlsstore.com/new-york-city-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                          |
| New York Red Bulls     | New York Red Bulls official store: store.newyorkredbulls.com / www.mlsstore.com/new-york-red-bulls (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —          |
| Orlando City SC        | Orlando City SC official store: store.orlandocitysc.com / www.mlsstore.com/orlando-city-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                  |
| Philadelphia Union     | Philadelphia Union official store: store.philadelphiaunion.com / www.mlsstore.com/philadelphia-union (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —        |
| Portland Timbers       | Portland Timbers official store: store.timbers.com / www.mlsstore.com/portland-timbers (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                      |
| Real Salt Lake         | Real Salt Lake official store: store.realsaltlake.com / www.mlsstore.com/real-salt-lake (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                     |
| San Diego FC           | San Diego FC official store: store.sandiegofc.com / www.mlsstore.com/san-diego-fc (Fanatics). Expansion club joining MLS in 2025.                                                                  |
| San Jose Earthquakes   | San Jose Earthquakes official store: store.sjearthquakes.com / www.mlsstore.com/san-jose-earthquakes (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —        |
| Seattle Sounders       | Seattle Sounders FC official store: store.soundersfc.com / www.mlsstore.com/seattle-sounders-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —             |
| Sporting Kansas City   | Sporting Kansas City official store: store.sportingkc.com / www.mlsstore.com/sporting-kansas-city (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —           |
| St Louis City SC       | St. Louis City SC official store: store.stlouiscitysc.com / www.mlsstore.com/st-louis-city-sc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —               |
| Toronto FC             | Toronto FC official store: shop.torontofc.ca / www.mlsstore.com/toronto-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —                                  |
| Vancouver Whitecaps    | Vancouver Whitecaps FC official store: store.whitecapsfc.com / www.mlsstore.com/vancouver-whitecaps-fc (Fanatics). The MLS Store is powered by Fanatics and protected by Akamai Bot Manager —      |

## Premier League (England) (13 teams)

| Team              | Reason                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arsenal           | Product data is server-rendered in the static HTML. Each product is wrapped in an <a href="/.../.../p/MJ[ID]"> anchor containing:                                                 |
| Aston Villa       | Aston Villa shop runs on Fanatics. Direct requests to most URLs are blocked (403) by Imperva, but navigating from www.avfc.co.uk first sets a session cookie that                 |
| Bournemouth       | Bournemouth shop is server-rendered. Each product is in a .ProductCell div: - .productTitle a → name (text) + href (relative "../../afc-bournemouth/SLUG")                        |
| Brentford         | Store not yet identified.                                                                                                                                                         |
| Brighton          | Store not yet identified.                                                                                                                                                         |
| Chelsea           | Chelsea FC shop runs on Fanatics (same platform as Aston Villa). Navigating to /collections/mens-kits fires /api/product-data?type=collection-explorer                            |
| Crystal Palace    | Store not yet identified.                                                                                                                                                         |
| Everton           | Everton store runs on Salesforce Commerce Cloud (SFCC) with an Iris React frontend. The kit product listing is embedded as JSON in the second "items" array of the                |
| Leeds United      | Leeds United official store (shop.leedsunited.com) — Assembly/custom platform with Akamai bot protection. All programmatic requests are blocked with HTTP 403 (Akamai EdgeSuite). |
| Liverpool         | Liverpool store runs on Magento 2 with a custom Lfc theme, fronted by Queue-it (Cloudflare virtual queue). Plain fetch is 302'd to the queue; stealth Puppeteer                   |
| Sheffield United  | Sheffield United store (sufcdirect.co.uk) runs on the JonasSports platform. The Jonas AJAX catalogue API is called with the category ID found in the page                         |
| Sunderland AFC    | Sunderland AFC official store (www.safcstore.com) — custom platform with Akamai bot protection. All programmatic requests are blocked with HTTP 403 (Akamai EdgeSuite).           |
| Tottenham Hotspur | The GlobalE_Data cookie tells the SFCC store which country/currency to use. Without it the server geo-detects the IP and returns local (ARS) prices.                              |

## Primeira Liga (Portugal) (16 teams)

| Team            | Reason                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AVS             | AVS Futebol SAD official store: no accessible online store found. This club (formerly Vitória de Setúbal) has no identifiable public product API.                                |
| Arouca          | FC Arouca official store: fcarouca.pt/loja (SSL certificate issues when accessed externally) The store cannot be verified programmatically due to SSL configuration.             |
| Boavista        | Boavista FC official store: boavistafc.pt/loja/ The store is embedded in the club's WordPress site and does not expose a public                                                  |
| Braga           | SC Braga official store: store.scbraga.pt The store is a WordPress-based site (not Shopify or WooCommerce with public API).                                                      |
| Casa Pia        | Casa Pia AC official store: casapiaac.pt/loja (also listed on desportiva.pt) The store is hosted on a third-party platform (desportiva.pt) that does not                         |
| Estoril Praia   | Estoril Praia official store: lojaoficial.ligaportugal.pt (Liga Portugal official store) Products are sold via the Liga Portugal multi-club store; no club-specific product API. |
| Estrela Amadora | Estrela da Amadora official store: no accessible online store found. Domain candidates (estreladaamadora.pt, estreladaamadora.com) are not resolvable.                           |
| Famalicão       | FC Famalicão official store: no accessible online store found. The official site (fcfamalicao.com) redirects to a portal page with no product API.                               |
| Farense         | SC Farense official store: no accessible online store found. Domain candidates (scfarense.com, scfarense.pt) are not resolvable from outside Portugal.                           |
| Gil Vicente     | Gil Vicente FC official store: no accessible online store found. The official domain (gilvicente.pt) does not resolve from outside Portugal.                                     |
| Moreirense      | Moreirense FC official store: no accessible online store found. The official site (moreirensefc.pt) does not link to an online store.                                            |
| Nacional        | CD Nacional (Madeira) official store: cdnacional.pt/loja/ The store is a WordPress/WooCommerce site; the WooCommerce REST API requires                                           |
| Rio Ave         | Rio Ave FC official store: rioavefc.pt/loja/ The store is embedded in the club's WordPress site and does not expose a public                                                     |
| Santa Clara     | CD Santa Clara official store: no accessible online store found. The official site (cdsantaclara.pt) does not expose a public product API.                                       |
| Sporting CP     | Sporting CP official store: lojaverde.sporting.pt (Angular SPA). The store is fully client-side rendered and the backend API (/api/product)                                      |
| Vitória SC      | Vitória SC (Guimarães) official store: loja.vitoriasc.pt The store redirects and does not expose a Shopify or other public product API.                                          |

## Primera División (Argentina) (23 teams)

| Team                  | Reason                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arsenal De Sarandí    | Arsenal de Sarandí official store: no accessible online store found. All known domain candidates (arsenal-fc.com.ar, tienda.arsenal-fc.com.ar) are               |
| Atlético Tucumán      | Atlético Tucumán official store: no accessible online store found. The official site (atleticotucuman.com) does not expose a public product API.                 |
| Banfield              | Banfield official store: no accessible online store found. Domain candidates (tiendabanfield.com.ar, clubbanfield.com.ar) are not resolvable.                    |
| Barracas Central      | Barracas Central official store: no accessible online store found. The official site (barracascentral.com) does not link to an online store.                     |
| Belgrano              | Belgrano official store: no accessible online store found. The official site (cabelgrano.com.ar) has SSL issues and does not expose a product API.               |
| Central Córdoba       | Central Córdoba (Santiago del Estero) official store: no accessible online store found. The official site (centralcordoba.com.ar) does not expose a product API. |
| Defensa Y Justicia    | Defensa y Justicia official store: no accessible online store found. All known domain candidates are not resolvable from outside Argentina.                      |
| Estudiantes           | Tiendanube store (tiendapincha.com — Estudiantes de La Plata). Products are rendered server-side; each item has data-product-id attribute.                       |
| Gimnasia Y Esgrima LP | Gimnasia y Esgrima La Plata official store: no accessible online store found. Domain candidates (gimnasiaylp.com.ar, tiendaginmasia.com.ar) are not resolvable.  |
| Godoy Cruz            | Godoy Cruz official store: no accessible online store found. Domain candidates (tiendagodoycruz.com.ar, godoycruztomba.com) are not resolvable.                  |
| Huracán               | Huracán official store (tiendahuracan.com.ar). The store is currently unreachable (DNS / server offline).                                                        |
| Independiente         | Tiendanube store (independientestore.com.ar). Products are rendered server-side; each item has data-product-id attribute.                                        |
| Instituto             | Instituto (Córdoba) official store: tiendainstituto.com.ar The store uses the TiendaNube platform (mitiendanube.com CDN), which requires                         |
| Lanús                 | Lanús official store: tiendagranate.clublanus.com The store does not respond to Shopify or other known product API endpoints.                                    |
| Newells Old Boys      | Newell's Old Boys official store: no accessible online store found. Domain candidates (tiendanob.com.ar, tiendanewells.com.ar) are not resolvable.               |
| Patronato             | Patronato (Paraná) official store: no accessible online store found. Domain candidates (patronato.com.ar, tiendapatronato.com.ar) are not resolvable.            |
| Platense              | Platense official store: no accessible online store found. The official site (clubplatense.net) does not link to an online store.                                |
| San Martín Tucumán    | San Martín de Tucumán official store: no accessible online store found. No public product API has been identified for this club.                                 |
| Sarmiento             | Sarmiento (Junín) official store: no accessible online store found. Domain candidates (tiendasarmiento.com.ar, clubsarmiento.com) return 404.                    |
| Talleres              | Talleres (Córdoba) official store: no accessible online store found. Domain candidates (tiendatalleres.com.ar, talleres.net) are not resolvable.                 |
| Tigre                 | Tigre official store: tiendatigre.com.ar The store uses the TiendaNube platform (mitiendanube.com CDN), which requires                                           |
| Unión                 | Unión (Santa Fe) official store: tiendaunion.com.ar The store uses a custom platform — not Shopify, TiendaNube, or WooCommerce.                                  |
| Vélez Sarsfield       | Tiendanube store (tiendavelez.com.ar — Vélez Sarsfield). Products are rendered server-side; each item has data-product-id attribute.                             |

## Serie A (Italy) (14 teams)

| Team          | Reason                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC Milan      | Shopify store — milan-match-kit covers all match kit products for men/women/kids.                                                                                                  |
| AS Roma       | Shopify store — kit-gara covers all match-day kits (home/away/third).                                                                                                              |
| Atalanta      | Custom platform (officialstore.it). Products are rendered server-side with data-product-\* attributes on each product card.                                                        |
| Bologna       | Fanatics Italy platform (bolognafcstore.com) — SSR with React/Next.js. The top-level /it/kit-gara page only lists sub-categories; individual products                              |
| Fiorentina    | Fanatics Italy platform (fiorentinastore.com) — SSR with React/Next.js. The top-level /it/kit-gara page only lists sub-categories; individual products                             |
| Genoa         | WooCommerce store (genoacfc.it) — custom theme using card-product class. The top-level kit-gara category page lists sub-category links                                             |
| Hellas Verona | Shopify store (store.hellasverona.it) — Cloudflare-protected. Uses the Shopify /products.json API with browser-like headers.                                                       |
| Inter Milan   | Fanatics Italy platform (store.inter.it) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (including gender sub-pages);             |
| Juventus      | Fanatics Italy platform (store.juventus.com) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (including gender sub-pages);         |
| Lazio         | Fanatics Italy platform (www.laziostylestore.com) — same SSR platform as Bologna/Fiorentina. The /it/kit-gara index page lists sub-category links (home, away, third, goalkeeper); |
| Lecce         | US Lecce official store (www.usleccestore.it) — Shopify. Uses the Shopify /products.json API with browser-like headers.                                                            |
| Monza         | AC Monza official store (zeroplayer.it) — Shopify multi-brand store. Kit items are under the new-maglie-gare-ac-monza collection.                                                  |
| Napoli        | SSC Napoli official store (store.sscnapoli.it) — Shopify. Uses the Shopify /products.json API with browser-like headers.                                                           |
| Torino        | Torino FC official store (torinofcstore.com) — PrestaShop. Product data is embedded in the page as a `wk_category_products` JS variable.                                           |
