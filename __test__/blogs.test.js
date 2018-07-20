import CustomPage from './helpers/CustomPage';
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
      await page.click('[data-test="form-submit-button"]');
      const errMssg = await page.getContentOf('.red-text');
      expect(errMssg).toEqual('You must provide a value');
    });
  });
});
