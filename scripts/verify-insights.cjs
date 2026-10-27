const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:8765';

(async () => {
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base + '/index.html?case=netflix');
    for (const key of ['nginx', 'freebsd']) {
      await page.locator(`[data-diagram-tech="${key}"]`).focus();
      await page.keyboard.press(key === 'nginx' ? 'Enter' : 'Space');
      assert.equal(await page.locator(`[data-diagram-tech="${key}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator(`[data-tech="${key}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#detail-content .request-contract dd').count(), 3);
      assert((await page.locator('#detail-title').textContent()).includes(key === 'nginx' ? 'NGINX' : 'FreeBSD'));
    }
    report.checks.push('Diagram technology badges work with Enter/Space and synchronize the inspector and technology row.');

    await page.locator('[data-node="oca"]').click();
    await page.locator('[data-panel="stack"]').click();
    await page.locator('#detail-content [data-inspect-tech="nginx"]').click();
    assert((await page.locator('#detail-title').textContent()).includes('NGINX'));
    assert.equal(await page.evaluate(() => document.activeElement.id), 'detail-title');
    await page.locator('[data-node="oca"]').click();
    await page.locator('#detail-badges [data-inspect-tech="freebsd"]').click();
    assert((await page.locator('#detail-title').textContent()).includes('FreeBSD'));
    report.checks.push('Stack entries and heading badges open the actual technology and move focus to the updated title.');

    for (const key of ['player', 'playback', 'steering', 'oca', 'origin', 'fill', 'fallback']) {
      await page.locator(`[data-node="${key}"]`).click();
      await page.locator('[data-panel="role"]').click();
      assert.equal(await page.locator('#detail-content .request-contract dd').count(), 3);
      assert((await page.locator('.request-purpose').textContent()).length > 15);
    }
    report.checks.push('All seven original components describe a concrete input, processing role and output.');

    await page.locator('[data-tech="nginx"]').click();
    const diagramBefore = await page.locator('#diagram').innerHTML();
    await page.locator('#compare-button').click();
    assert((await page.locator('#detail-title').textContent()).includes('NGINX'));
    assert.equal(await page.locator('#detail-content .comparison-pair h4').allTextContents().then(names => names.join('/')), 'NGINX/Caddy');
    assert.equal(await page.locator('.comparison-differences > div').count(), 5);
    assert.equal(await page.locator('#diagram').innerHTML(), diagramBefore);
    report.checks.push('Compare uses the selected technology and shows scope, benefits, costs and verification while preserving the public architecture.');

    await page.locator('[data-tech="oca"]').click();
    await page.locator('[data-panel="tradeoff"]').click();
    await page.locator('[data-compare-option="fastly"]').click();
    assert.equal(await page.locator('.comparison-pair h4').last().textContent(), 'Fastly');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.compareOption), 'fastly');
    await page.locator('[data-tech="freebsd"]').click();
    await page.locator('[data-panel="tradeoff"]').click();
    assert.equal(await page.locator('.comparison-pair h4').last().textContent(), 'Linux');
    await page.locator('[data-tech="oca"]').click();
    await page.locator('[data-panel="tradeoff"]').click();
    assert.equal(await page.locator('.comparison-pair h4').last().textContent(), 'Fastly');
    report.checks.push('CDN alternatives retain their selection without mixing the OS and HTTP-server comparison layers.');

    for (const [key, text, read] of [['storage', '인코딩 파일', 'fill'], ['nginx', 'GET · Range', 'nginx'], ['freebsd', 'sendfile · 소켓', 'freebsd']]) {
      await page.locator(`[data-anatomy-tech="${key}"]`).click();
      assert.equal(await page.locator(`[data-anatomy-tech="${key}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('.appliance-pipeline li').count(), 3);
      assert((await page.locator('#appliance-layer-flow').textContent()).includes(text));
      assert.equal(await page.locator('#appliance-layer-read').getAttribute('href'), '#tech-' + read);
    }
    await page.locator('#appliance-layer-read').click();
    assert(await page.locator('#tech-freebsd').isVisible());
    assert.equal(new URL(page.url()).hash, '#tech-freebsd');
    report.checks.push('Each server layer reveals its own byte path and links to the corresponding deeper reading.');

    await page.locator('[data-step="0"]').click();
    assert.deepEqual((await page.locator('.node.flow-related').evaluateAll(nodes => nodes.map(node => node.dataset.node))).sort(), ['fill', 'oca', 'origin']);
    await page.locator('[data-step="1"]').click();
    assert.deepEqual((await page.locator('.node.flow-related').evaluateAll(nodes => nodes.map(node => node.dataset.node))).sort(), ['playback', 'player']);
    await page.locator('#reset-button').click();
    assert.equal(await page.locator('.node.flow-related').count(), 0);
    report.checks.push('Journey steps highlight the participating components and reset clears the context.');
    assert.deepEqual(report.errors, []);
    fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
    fs.writeFileSync(path.join(root, 'reports/insights-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
