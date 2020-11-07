class JobCompanies {
  constructor() {
    this.companies = [];
    this.keyword = null;
  }

  async scrape(page, keyword, pageStart, pageEnd) {
    this.keyword = keyword;

    pageStart = pageStart || 1;
    pageEnd = pageEnd || 1;

    const range = (start, end) => [...Array(end + 1).keys()].slice(start);

    for await (const pageNum of range(pageStart, pageEnd)) {
      const companies = await this.scrapeWithPage(page, keyword, pageNum);
      this.companies = this.companies.concat(companies);
    }

    return this.companies;
  }

  async scrapeWithPage(page, keyword, pageNum) {
    const companies = [];

    const url = this.createUrl(keyword, pageNum);
    await page.goto(url);

    const companyHandles = await page.$$('div.content.company');

    this.companies = [];

    for await (const companyHandle of companyHandles) {
      let company = null;

      try {
        company = await this.evaluateInterText(companyHandle);

      } catch(err) {
        console.error(err);
      }

      if (company) {
        companies.push(company);
      }
    }

    return companies;
  }

  createUrl(keyword, pageNum) {
    pageNum = pageNum || 1;
    return `https://www.wantedly.com/search?t=companies&page=${pageNum}&q=${keyword}`
  }

  async evaluateInterText(handle) {
    return handle.evaluate(node => node.innerText)
  }
}



module.exports = {
  JobCompanies
};
