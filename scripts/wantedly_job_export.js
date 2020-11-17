/*
 * Usage:
 *    $ node scripts/wantedly_job_export.js <msec interval> <First page num> <Last page num>
 */
const puppeteer = require('puppeteer');

const { WantedlyJobList, WantedlyJobWriter } = require('../lib/wantedly_job');
const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const keyword = '機械学習';
      const writer = new WantedlyJobWriter('wantedly_jobs.csv');

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

        const jobList = new WantedlyJobList();
        await jobList.scrape(page, keyword, pageNum);

        await writer.append(jobList.jobs);

        console.log(jobList.jobs);
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
