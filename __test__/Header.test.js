import puppeteer from 'puppeteer';
import * as keys from '../config/keys';
import { Buffer } from 'buffer';
import Keygrip from 'keygrip';

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
  // browser.close();
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

it.only('insert session and session sig to header', async () => {
  const sessionObj = {
    passport: {
      user: keys.mLabUserId,
    },
  };

  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString('base64');

  expect(sessionStr).toEqual(keys.session);

  const keygrip = new Keygrip([keys.cookieKey]);
  const sessionSig = keygrip.sign('session=' + sessionStr);
  
  expect(sessionSig).toEqual(keys.sessionSig);

  await page.setCookie({ name: 'session', value: sessionStr });
  await page.setCookie({ name: 'session.sig', value: sessionSig})

  // Refresh to get the effect of setting cookie
  page.goto(LOCALHOST_URL); 
});
