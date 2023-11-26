import { chromium } from "playwright";
import * as fs from 'fs';
import * as path from 'path'

export const getArnDetails = async (cityName) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const name = `${cityName}`.toUpperCase()
    console.log('cityname:::', name)

    const visitUrl = 'https://www.amfiindia.com/investor-corner/online-center/locate-mf-distributor.aspx';
    await page.goto(visitUrl);
    const element = page.locator('#divCity').getByRole('textbox');
 
    await element.fill(name)
    await page.getByRole('banner').click()
    await page.getByRole('button', { name: 'Search' }).click().then(async () => {
      await page.waitForSelector('#pnlArn');
    });

    const table = page.locator('.table-content');
    const rows = await table.locator('tr').all();
    const len = rows.length;
    console.log(len);
    const writeStream = fs.createWriteStream(`${name}.json`, 'utf8');
    writeStream.write('[');

    const keyCells = await rows[0].locator('td').all();

    const extractCellContents = async (row) => {
      const valueCells = await row.locator('td').all();
      const rowData = {};

      await Promise.all(keyCells.map(async (keyCell, i) => {
        const key = await keyCell.textContent();
        const value = await valueCells[i].textContent();
        rowData[key] = value;
      }));

      return rowData;
    };

    for (let j = 1; j < len; j++) {
      const rowData = await extractCellContents(rows[j]);
      const jsonData = JSON.stringify(rowData, null, 2);

      writeStream.write(jsonData);
      writeStream.write(',');
    }
    writeStream.write('{}')
    writeStream.write(']');
    writeStream.end();

    writeStream.on('finish', () => {
      console.log('Write stream finished');
    });

    writeStream.on('error', (error) => {
      // Handle errors
      console.error('Error:', error);
    });
    await browser.close()
    return path.resolve(`${name}.json`)
  } catch (error) {
    throw error
  }
}
