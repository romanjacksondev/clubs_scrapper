async function inspect() {
  console.log('--- CATEGORY PAGE ---');
  try {
    const r = await fetch('https://shop.atleticodemadrid.com/en/kits/home', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html' }
    });
    const html = await r.text();
    const ldJsonBlocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    let itemList = null;
    let productUrl = null;
    
    for (const m of ldJsonBlocks) {
      try {
        const d = JSON.parse(m[1]);
        if (d.itemListElement) {
          itemList = d;
          console.log('ItemList type:', d['@type']);
          console.log('ItemList count:', d.itemListElement.length);
          const first = d.itemListElement[0];
          productUrl = first.url || first['@id'];
          console.log('First item URL:', productUrl);
          break;
        }
      } catch(e) {}
    }

    if (productUrl) {
      console.log('\n--- PRODUCT PAGE ---');
      const pr = await fetch(productUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept': 'text/html' }
      });
      const phtml = await pr.text();
      const pldBlocks = [...phtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
      pldBlocks.forEach((m, i) => {
        try {
          const d = JSON.parse(m[1]);
          if (d.offers || d.name || d['@type'] === 'Product') {
            console.log('Product LD+JSON:', JSON.stringify(d, null, 2).substring(0, 1000));
          }
        } catch(e) {}
      });
    }
  } catch (e) {
    console.log('Error in inspection:', e.message);
  }

  console.log('\n--- API CHECKS ---');
  const urls = [
    'https://shop.atleticodemadrid.com/s/Atletico-Site/dw/shop/v21_3/product_search?q=*&cgid=kits&count=100',
    'https://shop.atleticodemadrid.com/s/Atletico-Madrid-EN/dw/shop/v22_10/product_search?q=kit&count=100',
  ];
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' } });
      const text = await r.text();
      console.log(`URL: ${url.substring(0, 60)}... Status: ${r.status}`);
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (e) {
      console.log(`Error fetching ${url}: ${e.message}`);
    }
  }
}
inspect();
