const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:4173';

(async () => {
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const checks = [], errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '/?case=netflix#tech-abr');
    for (const [speed, seconds, playbackFraction, downloadFraction] of [['2', '10.00초', .4, 1], ['10', '2.00초', 1, .5], ['0.5', '40.00초', .1, 1]]) {
      await page.locator('#abr-throughput').fill(speed);
      assert((await page.locator('#abr-result').textContent()).includes(seconds));
      await page.waitForFunction(({ playbackFraction, downloadFraction }) => {
        const fraction = selector => {
          const element = document.querySelector(selector);
          return element.getBoundingClientRect().width / element.parentElement.getBoundingClientRect().width;
        };
        return Math.abs(fraction('.time-playback') - playbackFraction) < .01 && Math.abs(fraction('.time-download') - downloadFraction) < .01;
      }, { playbackFraction, downloadFraction });
    }
    checks.push('Animated bars compare the same four-second segment at fast, slow and very slow download rates using a common time scale.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#abr-throughput').fill('10');
    await page.waitForFunction(() => document.querySelector('.time-download').style.width === '50%');
    checks.push('The time comparison remains correct when reduced motion is enabled.');

    await page.locator('.section-nav a[href="#anatomy"]').click();
    await page.locator('.section-nav a[href="#technologies"]').click();
    assert.equal(await page.locator('#note-tab-abr').getAttribute('aria-selected'), 'true');
    checks.push('Section navigation preserves the selected technology and calculator context.');
    await page.locator('#note-tab-oca').click();
    await page.locator('#capacity-viewers').fill('20000');
    await page.locator('#capacity-utilization').fill('50');
    assert((await page.locator('#capacity-result').textContent()).includes('200 Gb/s'));
    await page.locator('#tech-oca [data-open-tech-sheet]').click();
    await page.keyboard.press('Escape');
    await page.locator('#note-tab-nginx').click();
    await page.locator('#note-tab-oca').click();
    assert.equal(await page.locator('#capacity-viewers').inputValue(), '20000');
    assert((await page.locator('#capacity-result').textContent()).includes('200 Gb/s'));
    checks.push('Calculator inputs survive topic changes and modal reading without losing the learning context.');

    for (let index = 0; index < 3; index++) {
      await page.locator('#tech-oca [data-open-tech-sheet]').focus();
      await page.keyboard.press('Enter');
      assert(await page.locator('#technology-dialog').isVisible());
      await page.keyboard.press('Escape');
      assert(!(await page.locator('#technology-dialog').isVisible()));
    }
    await page.locator('#reference-details').evaluate(element => { element.open = true; });
    for (let index = 0; index < 3; index++) {
      await page.locator('.reference-zoom').first().focus();
      await page.keyboard.press('Space');
      assert(await page.locator('#zoom-dialog').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.classList.contains('reference-zoom')), true);
    }
    checks.push('Both native dialogs can close and immediately reopen with the keyboard; focus and React state stay synchronized.');
    assert.deepEqual(errors, []);
    fs.mkdirSync(path.resolve(__dirname, '../reports'), { recursive: true });
    const report = { checks, errors };
    fs.writeFileSync(path.resolve(__dirname, '../reports/react-interactions-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
