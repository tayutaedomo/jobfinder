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

  async scraping(page) {
    this.jobs = [];

    await page.goto(this.url);
    console.log('After goto:', this.url);
    await page.waitForTimeout(3000);

    const loop = 3;
    for (let i = 1; i <= loop; i++) {
      await this.scrollToLastCard(page);
      console.log('After scrollIntoView:', i);
      await page.waitForTimeout(1000);
    }

    await page.screenshot({path: 'search_result.png', fullPage: true});

    return true;
  }

  async scrollToLastCard(page) {
    await page.evaluate(async () => {
      var last = document.querySelector('.mdl-card--job-card:last-child');
      last.scrollIntoView(false);
    });
  }
}



module.exports = {
  GreenLogin,
  GreenSearch,
};
