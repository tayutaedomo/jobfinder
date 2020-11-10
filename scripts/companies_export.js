const path = require('path');
const fs = require('fs').promises;
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

const appendCompaniesToCsv = async (companies) => {
  const destPath = path.join(__dirname, '..', 'data', 'companies.csv');

  for await (const company of companies) {
    const row = [
      `"${company.title}"`,
      `"${company.status}"`,
      `"${company.siteUrl}"`,
      `"${company.text}"`,
    ].join(',') + '\n';

    await fs.appendFile(destPath, row);
  }
};


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

      const start = parseInt(process.argv[3] || 1);
      const end = parseInt(process.argv[4] || 1);

      for await (const pageNum of range(start, end)) {
        await sleeper.sleep();

        const jobCompanies = new JobCompanies();
        const companies = await jobCompanies.scrape(page, keyword, pageNum);

        await appendCompaniesToCsv(companies);

        console.log(companies);
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
