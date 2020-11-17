const path = require('path');
const fs = require('fs').promises;


class WantedlyJobList {
  constructor() {
    this.jobs = [];
    this.keyword = null;
  }

  async scrape(page, keyword, pageNum) {
    this.jobs = [];
    this.keyword = keyword;

    pageNum = pageNum || 1;

    const url = this.createUrl(keyword, pageNum);

    await page.goto(url);

    const projectHandles = await page.$$('div.project-index-single-outer');

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

  createUrl(keyword, pageNum) {
    return `https://www.wantedly.com/projects?type=mixed&occupation_types[]=jp__engineering&hiring_types[]=mid_career&fields[]=jp__data_scientist&keywords[]=${keyword}&page=${pageNum}`
  }
}


class Job {
  constructor() {
    this.tag = null;
    this.entry = null;
    this.title = null;
    this.content = null;

    this.company = null;
  }

  async parse(handle) {
    await this.parseCompany(handle);

    const tagHandle = await handle.$('.project-tag');
    if (tagHandle) {
      this.tag = await evaluateInterText(tagHandle);
    }

    const entryHandle = await handle.$('.entry-count');
    if (entryHandle) {
      this.entry = await evaluateInterText(entryHandle);
    }

    const titleHandle = await handle.$('.project-title');
    if (titleHandle) {
      this.title = await evaluateInterText(titleHandle);
    }

    const contentHandle = await handle.$('.project-excerpt');
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
    const nameHandle = await handle.$('.company-name');
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
}

const evaluateHref = async (handle) => {
  return handle.evaluate(node => node.getAttribute('href'));
}


class WantedlyJobWriter {
  constructor(filename) {
    this.destPath = path.join(__dirname, '..', 'data', filename);
  }

  async append(jobs) {
    let count = 1;

    for await (const job of jobs) {
      const row = [
        `"${count}"`,
        `"${job.company.name}"`,
        `"${job.tag}"`,
        `"${job.entry}"`,
        `"${job.title}"`,
        `"${job.content}"`,
      ].join(',') + '\n';

      await fs.appendFile(this.destPath, row);

      count += 1;
    }
  };
}



module.exports = {
  WantedlyJobList,
  WantedlyJobWriter,
};
