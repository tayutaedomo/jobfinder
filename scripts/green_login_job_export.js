const puppeteer = require('puppeteer');

const { GreenLogin } = require('../lib/green_login');
//const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {

  (async () => {

      const greenLogin = new GreenLogin(process.argv[2], process.argv[3]);
      //const sleeper = new PromiseSleeper(process.argv[4]);
      //const url = process.argv[5];

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    try {
      const page = await browser.newPage();

      await greenLogin.login(page);

      await browser.close();

    } catch(err) {
      console.error(err);

      await browser.close();
    }

  })();

}
