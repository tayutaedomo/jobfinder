const puppeteer = require('puppeteer');

const { GreenLogin, GreenSearch } = require('../lib/green_login');


if (require.main === module) {

  (async () => {

    const greenLogin = new GreenLogin(process.argv[2], process.argv[3]);
    const greenSearch = new GreenSearch(process.argv[4]);

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1024,640'
      ],
      headless: true,
      defaultViewport: null,
    });

    try {
      const page = await browser.newPage();

      await greenLogin.login(page);
      console.log('Logged in.');

      await greenSearch.scraping(page);

      await browser.close();

    } catch(err) {
      console.error(err);

      await browser.close();
    }

  })();

}
