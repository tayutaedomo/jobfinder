const puppeteer = require('puppeteer');

const { JobCompanies } = require('../lib/company');


class PromiseSleeper {
  constructor(msec) {
    this.count = 0;
    this.msec = msec || 15 * 1000;
    this.setTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  }

  async sleep() {
    if (this.count == 0) {
      this.count++;

    } else {
      await this.setTimeout(this.msec);
      this.count++;
    }
  }
}


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const keyword = '機械学習';

      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });

      const page = await browser.newPage();

      for await (const pageNum of range(1, 2)) {
        await sleeper.sleep();

        const jobCompanies = new JobCompanies();
        const companies = await jobCompanies.scrape(page, keyword, pageNum);
        console.log(JSON.stringify(companies, null, 2));

        // TODO: Export
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
