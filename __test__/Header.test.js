import puppeteer from 'puppeteer';
import userFactory from './factories/userFactory';
import sessionFactory from './factories/sessionFactory';
import CustomPage from './helpers/CustomPage';

let page;

const LOCALHOST_URL = 'localhost:3000';

beforeEach(async () => {
  // browser = await puppeteer.launch({
  // headless: false,
  // });
  // page = await browser.newPage();
  page = await CustomPage.build();
  await page.goto(LOCALHOST_URL);
});

afterEach(async () => {
  page.close();
});

it('puppeteer opens browser and page', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

it('click login redirect user to accouts.google page', async () => {
  await page.click('.right a');
  const URL = await page.url();
  expect(URL).toContain('accounts.google.com');
});

it('Set cookie and refresh render "Logout"', async () => {
  const user = await userFactory();
  const { session, sessionSig } = sessionFactory(user);

  await page.setCookie({ name: 'session', value: session });
  await page.setCookie({ name: 'session.sig', value: sessionSig });

  // Refresh to get the effect of setting cookie
  await page.goto(LOCALHOST_URL);

  // Need for element to be render
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);

  expect(text).toEqual('Logout');
});
