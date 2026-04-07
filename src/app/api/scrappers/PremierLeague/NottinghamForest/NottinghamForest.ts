import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeNottinghamForest = async () => {
  const urls = [
    'https://shop.nottinghamforest.co.uk/collections/home-kit',
    'https://shop.nottinghamforest.co.uk/collections/goalkeeper-kit',
    'https://shop.nottinghamforest.co.uk/collections/third-kit',
    'https://shop.nottinghamforest.co.uk/collections/away-kit',
  ];
};

export default scrapeNottinghamForest;
