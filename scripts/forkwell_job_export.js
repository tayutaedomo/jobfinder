const puppeteer = require('puppeteer');

const { ForkwellJobList } = require('../lib/forkwell_job');
const { PromiseSleeper } = require('../lib/sleeper');


if (require.main === module) {
  (async () => {

    try {
      const range = (start, end) => [...Array(end + 1).keys()].slice(start);
      const sleeper = new PromiseSleeper(process.argv[2]);
      const url = 'https://jobs.forkwell.com/jobs/search?q[employment_types][]=&q[freeword]=機械学習+AI&q[job_tags][]=&q[professions][]=&q[selections][]=&q[sort]=job_popularity_popularity+desc&q[yearly_base_salaly_min_value]=&wovn_token=966g8t';

      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--window-size=1024,640'
        ],
        headless: true,
        defaultViewport: null,
      });
      const page = await browser.newPage();
      page.setExtraHTTPHeaders({'Accept-Language': 'ja'});

      const start = parseInt(process.argv[3] || 1);
      const end = parseInt(process.argv[4] || 1);

      for await (const pageNum of range(start, end)) {
        await sleeper.sleep();

        const jobList = new ForkwellJobList(url);
        await jobList.scrape(page, pageNum);

        console.log(jobList.jobs);
      }

      await browser.close();

    } catch(err) {
      console.error(err);
    }

  })();
}
