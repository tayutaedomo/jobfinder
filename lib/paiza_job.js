class PaizaJobList {
  constructor() {
    this.jobs = [];
  }

  async scrape(page, pageNum) {
    this.jobs = [];

    pageNum = pageNum || 1;

    const url = this.createUrl(pageNum);

    await page.goto(url);

    const projectHandles = await page.$$('.c-job_offer-box');

    for await (const handle of projectHandles) {
      try {
        const job = await evaluateInterText(handle);
        this.jobs.push(job);

      } catch(err) {
        console.error(err);
        return false;
      }
    }

    return true;
  }

  createUrl(pageNum) {
    return `https://paiza.jp/career/job_offers/topics/ai?page=${pageNum}`
  }
}


const evaluateInterText = async (handle) => {
  return handle.evaluate(node => node.innerText);
};

const evaluateHref = async (handle) => {
  return handle.evaluate(node => node.getAttribute('href'));
};



module.exports = {
  PaizaJobList
};
