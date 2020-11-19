const puppeteer = require('puppeteer');

const { GreenJobList, GreenJobWriter } = require('../lib/green_job');
const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const url = 'https://www.green-japan.com/search_key/01?key=6mfhgfcyuwglczadm660&keyword=機械学習';
      const writer = new GreenJobWriter('green_jobs.csv');

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

        const jobList = new GreenJobList(url);
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
