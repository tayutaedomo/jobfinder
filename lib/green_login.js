class GreenLogin {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async login(page) {
    const url = this.createUrl();

    await page.goto(url);

    await page.click('#user_mail');
    await page.keyboard.type(this.email);

    await page.click('#user_password');
    await page.keyboard.type(this.password);

    await page.click('input[name=commit]');
    await page.waitForTimeout(2000);
    //await page.screenshot({path: 'logged-in.png', fullPage: true});

    return true;
  }

  createUrl() {
    return `https://www.green-japan.com/login`
  }
}


class GreenSearch {
  constructor(url) {
    this.url = url;
  }

  async scraping(page, pageCount) {
    this.jobs = [];

    await page.goto(this.url);
    console.log('After goto:', this.url);
    await page.waitForTimeout(3000);

    for (let i = 1; i <= pageCount; i++) {
      await this.scrollToLastCard(page);
      console.log('After scrollIntoView:', i);
      await page.waitForTimeout(1000);
    }

    //await page.screenshot({path: 'search_result.png', fullPage: true});

    const jobHandles = await page.$$('.mdl-card--job-card');

    for await (const handle of jobHandles) {
      try {
        const job = new Job();
        await job.parse(handle);

        this.jobs.push(job);

      } catch(err) {
        console.error(err);
        return false;
      }
    }
    console.log(this.jobs);

    return true;
  }

  async scrollToLastCard(page) {
    await page.evaluate(async () => {
      var last = document.querySelector('.mdl-card--job-card:last-child');
      last.scrollIntoView(false);
    });
  }
}


class Job {
  constructor() {
    this.title = null;
    this.url = null;
    this.company = null;
  }

  async parse(handle) {
    const titleHandle = await handle.$('.mdl-card__title-text');
    if (titleHandle) {
      this.title = await evaluateInterText(titleHandle);
      if (this.title) this.title = this.title.replace('open_in_new', '');
    }

    const linkHandle = await handle.$('a');
    if (linkHandle) {
      this.url = await evaluateHref(linkHandle);
      if (this.url) this.url = 'https://www.green-japan.com' + this.url;
    }

    const companyHandle = await handle.$('.job-card__company-name');
    if (companyHandle) {
      this.company = await evaluateInterText(companyHandle);
      if (this.company) this.company = this.company.replace('open_in_new', '');
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
  GreenLogin,
  GreenSearch,
};
