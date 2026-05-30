import * as cheerio from 'cheerio';

async function main() {
  const BASE_URL = 'https://www.tiendapincha.com';
  const res = await fetch(BASE_URL + '/camisetas', {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
  });
  console.log('HTTP status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  const $ = cheerio.load(html);
  const elems = $('[data-product-id]');
  console.log('Found [data-product-id]:', elems.length);
  
  elems.first().each((_, el) => {
    const $el = $(el);
    const id = $el.attr('data-product-id');
    const name = $el.find('[data-store="product-item-name-' + id + '"]').text().trim();
    const priceAttr = $el.find('[data-product-price]').attr('data-product-price');
    const href = $el.find('a').first().attr('href');
    console.log({ id, name: name || '(empty)', price: priceAttr, href });
  });
}
main().catch(console.error);
