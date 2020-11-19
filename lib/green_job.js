const path = require('path');
const fs = require('fs').promises;


class GreenJobList {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.jobs = [];
  }

  async scrape(page, pageNum) {
    this.jobs = [];

    pageNum = pageNum || 1;

    const url = this.createUrl(pageNum);

    await page.goto(url);

    const projectHandles = await page.$$('.card-info__wrapper');

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
    return `${this.baseUrl}&page=${pageNum}`
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

    const iconHandle = await handle.$('.job-offer-icon');
    if (iconHandle) {
      this.tag = await evaluateInterText(iconHandle);
    }

    const updateHandle = await handle.$('.update');
    if (updateHandle) {
      this.update = await evaluateInterText(updateHandle);
    }

    const titleHandle = await handle.$('.card-info__heading-area__title');
    if (titleHandle) {
      this.title = await evaluateInterText(titleHandle);
    }

    const contentHandle = await handle.$('.card-info__detail-area__text');
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
    const nameHandle = await handle.$('.card-info__detail-area__box__title');
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


class GreenJobWriter {
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
  GreenJobList,
  GreenJobWriter,
};
