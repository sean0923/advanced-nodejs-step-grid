import puppeteer from 'puppeteer';

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page, browser);

    return new Proxy(customPage, {
      get: function(target, prop) {
        // return customPage[prop] || browser[prop] || page[prop];
        return customPage[prop] || page[prop] || browser[prop];
      },
    });
  }

  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }

  close() {
    this.browser.close();
  }
}

export default CustomPage;
