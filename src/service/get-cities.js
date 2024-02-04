import { chromium } from "playwright";
import * as fs from 'fs';
import * as path from 'path'
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 500 * 60 * 1000,
});


// const browser = await chromium.launch();
// const page = await browser.newPage();
// // const name = `${cityName}`.toUpperCase()
// // console.log('cityname:::', name)

// const visitUrl = 'https://www.amfiindia.com/investor-corner/online-center/locate-mf-distributor.aspx';
// await page.goto(visitUrl, { timeout: 60 * 1000 });
// // const element = page.locator('#divCity').getByRole('textbox');
// const cities = await page.locator('#ddlCity').locator('option').allInnerTexts()
// console.log(cities)

