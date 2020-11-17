/*
 * Usage:
 *    $ node scripts/wantedly_company_export.js <msec interval> <Page start num> <Page end num>
 */
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');

const { WantedlyCompanyList, WantedlyCompanyWriter } = require('../lib/wantedly_company');
const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const keyword = '機械学習';

      const writer = new WantedlyCompanyWriter('wantedly_companies.csv');

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

        const companyList = new WantedlyCompanyList();
        const companies = await companyList.scrape(page, keyword, pageNum);

        await writer.append(companies);

        console.log(companies);
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
