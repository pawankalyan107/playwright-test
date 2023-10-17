const { chromium } = require('playwright');

const getArnDetails = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const element = page.locator('#txtARN');
  const visitUrl = 'https://www.amfiindia.com/investor-corner/online-center/locate-mf-distributor.aspx';

  await page.goto(visitUrl);
  await element.fill('10811');
  await page.getByRole('button', { name: 'Search' }).click().then(async () => {
    await page.waitForSelector('#pnlArn');
  });
  const dataObject = {};
  const table = page.locator('.table-content');
  const rows = await table.locator('tr').all();
  const keyCells = await rows[0].locator('td').all();
  const valueCells = await rows[1].locator('td').all();

  for (let i = 0; i < keyCells.length; i++) {
    const key = await keyCells[i].textContent();
    const value = await valueCells[i].textContent();
    dataObject[key] = value;
  }
  await browser.close()
  return dataObject
}

getArnDetails().then((res) => console.log(res))



module.exports = getArnDetails