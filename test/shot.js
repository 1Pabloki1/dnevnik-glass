// Прогон редизайна по эмулированным экранам и темам.
// Использует СИСТЕМНЫЙ Chrome в headless-режиме со свежим профилем —
// сессия пользователя никак не затрагивается.
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEMO = 'file://' + path.resolve(__dirname, 'demo.html');
const OUT = path.resolve(__dirname, '../screenshots');
const USERSCRIPT = fs.readFileSync(path.resolve(__dirname, '../dnevnik-glass.user.js'), 'utf8');
const THEMES = ['purple', 'midnight', 'emerald', 'sunset', 'violet', 'mono'];
const VIEWPORTS = {
  desktop: { width: 1680, height: 1000 },
  ipad: { width: 820, height: 1180 },
  iphone: { width: 390, height: 844 },
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  const errors = [];

  // ---- 1. демо: все темы на десктопе ----
  for (const theme of THEMES) {
    const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
    page.on('pageerror', e => errors.push(`demo ${theme}: ${e.message}`));
    await page.goto(DEMO);
    await page.evaluate(t => { localStorage.setItem('dg_theme', t); }, theme);
    await page.reload();
    await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector('#dg-fab')?.click()); // панель открыта на скрине
    await page.waitForTimeout(200);
    await page.evaluate(() => document.querySelector('#journal').scrollIntoView());
    await page.screenshot({ path: `${OUT}/demo-${theme}-desktop.png` });
    await page.close();
    console.log('✓ demo', theme);
  }

  // ---- 2. демо: адаптив (iphone + ipad), тема по умолчанию ----
  for (const [name, vp] of Object.entries(VIEWPORTS)) {
    if (name === 'desktop') continue;
    const page = await browser.newPage({ viewport: vp, isMobile: name === 'iphone', hasTouch: name === 'iphone' });
    page.on('pageerror', e => errors.push(`demo ${name}: ${e.message}`));
    await page.goto(DEMO);
    await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector('#journal').scrollIntoView());
    await page.screenshot({ path: `${OUT}/demo-purple-${name}.png` });
    await page.close();
    console.log('✓ demo', name);
  }

  // ---- 3. реальный портал /elk (без логина, публичная страница) ----
  for (const [name, vp] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport: vp });
    page.on('pageerror', e => errors.push(`elk ${name}: ${e.message}`));
    await page.addInitScript(USERSCRIPT);
    await page.goto('https://edu.gounn.ru/elk', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${OUT}/elk-${name}.png`, fullPage: false });
    await page.close();
    console.log('✓ elk', name);
  }

  await browser.close();

  if (errors.length) {
    console.error('\nОШИБКИ СКРИПТА:');
    errors.forEach(e => console.error('  -', e));
    process.exit(1);
  }
  console.log('\nВсе скриншоты в', OUT);
})();
