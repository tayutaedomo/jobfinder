const puppeteer = require('puppeteer');

const { PaizaJobList, PaizaJobWriter } = require('../lib/paiza_job');
const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const writer = new PaizaJobWriter('paiza_jobs.csv');

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

        const jobList = new PaizaJobList();
        await jobList.scrape(page, pageNum);

        await writer.append(jobList.jobs);

        console.log(jobList.jobs);
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
