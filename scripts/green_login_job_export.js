const puppeteer = require('puppeteer');

const { GreenLogin, GreenSearch, GreenJobWriter } = require('../lib/green_login');


if (require.main === module) {

  (async () => {

    const login = new GreenLogin(process.argv[2], process.argv[3]);
    const search = new GreenSearch(process.argv[4]);
    const pageCount = process.argv[5] || 1;
    const writer = new GreenJobWriter('green_login_jobs.csv');

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

      await login.login(page);
      console.log('Logged in.');

      await search.scraping(page, pageCount);
      await writer.append(search.jobs);

      await browser.close();

    } catch(err) {
      console.error(err);

      await browser.close();
    }

  })();

}
