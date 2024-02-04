import { chromium } from "playwright";
import * as fs from 'fs';
import * as path from 'path'
import { defineConfig } from '@playwright/test';
import { error } from "console";

export default defineConfig({
  timeout: 500 * 60 * 1000,
});

const scrapeWebsite = async (cityName) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const name = `${cityName}`.toUpperCase()
    console.log('cityname:::', name)

    const visitUrl = 'https://www.amfiindia.com/investor-corner/online-center/locate-mf-distributor.aspx';
    await page.goto(visitUrl, { timeout: 60 * 1000 });
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
// const cityNames = ['MUMBAI']

export const getArnDetails = async (chunk) => {
  for (let i = 0; i < chunk.length; i += 3) {
    const citiesSubset = chunk.slice(i, i + 3);
    await Promise.all(
      citiesSubset.map(async (cityName) => {
        try {
          await scrapeWebsite(cityName)
          console.log(`scraping completed for this city name: ${cityName}`)
        } catch (error) {
          console.log(`Error while scraping website for ${cityName}: ${error.message}`)
        }
      })
    )
  }
  return console.log(`scraping completed for these city names: ${chunk}`)
}

