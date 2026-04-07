import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

const scrapeTottenham = async () => {
  const url = 'https://shop.tottenhamhotspur.com/all-spurs-kit';
};

export default scrapeTottenham;
