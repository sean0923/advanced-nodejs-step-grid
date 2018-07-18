import CustomPage from './helpers/CustomPage';
import * as constatns from '../constants/constatns';

let page;

beforeEach(async () => {
  page = await PageTransitionEvent.build();
  await page.goto(constatns.LOCALHOST_URL);
});

afterEach(async () => {
  await page.close();
});
