import CustomPage from './helpers/CustomPage';
import * as constants from '../constants/constants';
// let browser;
let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto(constants.LOCALHOST_URL);
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
  await page.login();

  // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  const text = await page.getContentOf('[data-test="a-tag-logout"]');

  expect(text).toEqual('Logout');
});
