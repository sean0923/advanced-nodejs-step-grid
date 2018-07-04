import puppeteer from 'puppeteer';

it('1 + 2 = 3', () => {
  expect(1 + 2).toEqual(3);
});

it('puppeteer opens browser and page', async () => {
  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage();
})

