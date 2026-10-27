const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORTS = path.join(ROOT, 'reports');
fs.mkdirSync(REPORTS, { recursive: true });
const BASE_URL = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:8765';
const WIDTHS = [320, 360, 375, 390, 414, 540, 640, 760, 768, 820, 1024, 1200, 1280, 1366, 1439, 1440, 1600, 1920, 2560];

async function inspectLayout(page) {
  return page.evaluate(async () => {
    const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
    await Promise.all([...document.querySelectorAll('img')].filter(img => visible(img) && img.getAttribute('src')).map(img => img.decode().catch(() => {})));
    const issues = [];
    if (document.documentElement.scrollWidth > window.innerWidth + 1) {
      issues.push({ kind: 'page-horizontal-overflow', actual: document.documentElement.scrollWidth, expected: window.innerWidth });
    }
    const intentionalScroll = '.diagram-viewport, .table-scroll, .zoom-dialog, .note-code pre, .flow-sample pre';
    for (const element of document.querySelectorAll('button, p, h1, h2, h3, h4, dt, dd, nav, label, input, pre, .badge, .tech-card, .vendor-card, .layer, .technology-note, .mechanism-flow')) {
      if (!visible(element) || element.closest(intentionalScroll)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)) {
        issues.push({ kind: 'element-outside-viewport', selector: element.tagName + '.' + element.className, text: element.textContent.trim().slice(0, 70), left: rect.left, right: rect.right });
      }
      if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2) {
        issues.push({ kind: 'text-horizontal-overflow', selector: element.tagName + '.' + element.className, text: element.textContent.trim().slice(0, 70), client: element.clientWidth, scroll: element.scrollWidth });
      }
    }
    const svg = document.querySelector('#diagram');
    if (visible(svg)) {
      const viewport = document.querySelector('.diagram-viewport');
      if (viewport.scrollHeight > viewport.clientHeight + 2) {
        issues.push({ kind: 'unexpected-diagram-vertical-scroll', client: viewport.clientHeight, scroll: viewport.scrollHeight });
      }
      if (innerWidth >= 1440) {
        const heights = ['.story', '.canvas', '.inspector'].map(selector => document.querySelector(selector).getBoundingClientRect().height);
        if (Math.max(...heights) - Math.min(...heights) > 1) issues.push({ kind: 'explorer-column-misalignment', heights });
      }
      for (const node of svg.querySelectorAll('.node')) {
        const box = node.querySelector('.node-box').getBBox();
        for (const text of node.querySelectorAll('text')) {
          const rect = text.getBBox();
          if (rect.x < box.x - 1 || rect.x + rect.width > box.x + box.width + 1 || rect.y < box.y - 1 || rect.y + rect.height > box.y + box.height + 1) {
            issues.push({ kind: 'svg-node-text-overflow', node: node.dataset.node, text: text.textContent, textBox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } });
          }
        }
      }
      const labels = [...svg.querySelectorAll('text')].filter(visible);
      for (let a = 0; a < labels.length; a++) {
        const x = labels[a].getBoundingClientRect();
        for (let b = a + 1; b < labels.length; b++) {
          const y = labels[b].getBoundingClientRect();
          if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 2 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 2) {
            issues.push({ kind: 'svg-label-overlap', a: labels[a].textContent, b: labels[b].textContent });
          }
        }
      }
    }
    for (const img of document.querySelectorAll('img')) {
      if (!visible(img) || !img.getAttribute('src')) continue;
      if (!img.complete || img.naturalWidth === 0) issues.push({ kind: 'image-not-loaded', src: img.getAttribute('src') });
    }
    return issues;
  });
}

(async () => {
  let browser;
  const report = { widths: WIDTHS, states: [], functional: [], errors: [], assetFailures: [], issues: [] };
  try {
    browser = await chromium.launch(require('./browser-options.cjs'));
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 } });
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) report.assetFailures.push({ url: r.url(), status: r.status() }); });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL + '/index.html?case=netflix');
    await page.evaluate(() => document.fonts.ready);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => { document.querySelector('#reference-details').open = false; document.querySelector('#reset-button').click(); });
      for (const node of ['player', 'playback', 'steering', 'oca', 'origin', 'fill', 'fallback']) {
        for (const panel of ['role', 'stack']) {
          await page.evaluate(({ node, panel }) => {
            document.querySelector(`[data-node="${node}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true }));
            document.querySelector(`[data-panel="${panel}"]`).click();
          }, { node, panel });
          const issues = await inspectLayout(page);
          report.states.push({ width, view: 'design', node, panel, issueCount: issues.length });
          report.issues.push(...issues.map(issue => ({ width, node, panel, ...issue })));
        }
      }
      for (const tech of ['aws', 'freebsd', 'nginx', 'https']) {
        for (const panel of ['role', 'stack']) {
          await page.evaluate(({ tech, panel }) => {
            document.querySelector(`[data-tech="${tech}"]`).click();
            document.querySelector(`[data-panel="${panel}"]`).click();
          }, { tech, panel });
          const issues = await inspectLayout(page);
          report.states.push({ width, view: 'design', tech, panel, issueCount: issues.length });
          report.issues.push(...issues.map(issue => ({ width, tech, panel, ...issue })));
        }
      }
      for (const tech of ['oca', 'aws', 'freebsd', 'nginx', 'https', 'fill', 'abr', 'steering']) {
        await page.evaluate(tech => document.querySelector(`[data-note-tab="${tech}"]`).click(), tech);
        const noteIssues = await inspectLayout(page);
        report.states.push({ width, view: 'technology-note', tech, issueCount: noteIssues.length });
        report.issues.push(...noteIssues.map(issue => ({ width, view: 'technology-note', tech, ...issue })));
      }
      await page.locator('.technology-overview').evaluate(element => { element.open = true; });
      const overviewIssues = await inspectLayout(page);
      report.states.push({ width, view: 'technology-overview', issueCount: overviewIssues.length });
      report.issues.push(...overviewIssues.map(issue => ({ width, view: 'technology-overview', ...issue })));
      await page.locator('.technology-overview').evaluate(element => { element.open = false; });
      for (const category of ['delivery', 'http', 'os', 'cloud', 'storage', 'all']) {
        await page.evaluate(category => document.querySelector(`[data-alternative-category="${category}"]`).click(), category);
        const issues = await inspectLayout(page);
        report.states.push({ width, view: 'alternative-products', category, issueCount: issues.length });
        report.issues.push(...issues.map(issue => ({ width, category, ...issue })));
      }
      for (let step = 0; step < 9; step++) {
        await page.evaluate(step => document.querySelector(`[data-step="${step}"]`).click(), step);
        const issues = await inspectLayout(page);
        report.states.push({ width, view: 'journey', step, issueCount: issues.length });
        report.issues.push(...issues.map(issue => ({ width, step, ...issue })));
      }
      for (const kind of ['technology', 'product']) {
        await page.evaluate(kind => kind === 'technology' ? openTechnologySheet('nginx') : openAlternativeSheet('cloudfront'), kind);
        const issues = await inspectLayout(page);
        report.states.push({ width, view: 'technology-dialog', kind, issueCount: issues.length });
        report.issues.push(...issues.map(issue => ({ width, kind, ...issue })));
        await page.evaluate(() => closeTechnologySheet());
      }
      for (const layer of ['storage', 'nginx', 'freebsd']) {
        await page.evaluate(layer => document.querySelector(`[data-anatomy-tech="${layer}"]`).click(), layer);
        const layerIssues = await inspectLayout(page);
        report.states.push({ width, view: 'appliance-layer', layer, issueCount: layerIssues.length });
        report.issues.push(...layerIssues.map(issue => ({ width, view: 'appliance-layer', layer, ...issue })));
      }
      await page.evaluate(() => document.querySelector('#failover-button').click());
      let issues = await inspectLayout(page);
      report.states.push({ width, view: 'design', panel: 'failover', issueCount: issues.length });
      report.issues.push(...issues.map(issue => ({ width, panel: 'failover', ...issue })));
      await page.evaluate(() => document.querySelector('#reference-details').open = true);
      issues = await inspectLayout(page);
      report.states.push({ width, view: 'references', issueCount: issues.length });
      report.issues.push(...issues.map(issue => ({ width, view: 'references', ...issue })));
    }

    const catalogue = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await catalogue.goto(BASE_URL + '/index.html');
    await catalogue.evaluate(() => document.fonts.ready);
    for (const width of WIDTHS) {
      await catalogue.setViewportSize({ width, height: 1000 });
      const issues = await inspectLayout(catalogue);
      report.states.push({ width, view: 'library', issueCount: issues.length });
      report.issues.push(...issues.map(issue => ({ width, view: 'library', ...issue })));
    }
    assert.equal(await catalogue.locator('[data-view]').count(), 0);
    await catalogue.close();
    report.functional.push('The catalogue fits all tested widths and the old header tabs are removed.');

    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.locator('#reference-details').evaluate(e => { e.open = false; });
    await page.locator('#reset-button').click();
    for (const id of ['player', 'playback', 'steering', 'oca', 'origin', 'fill', 'fallback']) {
      await page.locator(`[data-node="${id}"]`).click();
      for (const panel of ['role', 'stack']) {
        await page.locator(`[data-panel="${panel}"]`).click();
        assert((await page.locator('#detail-content').textContent()).trim().length > 50);
        report.issues.push(...(await inspectLayout(page)).map(issue => ({ width: 1600, node: id, panel, ...issue })));
      }
    }
    report.functional.push('All seven nodes and two detail tabs display meaningful content.');
    for (let index = 0; index < 9; index++) {
      await page.locator(`[data-step="${index}"]`).click();
      assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), String(index));
      assert.equal(await page.locator('.journey-focus').count(), 1);
      assert((await page.locator('.node.flow-related').count()) > 0);
    }
    report.functional.push('All nine steps show the detailed request, data and participating components.');
    await page.locator('#failover-button').click();
    assert(await page.locator('#fallback-video').isVisible());
    assert(!(await page.locator('#normal-video').isVisible()));
    await page.locator('#reset-button').click();
    assert(await page.locator('#normal-video').isVisible());
    assert.equal(await page.locator('[data-flow].dimmed').count(), 0);
    report.functional.push('Failover and reset consistently restore the correct routes.');
    await page.locator('#play-button').click();
    await page.waitForTimeout(2550);
    assert.equal(await page.locator('.step[aria-pressed="true"]').getAttribute('data-step'), '1');
    await page.locator('#play-button').click();
    assert(!(await page.locator('#diagram').getAttribute('class')).includes('running'));
    report.functional.push('Automatic flow advances and pauses.');
    for (const key of ['aws', 'oca', 'freebsd', 'nginx', 'https', 'fill']) {
      await page.locator(`[data-tech="${key}"]`).click();
      if (['aws', 'freebsd', 'nginx', 'https'].includes(key)) {
        assert.equal(await page.locator('#detail-kind').textContent(), 'TECHNOLOGY / ');
        assert.equal(await page.locator('#detail-content .request-contract').count(), 1);
      }
    }
    report.functional.push('Six technology badges select their node and explain the technology role.');
    await page.locator('[data-node="origin"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-node="origin"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#role-tab').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#stack-tab').getAttribute('aria-selected'), 'true');
    report.functional.push('Keyboard node selection and arrow-key tabs work.');
    await page.locator('.skip-link').focus();
    assert.equal(await page.locator('.skip-link').evaluate(e => getComputedStyle(e).opacity), '1');
    await page.locator('#back-to-library').focus();
    assert.equal(await page.locator('.skip-link').evaluate(e => getComputedStyle(e).opacity), '0');
    report.functional.push('The accessibility skip link is visible only while focused.');
    await page.locator('#reference-details').evaluate(e => { e.open = true; });
    await page.locator('.zoomable').first().click();
    assert(await page.locator('#zoom-dialog').isVisible());
    await page.keyboard.press('Escape');
    assert(!(await page.locator('#zoom-dialog').isVisible()));
    report.functional.push('Reference image modal opens and closes with Escape.');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#reference-details').evaluate(e => { e.open = false; });
    await page.locator('#play-button').click();
    assert.equal(await page.locator('.flow.video').first().evaluate(e => getComputedStyle(e).animationName), 'none');
    await page.locator('#reset-button').click();
    report.functional.push('Reduced-motion setting disables animated paths.');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-tech="nginx"]').click();
    const inView = await page.locator('[data-node="oca"]').evaluate(element => {
      const node = element.getBoundingClientRect();
      const viewport = document.querySelector('.diagram-viewport').getBoundingClientRect();
      return node.left >= viewport.left - 1 && node.right <= viewport.right + 1;
    });
    assert(inView);
    report.functional.push('Selecting a technology brings its diagram node into view on mobile.');
    assert.deepEqual(report.errors, []);
    assert.deepEqual(report.assetFailures, []);
    fs.writeFileSync(path.join(REPORTS, 'ui-validation.json'), JSON.stringify(report, null, 2));
    const unique = [...new Map(report.issues.map(issue => [JSON.stringify(issue), issue])).values()];
    console.log(JSON.stringify({ viewportCount: WIDTHS.length, layoutStates: report.states.length, functional: report.functional, issueCount: unique.length, issues: unique.slice(0, 35), errors: report.errors, assetFailures: report.assetFailures }, null, 2));
    if (unique.length) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
