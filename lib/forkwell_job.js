const path = require('path');
const fs = require('fs').promises;

class ForkwellJobList {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.jobs = [];
  }

  async scrape(page, pageNum) {
    this.jobs = [];

    pageNum = pageNum || 1;

    const url = this.createUrl(pageNum);

    await page.goto(url);

    const cardHandles = await page.$$('.card');

    for await (const handle of cardHandles) {
      try {
        const job = new Job();
        await job.parse(handle);

        if (job.title) {
          this.jobs.push(job);
        }

      } catch(err) {
        console.error(err);
        return false;
      }
    }

    return true;
  }

  createUrl(pageNum) {
    return `${this.baseUrl}&page=${pageNum}`
  }
}


class Job {
  constructor() {
    this.title = null;
    this.url = null;
    this.company = null;
  }

  async parse(handle) {
    const titleHandle = await handle.$('.h4');
    if (titleHandle) {
      this.title = await evaluateInterText(titleHandle);

      const linkHandle = await titleHandle.$('a');
      if (linkHandle) {
        this.url = await evaluateHref(linkHandle);
        this.url = `https://jobs.forkwell.com${this.url}`;
      }
    }

    if (! this.title) return;

    const companyHandle = await handle.$('.avatar__detail');
    if (companyHandle) {
      this.company = await evaluateInterText(companyHandle);
      this.company = this.company.replace('株式会社', '').trim();
    }
  }
}


const evaluateInterText = async (handle) => {
  return handle.evaluate(node => node.innerText);
};

const evaluateHref = async (handle) => {
  return handle.evaluate(node => node.getAttribute('href'));
};





module.exports = {
  ForkwellJobList,
};
