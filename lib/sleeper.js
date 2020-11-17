class PromiseSleeper {
  constructor(msec) {
    this.count = 0;
    this.msec = msec || 15 * 1000;
    this.setTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  }

  async sleep() {
    if (this.count == 0) {
      this.count++;

    } else {
      await this.setTimeout(this.msec);
      this.count++;
    }
  }
}


module.exports = {
  PromiseSleeper
};
