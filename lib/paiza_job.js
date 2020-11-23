const path = require('path');
const fs = require('fs').promises;


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
        const job = new Job();
        await job.parse(handle);

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


class Job {
  constructor() {
    this.tag = null;
    this.update = null;
    this.title = null;
    this.content = null;

    this.company = null;
  }

  async parse(handle) {
    await this.parseCompany(handle);

    const iconHandle = await handle.$('.c-job_offer-box__header__right_area .a-heading-primary-small');
    if (iconHandle) {
      this.tag = await evaluateInterText(iconHandle);
    }

    // const updateHandle = await handle.$('.update');
    // if (updateHandle) {
    //   this.update = await evaluateInterText(updateHandle);
    // }

    const titleHandle = await handle.$('.c-job_offer-box__header__title');
    if (titleHandle) {
      this.title = await evaluateInterText(titleHandle);
      this.title = this.title.replace(/\n/g, ' ');
    }

    const contentHandle = await handle.$('.c-job_offer-summary dd');
    if (contentHandle) {
      this.content = await evaluateInterText(contentHandle);
    }
  }

  async parseCompany(handle) {
    this.company = new Company();
    await this.company.parse(handle);
  }
}


class Company {
  constructor() {
    this.name = null;
    this.url = null;
  }

  async parse(handle) {
    const nameHandle = await handle.$('.c-job_offer-recruiter__name');
    if (nameHandle) {
      this.name = await evaluateInterText(nameHandle);

      const linkHandle = await nameHandle.$('a');
      if (linkHandle) {
        this.url = await evaluateHref(linkHandle);
      }
    }
  }
}


const evaluateInterText = async (handle) => {
  return handle.evaluate(node => node.innerText);
};

const evaluateHref = async (handle) => {
  return handle.evaluate(node => node.getAttribute('href'));
};


class PaizaJobWriter {
  constructor(filename) {
    this.destPath = path.join(__dirname, '..', 'data', filename);
    this.count = 1
  }

  async append(jobs) {
    for await (const job of jobs) {
      const row = [
        `"${this.count}"`,
        `"${job.company.name}"`,
        `"${job.tag}"`,
        `"${job.update}"`,
        `"${job.title}"`,
        `"${job.content}"`,
      ].join(',') + '\n';

      await fs.appendFile(this.destPath, row);

      this.count += 1;
    }
  };
}



module.exports = {
  PaizaJobList,
  PaizaJobWriter,
};
