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
    return `${this.baseUrl}&page=${pageNum}`
  }
}


const evaluateInterText = async (handle) => {
  return handle.evaluate(node => node.innerText);
};

const evaluateHref = async (handle) => {
  return handle.evaluate(node => node.getAttribute('href'));
};



module.exports = {
  GreenJobList,
};
