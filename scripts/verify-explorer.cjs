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
    const closeSheet = async () => {
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('#technology-dialog').open && !document.documentElement.classList.contains('has-technology-dialog'));
    };
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
    await page.locator('[data-panel="role"]').click();
    await page.locator('#detail-content').evaluate(element => { element.scrollTop = element.scrollHeight; });
    assert(await page.locator('#inspector-actions').evaluate(element => {
      const action = element.getBoundingClientRect();
      const panel = element.closest('.inspector').getBoundingClientRect();
      return action.top >= panel.top && action.bottom <= panel.bottom;
    }));
    const beforeSheet = page.url();
    await page.locator('#inspector-actions [data-open-tech-sheet]').click();
    assert(await page.locator('#technology-dialog').isVisible());
    assert.equal(page.url(), beforeSheet);
    await closeSheet();
    assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-open-tech-sheet')), true);
    report.checks.push('The inspector action remains available outside the scrolling description; it opens an overlay without navigating and restores focus.');
    await page.locator('[data-panel="stack"]').click();
    await page.locator('#detail-content [data-inspect-tech="nginx"]').click();
    assert(await page.locator('#technology-dialog').isVisible());
    assert((await page.locator('#technology-sheet-title').textContent()).includes('NGINX'));
    assert((await page.locator('#technology-sheet-publisher').textContent()).includes('F5'));
    assert.equal(await page.locator('#technology-sheet-content .sheet-steps li').count(), 4);
    assert((await page.locator('#detail-title').textContent()).includes('사용자 가까이'));
    await closeSheet();
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
    await closeSheet();
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
    assert.equal(await page.locator('#alternative-products .product-card').count(), 2);
    assert((await page.locator('.product-company').allTextContents()).includes('Apache Software Foundation'));
    assert.equal(await page.locator('#diagram').innerHTML(), diagramBefore);
    await page.locator('[data-alternative-category="all"]').click();
    assert.equal(await page.locator('#alternative-products .product-card').count(), 9);
    for (const id of ['cloudfront', 'fastly', 'cloudflare', 'caddy', 'apache', 'ubuntu', 'debian', 'gcp', 'azure']) {
      const card = page.locator(`.product-card:has([data-open-alternative="${id}"])`);
      const name = await card.locator('.replacement-title').textContent();
      const from = await card.locator('[data-replacement-from-name]').textContent();
      const to = await card.locator('[data-replacement-to-name]').textContent();
      assert.equal(name, from + ' → ' + to);
      assert.equal(await card.locator('.replacement-scope > div').count(), 3);
      const company = await card.locator('.product-company').textContent();
      await card.locator('[data-open-alternative]').click();
      assert.equal(await page.locator('#technology-sheet-title').textContent(), name);
      assert.equal(await page.locator('#technology-sheet-publisher').textContent(), company);
      assert.equal(await page.locator('#technology-sheet-content [data-replacement-from-name]').textContent(), from);
      assert.equal(await page.locator('#technology-sheet-content [data-replacement-to-name]').textContent(), to);
      assert.equal(await page.locator('#technology-sheet-content .sheet-steps li').count(), 3);
      assert((await page.locator('#technology-sheet-content .sheet-sources a').count()) >= 1);
      await closeSheet();
    }
    report.checks.push('Nine cards and their dialogs explicitly connect the current technology to its replacement, scope, provider and mechanism.');
    const expected = { cloudfront: 'Open Connect', fastly: 'Open Connect', cloudflare: 'Open Connect', caddy: 'NGINX', apache: 'NGINX', ubuntu: 'FreeBSD', debian: 'FreeBSD', gcp: 'AWS 재생 제어 환경', azure: 'AWS 재생 제어 환경' };
    for (const [id, from] of Object.entries(expected)) {
      assert.equal(await page.locator(`.product-card:has([data-open-alternative="${id}"]) [data-replacement-from-name]`).textContent(), from);
    }
    await page.locator('[data-alternative-category="http"]').click();
    assert((await page.locator('#replacement-context').textContent()).includes('NGINX'));
    await page.locator('[data-locate-replacement="http"]').click();
    assert((await page.locator('#detail-title').textContent()).includes('NGINX'));
    assert.equal(await page.locator('[data-node="oca"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#alternatives-button').click();
    assert.equal(await page.locator('[data-alternative-category="http"]').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-alternative-category="all"]').click();
    await page.locator('#storage-implementations > summary').click();
    assert.equal(await page.locator('#storage-products [data-replacement-kind="implementation"]').count(), 2);
    for (const id of ['s3', 'gcs']) {
      await page.locator(`[data-open-alternative="${id}"]`).click();
      assert((await page.locator('#technology-sheet-content .sheet-eyebrow').first().textContent()).includes('현재 제품 미지정'));
      await closeSheet();
    }
    assert.equal(await page.locator('#alternative-products [data-replacement-kind="implementation"]').count(), 0);
    report.checks.push('Each replacement maps to the correct known source and diagram position; unspecified storage is kept in two separate implementation examples.');
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
