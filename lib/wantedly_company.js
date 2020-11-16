class WantedlyCompanyList {
  constructor() {
    this.companies = [];
    this.keyword = null;
  }

  async scrape(page, keyword, pageNum) {
    this.companies = [];
    this.keyword = keyword;

    pageNum = pageNum || 1;

    const url = this.createUrl(keyword, pageNum);

    await page.goto(url);

    const companyHandles = await page.$$('div.content.company');

    for await (const handle of companyHandles) {
      try {
        const company = new Company();
        await company.parseCompanyHandler(handle);

        this.companies.push(company);

      } catch(err) {
        console.error(err);
      }
    }

    return this.companies;
  }

  createUrl(keyword, pageNum) {
    pageNum = pageNum || 1;
    return `https://www.wantedly.com/search?t=companies&page=${pageNum}&q=${keyword}`
  }
}


class Company {
  constructor() {
    this.title = null;
    this.status = null;
    this.siteUrl = null;
    this.text = null;
    this.companyUrl = null;
  }

  async parseCompanyHandler(handle) {
    //this.text = await this.evaluateInterText(handle);// TODO

    const titleHandle = await handle.$('.title');
    if (titleHandle) {
      this.title = await this.evaluateInterText(titleHandle);
      this.status = '';

      const status = '募集中';

      if (this.title.indexOf(status) > -1) {
        this.title = this.title.replace(status, '');
        this.status = status;
      }
    }

    const urlHandle = await handle.$('.url');
    if (urlHandle) {
      this.siteUrl = await this.evaluateInterText(urlHandle);
    }

    const originHandle = await handle.$('.origin');
    if (originHandle) {
      this.text = await this.evaluateInterText(originHandle);
    }

    const parentHandle = (await handle.$x('..'))[0];
    if (parentHandle) {
      this.companyUrl = await this.evaluateHref(parentHandle);
    }
  }

  async evaluateInterText(handle) {
    return handle.evaluate(node => node.innerText);
  }

  async evaluateHref(handle) {
    return handle.evaluate(node => node.getAttribute('href'));
  }
}



module.exports = {
  WantedlyCompanyList
};
