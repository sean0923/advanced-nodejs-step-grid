import puppeteer from 'puppeteer';
import userFactory from '../factories/userFactory';
import sessionFactory from '../factories/sessionFactory';
import * as constants from '../../constants/constants';

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
    await this.page.goto(constants.LOCALHOST_URL_BLOG);
    // Need for element to be render
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  get(path) {
    const getReq = _path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(data => {
        return data.json();
      });
    };

    return this.page.evaluate(getReq, path);
  }

  post(path, body) {
    const postReq = (_path, _body) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_body),
      }).then(data => {
        return data.json();
      });
    };

    return this.page.evaluate(postReq, path, body);
  }

  execHttpReqs(actions) {
    return Promise.all(
      actions.map(({ path, method, body }) => {
        return this[method](path, body);
      })
    );
  }
}

export default CustomPage;
