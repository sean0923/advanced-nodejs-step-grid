import CustomPage from './helpers/CustomPage';
import faker from 'faker';
import * as constatns from '../constants/constants';

let page;

beforeEach(async () => {
  page = await CustomPage.build();
  await page.goto(constatns.LOCALHOST_URL);
});

afterEach(async () => {
  await page.close();
});

describe('When logged in then create-blog-post-btn is clicked', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('Can see blog create form', async () => {
    const text = await page.getContentOf('label');
    expect(text).toEqual('Blog Title');
  });

  describe('Then user click next btn with invalid input', async () => {
    test('Show error messages', async () => {
      await page.click('[data-test="form-next-button"]');
      const errMssg = await page.getContentOf('.red-text');
      expect(errMssg).toEqual('You must provide a value');
    });
  });

  describe('User click next btn with valid input', async () => {
    test('Render card with correct title after save blog btn is clicked', async () => {
      const userTitleInput = 'some title';

      await page.type('.title input', userTitleInput);
      await page.type('.content input', 'some content');
      await page.click('[data-test="form-next-button"]');

      await page.waitFor('button.green');

      // click confirm btn
      page.click('.green');

      await page.waitFor('.card-content .card-title');
      const text = await page.getContentOf('.card-content .card-title');
      expect(text).toEqual(userTitleInput);
    });
  });
});

describe('When user is not loggedin', async () => {
  test('Show Login with Google anchor tag', async () => {
    const text = await page.getContentOf('a[href="/auth/google"');
    expect(text).toEqual('Login With Google');
  });

  const httpReqs = [
    {
      path: 'api/blogs',
      method: 'get',
    },
    {
      path: 'api/blogs',
      method: 'post',
      body: { title: 'My Title aa', content: 'My Content' },
    },
  ];

  test('return errors when http reqs invoked without login', async () => {
    const targetResult = { error: 'You must log in!' };
    const results = await page.execHttpReqs(httpReqs);
    results.forEach(result => {
      expect(result).toEqual(targetResult);
    });
  });
});
