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

it.only('Render form page when + btn is clicked', async () => {
  await page.login();
  await page.click('a.btn-floating');
  const text = await page.getContentOf('label');
  // const text = await page.getContentOf(Wrapper);
  console.log('text: ', text);
});
