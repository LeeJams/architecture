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
    assert.deepEqual(await page.locator('[data-panel]').allTextContents(), ['역할과 흐름', '구성 기술']);
    assert.equal(await page.locator('[data-step]').count(), 9);
    assert(!/트레이드오프|TRADE.OFF/i.test(await page.locator('body').innerText()));
    report.checks.push('Nine journey steps and exactly two inspector tabs; trade-off UI is removed.');
    for (const key of ['nginx', 'freebsd']) {
      await page.locator(`[data-diagram-tech="${key}"]`).focus();
      await page.keyboard.press(key === 'nginx' ? 'Enter' : 'Space');
      assert.equal(await page.locator(`[data-tech="${key}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#detail-content .request-contract dd').count(), 3);
    }
    await page.locator('[data-node="oca"]').click();
    await page.locator('[data-panel="stack"]').click();
    await page.locator('#detail-content [data-inspect-tech="nginx"]').click();
    assert(await page.locator('#technology-dialog').isVisible());
    assert((await page.locator('#technology-sheet-title').textContent()).includes('NGINX'));
    assert((await page.locator('#technology-sheet-publisher').textContent()).includes('F5'));
    assert.equal(await page.locator('#technology-sheet-content .sheet-steps li').count(), 4);
    assert((await page.locator('#detail-title').textContent()).includes('사용자 가까이'));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.inspectTech), 'nginx');
    assert.equal(await page.locator('html').evaluate(element => element.classList.contains('has-technology-dialog')), false);
    report.checks.push('Stack rows open a readable native dialog with publisher, mechanism and example; Escape restores focus and context.');
    for (let index = 0; index < 9; index++) {
      await page.locator(`[data-step="${index}"]`).click();
      assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), String(index));
      assert((await page.locator('.journey-focus').textContent()).length > 150);
      assert.equal(await page.locator('.journey-actions li').count(), 3);
      assert((await page.locator('.node.flow-related').count()) > 0);
    }
    await page.locator('[data-step="5"]').click();
    assert((await page.locator('.flow-sample').textContent()).includes('Range: bytes=0-1023'));
    assert.equal(await page.locator('#segment-request.dimmed').count(), 0);
    await page.locator('[data-journey-move="1"]').click();
    assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), '6');
    assert((await page.locator('.flow-sample').textContent()).includes('206 Partial Content'));
    await page.locator('.journey-tech [data-open-tech-sheet="nginx"]').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), '6');
    await page.locator('#failover-button').click();
    assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), '8');
    assert(await page.locator('#fallback-video').isVisible());
    assert.equal(await page.locator('#fallback-video .flow.control').count(), 1);
    assert.equal(await page.locator('#segment-request.dimmed').count(), 1);
    report.checks.push('Requests, responses, buffer decisions and retries preserve journey state across technology reading.');
    await page.locator('[data-tech="nginx"]').click();
    const diagramBefore = await page.locator('#diagram').innerHTML();
    await page.locator('#alternatives-button').click();
    assert.equal(await page.locator('[data-alternative-category="http"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.product-card').count(), 2);
    assert((await page.locator('.product-company').allTextContents()).includes('Apache Software Foundation'));
    assert.equal(await page.locator('#diagram').innerHTML(), diagramBefore);
    await page.locator('[data-alternative-category="all"]').click();
    assert.equal(await page.locator('.product-card').count(), 11);
    for (const id of ['cloudfront', 'fastly', 'cloudflare', 'caddy', 'apache', 'ubuntu', 'debian', 'gcp', 'azure', 's3', 'gcs']) {
      const card = page.locator(`.product-card:has([data-open-alternative="${id}"])`);
      const name = await card.locator('h3').textContent();
      const company = await card.locator('.product-company').textContent();
      await card.locator('[data-open-alternative]').click();
      assert.equal(await page.locator('#technology-sheet-title').textContent(), name);
      assert.equal(await page.locator('#technology-sheet-publisher').textContent(), company);
      assert.equal(await page.locator('#technology-sheet-content .sheet-steps li').count(), 3);
      assert((await page.locator('#technology-sheet-content .sheet-sources a').count()) >= 1);
      await page.keyboard.press('Escape');
    }
    report.checks.push('Eleven products show their provider, role, type, full mechanism and official references.');
    await page.locator('[data-open-alternative="caddy"]').click();
    assert((await page.locator('#technology-sheet-publisher').textContent()).includes('ZeroSSL'));
    await page.setViewportSize({ width: 320, height: 844 });
    await page.mouse.click(1, 1);
    assert(!(await page.locator('#technology-dialog').isVisible()));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    await page.locator('[data-anatomy-tech="freebsd"]').click();
    assert.equal(await page.locator('.appliance-pipeline li').count(), 3);
    await page.locator('#appliance-layer-read').click();
    assert(await page.locator('#tech-freebsd').isVisible());
    report.checks.push('Backdrop closing unlocks the page; narrow-screen catalogues and existing server-layer deep links work.');
    assert.deepEqual(report.errors, []);
    fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
    fs.writeFileSync(path.join(root, 'reports/explorer-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
