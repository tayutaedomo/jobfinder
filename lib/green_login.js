class GreenLogin {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async login(page) {
    this.jobs = [];

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



module.exports = {
  GreenLogin,
};
