import puppeteer from 'puppeteer';
import userFactory from '../factories/userFactory';
import sessionFactory from '../factories/sessionFactory';


const LOCALHOST_URL = 'localhost:3000';

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

  async login() {
    const user = await userFactory();
    const { session, sessionSig } = sessionFactory(user);
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sessionSig });
    // Refresh to get the effect of setting cookie
    await this.page.goto(LOCALHOST_URL);
    // Need for element to be render
    await this.page.waitFor('a[href="/auth/logout"]');
  }
}

export default CustomPage;
