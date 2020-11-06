class JobCompanies {
  constructor() {
    this.companies = [];
    this.keyword = null;
  }

  async scrape(page, keyword) {
    this.keyword = keyword;

    const url = this.createUrl(keyword, 1);
    await page.goto(url);

    const companyHandles = await page.$$('div.content.company');

    this.companies = [];

    for await (const companyHandle of companyHandles) {
      try {
        console.log(await this.evaluateInterText(companyHandle));

      } catch(err) {
        console.error(err);
      }

      //this.companies.push();
    }

    return this.companies;
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
