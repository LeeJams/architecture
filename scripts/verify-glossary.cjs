const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:4173';

(async () => {
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base + '/index.html?case=netflix#tech-abr');
    const toggle = page.locator('.topbar [data-glossary-toggle]');
    assert.equal(await toggle.getAttribute('aria-checked'), 'false');
    const original = await page.locator('#tech-abr').textContent();
    const code = await page.locator('#tech-https .note-example pre').textContent();
    await toggle.focus();
    await page.keyboard.press('Space');
    const term = page.locator('#tech-abr [data-glossary-term="bitrate"]').first();
    await term.waitFor();
    const url = page.url();
    await term.click();
    await page.waitForFunction(() => document.querySelector('#glossary-popover').matches(':popover-open'));
    assert.equal(await page.locator('#glossary-word').textContent(), '비트레이트');
    assert((await page.locator('#glossary-example').textContent()).includes('2.5 MB'));
    assert.equal(page.url(), url);
    // The scroll that brings an offscreen term into view must not dismiss the help.
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    assert(await page.locator('#glossary-popover').isVisible());
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.glossaryTerm), 'bitrate');
    assert.equal(await page.locator('a button.glossary-term, button button.glossary-term, pre .glossary-term, code .glossary-term, svg .glossary-term').count(), 0);
    await page.locator('#abr-throughput').fill('2');
    assert((await page.locator('#abr-result').textContent()).includes('10.00초'));
    await page.locator('#abr-result [data-glossary-term="buffer"]').waitFor();
    const sameLine = await page.locator('#abr-result [data-glossary-term="buffer"]').evaluate(button => {
      const word = button.getBoundingClientRect();
      const mark = button.querySelector('.glossary-mark').getBoundingClientRect();
      return mark.top < word.top + 12;
    });
    assert(sameLine, 'Calculator annotations must remain inline rather than inherit block-span layout.');
    await page.locator('#abr-throughput').fill('10');
    report.checks.push('Keyboard toggling enables bitrate help with correct bit/byte examples; it stays on the same page, survives positioning and restores focus.');

    await page.locator('#note-tab-https').click();
    await page.locator('#tech-https .glossary-term').first().waitFor();
    assert.equal(await page.locator('#tech-https .note-example pre').textContent(), code);
    await page.locator('#detail-badges [data-inspect-tech="https"]').click();
    const sheetToggle = page.locator('#technology-dialog [data-glossary-toggle]');
    assert.equal(await sheetToggle.getAttribute('aria-checked'), 'true');
    const sheetTerm = page.locator('#technology-sheet-content [data-glossary-term="range"]').first();
    await sheetTerm.waitFor();
    await sheetTerm.click();
    assert(await page.locator('#glossary-popover').isVisible());
    assert.equal(await page.locator('#glossary-popover').evaluate(element => element.closest('dialog').id), 'technology-dialog');
    await page.keyboard.press('Escape');
    assert(await page.locator('#technology-dialog').isVisible());
    assert(!(await page.locator('#glossary-popover').isVisible()));
    await sheetToggle.click();
    assert.equal(await toggle.getAttribute('aria-checked'), 'false');
    assert.equal(await page.locator('.glossary-fragment').count(), 0);
    assert.equal(await page.locator('#tech-abr').textContent(), original);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.documentElement.classList.contains('has-technology-dialog'));
    report.checks.push('Newly selected articles and native dialogs receive help; Escape closes only the help, switches stay synchronized, and disabling restores exact article text and code.');

    await toggle.click();
    await page.reload();
    assert.equal(await toggle.getAttribute('aria-checked'), 'true');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const example = page.locator('.glossary-guide [data-glossary-term="bitrate"]');
      await example.click();
      const bounds = await page.locator('#glossary-popover').boundingBox();
      assert(bounds.x >= 11 && bounds.x + bounds.width <= width - 11);
      assert(bounds.y >= 11 && bounds.y + bounds.height <= 833);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
      await page.locator('[data-close-glossary]').click();
    }
    await page.setViewportSize({ width: 320, height: 844 });
    await page.locator('#detail-badges [data-inspect-tech="https"]').click();
    await page.locator('#technology-sheet-content [data-glossary-term="range"]').first().click();
    const small = await page.locator('#glossary-popover').boundingBox();
    assert(small.x >= 11 && small.x + small.width <= 309);
    await page.keyboard.press('Escape');
    assert(await page.locator('#technology-dialog').isVisible());
    await page.keyboard.press('Escape');
    report.checks.push('The preference survives reload and help stays inside desktop/mobile viewports, including a 320px technology dialog.');

    const restricted = await browser.newContext({ reducedMotion: 'reduce' });
    await restricted.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new DOMException('Storage unavailable', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('Storage unavailable', 'SecurityError'); };
    });
    const noStorage = await restricted.newPage();
    noStorage.on('pageerror', error => report.errors.push(error.message));
    await noStorage.goto(base + '/index.html');
    await noStorage.locator('.topbar [data-glossary-toggle]').click();
    await noStorage.locator('.glossary-guide [data-glossary-term]').click();
    assert(await noStorage.locator('#glossary-popover').isVisible());
    await restricted.close();
    report.checks.push('The switch and explanation still work when browser storage is unavailable.');

    const offline = await browser.newContext({ reducedMotion: 'reduce' });
    const bundled = await offline.newPage();
    const requests = [];
    bundled.on('pageerror', error => report.errors.push(error.message));
    await bundled.route('**/*', route => {
      if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(root, 'openconnect-visual-study.html')) });
      requests.push(route.request().url());
      return route.abort();
    });
    await offline.setOffline(true);
    await bundled.goto(base + '/openconnect-visual-study.html?case=netflix');
    await bundled.locator('.topbar [data-glossary-toggle]').click();
    await bundled.locator('.glossary-guide [data-glossary-term]').click();
    assert((await bundled.locator('#glossary-example').textContent()).includes('2.5 MB'));
    assert(await bundled.locator('#glossary-popover').isVisible());
    assert.deepEqual(requests, []);
    report.checks.push('The standalone HTML explains terms offline without runtime requests.');
    await offline.close();
    assert.deepEqual(report.errors, []);
    fs.writeFileSync(path.join(root, 'reports/glossary-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
