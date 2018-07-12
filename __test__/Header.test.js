import puppeteer from 'puppeteer';
import * as keys from '../config/keys';
import { Buffer } from 'buffer';
import Keygrip from 'keygrip';
import userFactory from './factories/userFactory';
import sessionFactory from './factories/sessionFactory';

let browser, page;

const LOCALHOST_URL = 'localhost:3000';

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto(LOCALHOST_URL);
});

afterEach(async () => {
  browser.close();
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
