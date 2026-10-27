const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:8765';
const widths = [320, 360, 375, 390, 414, 540, 640, 760, 768, 820, 1024, 1100, 1101, 1200, 1280, 1366, 1440, 1600, 1920, 2560];

async function inspect(page) {
  return page.evaluate(async () => {
    const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('Page overflow');
    for (const element of document.querySelectorAll('button,p,h1,h2,h3,label,strong,aside,.impact-card')) {
      if (!visible(element) || element.closest('.responsibilities, .sr-only')) continue;
      const rect = element.getBoundingClientRect();
      if (rect.left < -1 || rect.right > innerWidth + 1 || (element.clientWidth > 0 && element.scrollWidth > element.clientWidth + 2)) {
        issues.push('Overflow: ' + element.textContent.trim().slice(0, 45));
      }
    }
    for (const image of document.querySelectorAll('img[src]')) {
      await image.decode().catch(() => {});
      if (!image.naturalWidth) issues.push('Missing image');
    }
    const diagram = document.querySelector('.diagram');
    if (visible(diagram)) {
      const labels = [...diagram.querySelectorAll('text')].filter(visible);
      for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i].getBoundingClientRect(), b = labels[j].getBoundingClientRect();
        if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) {
          issues.push('SVG overlap: ' + labels[i].textContent + ' / ' + labels[j].textContent);
        }
      }
      for (const node of diagram.querySelectorAll('g[data-role]')) {
        const box = node.querySelector('rect').getBBox();
        for (const text of node.querySelectorAll('text')) {
          const rect = text.getBBox();
          if (rect.x < box.x || rect.x + rect.width > box.x + box.width + 1) issues.push('SVG node overflow: ' + text.textContent);
        }
      }
    }
    return issues;
  });
}

(async () => {
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], widths, states: 0, issues: [], errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.goto(base + '/docs/proposals/playground.html');
    await page.locator('#choice-caddy').click();
    assert.equal(await page.locator('#server-name').textContent(), 'Caddy');
    assert.equal(await page.locator('#payload-output').textContent(), '50 Gb/s');
    assert.equal(await page.locator('#server-node.changed').count(), 1);
    await page.locator('.role-picker [data-role="os"]').click();
    await page.locator('#choice-linux').click();
    assert.equal(await page.locator('#os-name').textContent(), 'Linux');
    assert.equal(await page.locator('#server-name').textContent(), 'Caddy');
    await page.locator('#viewers').fill('20000');
    await page.locator('#undo').click();
    assert.equal(await page.locator('#os-name').textContent(), 'FreeBSD');
    assert.equal(await page.locator('#server-name').textContent(), 'Caddy');
    assert.equal(await page.locator('#payload-output').textContent(), '100 Gb/s');
    report.checks.push('HTTP server and OS change separately; demand stays fixed when a technology is changed or undone.');

    await page.locator('.role-picker [data-role="delivery"]').click();
    await page.locator('#choice-cloudfront').click();
    assert(await page.locator('.role-picker [data-role="server"]').isDisabled());
    assert(await page.locator('.role-picker [data-role="os"]').isDisabled());
    assert((await page.locator('#server-name').textContent()).includes('사업자 관리'));
    assert((await page.locator('#responsibilities').textContent()).includes('CDN 사업자'));
    assert((await page.locator('#responsibilities').textContent()).includes('우리 팀 · CDN 연동 재설계'));
    report.checks.push('Managed CDN moves the operating boundary and hides unverified internal technology choices.');

    await page.locator('[data-scenario="miss"]').click();
    await page.locator('#next-step').click();
    await page.locator('#next-step').click();
    assert.equal(await page.locator('#path-fetch.active').count(), 1);
    assert.equal(await page.locator('#path-origin.active').count(), 1);
    assert.equal(await page.locator('#path-fallback').isVisible(), false);
    await page.locator('#choice-oca').click();
    await page.locator('#next-step').click();
    await page.locator('#next-step').click();
    assert.equal(await page.locator('#path-fallback.active').count(), 1);
    assert.equal(await page.locator('#path-fetch').isVisible(), false);
    report.checks.push('Missing-file scenarios distinguish another OCA candidate from the assumed on-demand CDN origin fetch.');

    const states = [
      ['server', 'caddy', 'normal'], ['os', 'linux', 'normal'],
      ['delivery', 'cloudfront', 'normal'], ['delivery', 'cloudfront', 'miss'],
      ['delivery', 'cloudfront', 'outage'], ['delivery', 'oca', 'miss'], ['delivery', 'oca', 'outage'],
    ];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      for (const [role, choice, scenario] of states) {
        await page.evaluate(({ role, choice, scenario }) => {
          document.querySelector('#reset').click();
          document.querySelector(`.role-picker [data-role="${role}"]`).click();
          document.querySelector(`#choice-${choice}`).click();
          document.querySelector(`[data-scenario="${scenario}"]`).click();
          document.querySelector('#next-step').click();
          document.querySelector('#next-step').click();
        }, { role, choice, scenario });
        report.issues.push(...(await inspect(page)).map(issue => ({ width, role, choice, scenario, issue })));
        report.states++;
      }
    }
    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.locator('#reset').click();
    await page.locator('#server-node').focus();
    await page.keyboard.press('Enter');
    await page.locator('#choice-caddy').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#server-name').textContent(), 'Caddy');
    await page.locator('#reset').click();
    assert.equal(await page.locator('#server-name').textContent(), 'NGINX');
    assert.equal(await page.locator('#os-name').textContent(), 'FreeBSD');
    assert.equal(await page.locator('#payload-output').textContent(), '50 Gb/s');
    assert(await page.locator('#undo').isDisabled());
    report.checks.push('Keyboard selection works and reset restores the baseline.');

    const offline = await browser.newPage({ reducedMotion: 'reduce' });
    offline.on('pageerror', error => report.errors.push(error.message));
    const runtimeRequests = [];
    await offline.route('**/*', route => {
      if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(root, 'docs/proposals/playground.html')) });
      runtimeRequests.push(route.request().url());
      return route.abort();
    });
    await offline.context().setOffline(true);
    await offline.goto(base + '/docs/proposals/playground.html');
    await offline.locator('#choice-caddy').click();
    assert.equal(await offline.locator('#server-name').textContent(), 'Caddy');
    assert.deepEqual(runtimeRequests, []);
    assert.deepEqual(await inspect(offline), []);
    report.checks.push('The prototype is self-contained and remains interactive without runtime network access.');
    fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
    fs.writeFileSync(path.join(root, 'reports/proposal-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    assert.deepEqual(report.issues, []);
    assert.deepEqual(report.errors, []);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
