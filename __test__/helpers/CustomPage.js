import puppeteer from 'puppeteer';

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, prop) {
        return customPage[prop] || page[prop] || browser[prop];
      },
    });
  }
}

export default CustomPage;
