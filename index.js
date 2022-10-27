require('dotenv').config();
const { chromium } = require('playwright');


function getDay() {
    const date = new Date();
    return date.getDate();
}

function getYearMonth() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`;
}

(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();

  const page = await context.newPage();

  await page.goto('https://cobasam.personio.de/login/index');

  await page.getByPlaceholder('Correo electrónico').click();

  await page.getByPlaceholder('Correo electrónico').fill(process.env.EMAIL);
  console.log(`Email filled: ${process.env.EMAIL}`);

  await page.getByPlaceholder('Contraseña').click();

  await page.getByPlaceholder('Contraseña').fill(process.env.PASSWORD);
  console.log('Password filled');

  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.waitForURL('https://cobasam.personio.de/');
  console.log('Logged in');

  await page.locator('[data-test-id="expand-collapse-button"]').click();

  await page.locator('[data-test-id="navsidebar-my_profile"]').click();
  await page.waitForURL(`https://cobasam.personio.de/staff/details/${process.env.EMPLOYEE_ID}`);
  console.log('Profile loaded');

  await page.locator('[data-test-id="employee-header-ui-employee-info-tab-employee-attendance"]').click();
  await page.waitForURL(`https://cobasam.personio.de/attendance/employee/${process.env.EMPLOYEE_ID}/${getYearMonth()}`);
  console.log('Attendance loaded');
  console.log(`Employee ID: ${process.env.EMPLOYEE_ID}`);

  const day = getDay();

  await page.getByRole('button', { name: `Hoy, ${day} ` }).click();
  await page.waitForTimeout(1000);
  console.log('Date selected');

  await page.locator('[data-test-id="timerange-start"]').first().fill(process.env.START_TIME);
  await page.waitForTimeout(1000);
  console.log(`Start time filled: ${process.env.START_TIME}`);

  await page.locator('[data-test-id="timerange-start"]').first().press('Tab');
  await page.waitForTimeout(1000);

  await page.locator('[data-test-id="work-entry"] [data-test-id="timerange-end"]').fill(process.env.END_TIME);
  await page.waitForTimeout(1000);
  console.log(`End time filled: ${process.env.END_TIME}`);

  await page.locator('[data-test-id="work-entry"] [data-test-id="timerange-end"]').press('Tab');
  await page.waitForTimeout(1000);

  await page.locator('[data-test-id="day-entry-expand-details"]').press('Tab');
  await page.waitForTimeout(1000);

  await page.locator('[data-test-id="break-entry"] [data-test-id="timerange-start"]').fill(process.env.BREAK_START);
  await page.waitForTimeout(1000);
  console.log(`Break start time filled: ${process.env.BREAK_START}`);

  await page.locator('[data-test-id="break-entry"] [data-test-id="timerange-start"]').press('Tab');
  await page.waitForTimeout(1000);

  await page.locator('[data-test-id="break-entry"] [data-test-id="timerange-end"]').fill(process.env.BREAK_END);
  await page.waitForTimeout(1000);
  console.log(`Break end time filled: ${process.env.BREAK_END}`);

  await page.locator('[data-test-id="break-entry"] [data-test-id="timerange-end"]').press('Tab');
  await page.waitForTimeout(1000);

  await page.locator('[data-test-id="day-entry-save"]').click();
  console.log('Day saved');  

  await page.locator('[data-test-id="navsidebar-dashboard"]').click();
  await page.waitForURL('https://cobasam.personio.de/my-desk');
  console.log('Ending script in 5 seconds...');
  await page.waitForTimeout(5000); // wait 10 seconds

  // ---------------------
  await context.close();
  await browser.close();
})();
