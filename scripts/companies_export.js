const puppeteer = require('puppeteer');

const { JobCompanies } = require('../lib/company');


const scraping = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  const keyword = '機械学習';
  const jobCompanies = new JobCompanies();
  const companies = await jobCompanies.scrape(page, keyword, 1, 2);

  await browser.close();

  return companies;
};


if (require.main === module) {
  (async () => {

    try {
      const companies = await scraping();
      console.log(JSON.stringify(companies, null, 2));

      // TODO: Export

    } catch(err) {
      console.error(err);
    }

  })();
}
