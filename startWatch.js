require('dotenv').config();
const { userName, password, workMode } = require('./constants.js')
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.relojlaboral.com/login.php');
  console.log('Page loaded');
  await page.getByPlaceholder('Introduzca su usuario').click();
  await page.getByPlaceholder('Introduzca su usuario').fill(`${userName}`);
  console.log(`User ${userName} filled`);
  await page.getByPlaceholder('Introduzca su usuario').press('Tab');
  await page.getByPlaceholder('Introduzca su contraseña').click();
  await page.getByPlaceholder('Introduzca su contraseña').fill(`${password}`);
  console.log('Password filled');
  await page.getByRole('button', { name: 'Entrar' }).click();
  console.log('Login clicked');
  await page.waitForTimeout(1000);
  await page.waitForURL(`https://scgi.duocom.es/cgi-bin/oficinaweb/reloj_laboral?principal=${userName}&entry=0`);
  await page.locator('select[name="proyecto"]').selectOption(`${workMode}`);
  console.log(`Work mode ${workMode} selected`);
  await page.getByText('EMPEZAR TRABAJO').click();
  console.log('Start work clicked')
  await page.waitForTimeout(1000);
  // ---------------------
  await context.close();
  await browser.close();
})();