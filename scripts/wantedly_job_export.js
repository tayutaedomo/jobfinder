/*
 * Usage:
 *    $ node scripts/wantedly_jobs_export.js
 */
const puppeteer = require('puppeteer');

const { WantedlyJobList } = require('../lib/wantedly_job');


if (require.main === module) {
  (async () => {

    try {
      const keyword = '機械学習';

      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
      });

      const page = await browser.newPage();

      const jobList = new WantedlyJobList();
      const ret = await jobList.scrape(page, keyword);
      console.log(jobList.jobs, ret);
      console.log(ret);

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
