const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:8765';

(async () => {
  // The config shown to readers must be the exact fixture tested with real NGINX.
  const displayed = vm.runInNewContext(fs.readFileSync(path.join(root, 'technology-notes.js'), 'utf8') + '\ntechnologyNotes.find(note => note.key === "nginx").example.code');
  assert.equal(displayed.trim(), fs.readFileSync(path.join(root, 'examples/file-delivery/nginx.conf'), 'utf8').trim());
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], responsiveStates: 0, errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base + '/index.html?case=netflix#tech-https');
    await page.evaluate(() => document.fonts.ready);
    const article = page.locator('#tech-https');
    for (const [index, expected, range] of [[0, '206 Partial Content', 'bytes 0-1023/10000'], [1, '416 Range Not Satisfiable', 'bytes */10000'], [2, '200 OK', 'Content-Length: 10000']]) {
      await article.locator(`[data-technical-scenario="${index}"]`).click();
      const sample = await article.locator('[data-scenario-result] pre').textContent();
      assert(sample.includes(expected) && sample.includes(range));
      if (index === 2) assert(!sample.includes('Content-Range:'));
    }
    await article.locator('[data-depth-jump="diagnostics"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.closest('[data-depth-target]').dataset.depthTarget), 'diagnostics');
    report.checks.push('HTTP scenarios expose distinct 206, 416 and If-Range 200 responses; keyboard section jumps move focus.');

    await page.locator('#note-tab-abr').click();
    await page.locator('#abr-throughput').fill('2');
    for (const [initial, stall, next] of [['8', '2.00초', '4.00초'], ['0', '10.00초', '4.00초'], ['12', '0.00초', '6.00초']]) {
      await page.locator('#abr-buffer').fill(initial);
      const result = await page.locator('#abr-buffer-result').textContent();
      assert(result.includes('재버퍼링 ' + stall));
      assert(result.includes('완료 후 버퍼 ' + next));
    }
    await page.locator('#abr-buffer').fill('');
    assert((await page.locator('#abr-buffer-result').textContent()).includes('0~120'));
    assert(!/NaN|Infinity/.test(await page.locator('.abr-output').textContent()));
    report.checks.push('ABR computes stall and post-download buffer for empty, insufficient and sufficient buffers, rejecting empty input.');

    const keys = ['oca', 'aws', 'freebsd', 'nginx', 'https', 'fill', 'abr', 'steering'];
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const key of keys) {
        await page.locator(`[data-note-tab="${key}"]`).click();
        const reader = page.locator(`#tech-${key} [data-technical-depth]`);
        const originalHeading = await reader.locator('h4').first().textContent();
        // Open through the actual inspector to keep the normal reader context intact.
        await page.evaluate(key => openTechnologySheet(key), key);
        const sheet = page.locator('#technology-sheet-content [data-technical-depth]');
        assert.equal(await sheet.locator('h4').first().textContent(), originalHeading);
        assert.equal(await sheet.locator('[data-technical-scenario][aria-pressed="true"]').getAttribute('data-technical-scenario'), '0');
        const count = await sheet.locator('[data-technical-scenario]').count();
        for (let index = 0; index < count; index++) {
          await sheet.locator(`[data-technical-scenario="${index}"]`).click();
          assert.equal(await sheet.locator('.technical-path li').count(), 3);
          assert.equal(await sheet.locator('[data-technical-scenario][aria-pressed="true"]').count(), 1);
          const issues = await sheet.evaluate(element => [...element.querySelectorAll('h4,h5,p,button,li,dt,dd')].filter(item => !item.closest('pre') && item.scrollWidth > item.clientWidth + 2).map(item => item.textContent.slice(0, 80)));
          assert.deepEqual(issues, [], `${key} at ${width}px`);
          report.responsiveStates++;
        }
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
        await page.keyboard.press('Escape');
        await page.waitForFunction(() => !document.documentElement.classList.contains('has-technology-dialog'));
      }
    }
    report.checks.push('All eight reader/modal pairs share the same principles; every scenario fits 320, 768 and 1440px and resets on reopening.');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('[data-alternative-category="all"]').click();
    for (const id of ['caddy', 'apache', 'cloudfront', 'fastly', 'cloudflare', 'ubuntu', 'debian', 'gcp', 'azure']) {
      await page.locator(`[data-open-alternative="${id}"]`).click();
      const contract = page.locator(`[data-replacement-contract="${id}"]`);
      assert(await contract.isVisible());
      assert.equal(await contract.locator('ol li').count(), 3);
      if (id === 'caddy') {
        assert((await contract.locator('code').textContent()).includes('root * ./data'));
        assert((await contract.textContent()).includes('handle_path'));
      }
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.documentElement.classList.contains('has-technology-dialog'));
    }
    report.checks.push('Each of nine replacement details explains an explicit migration contract; the Caddy example preserves the /media URI.');
    assert.deepEqual(report.errors, []);
    fs.writeFileSync(path.join(root, 'reports/depth-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
