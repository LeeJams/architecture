const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:4173';
fs.mkdirSync(path.resolve(__dirname, '../reports'), { recursive: true });
const settle = (page, route) => page.waitForFunction(route => document.documentElement.dataset.route === route && !document.documentElement.dataset.transitioning, route);

async function inspect(page, width, name) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, name);
  const issues = await page.locator('#sansa-design').evaluate(root => [...root.querySelectorAll('p,h1,h2,h3,h4,button,dt,dd,label,nav')].filter(e => e.clientWidth && e.scrollWidth > e.clientWidth + 2).map(e => e.textContent.slice(0, 80)));
  assert.deepEqual(issues, [], name);
}
(async () => {
  const { interactiveWebTechnologies } = await import('../src/data/interactive-web-technologies.js');
  const { sansaActions, relatedWebProjects } = await import('../src/data/interactive-services.js');
  const { technologyCatalogue } = await import('../src/data/technology-catalogue.js');
  assert.equal(interactiveWebTechnologies.length, 11);
  for (const item of relatedWebProjects) assert(item.techs.every(id => technologyCatalogue.some(tech => tech.id === id)));
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], responsiveStates: 0, errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => report.errors.push(error.message));
    await page.addInitScript(() => {
      window.__sansaTransitions = [];
      if (document.startViewTransition) {
        const native = document.startViewTransition.bind(document);
        document.startViewTransition = (...args) => {
          const record = { ready: false, finished: false, error: null };
          window.__sansaTransitions.push(record);
          const result = native(...args);
          result.ready.then(() => record.ready = true, error => record.error = error.message);
          result.finished.then(() => record.finished = true);
          return result;
        };
      }
    });
    await page.goto(base + '/');
    assert.equal(await page.locator('.case-list > li').count(), 2);
    await page.locator('#sansa-card').focus(); await page.keyboard.press('Enter'); await settle(page, 'sansa');
    assert.equal(await page.locator('#sansa-title').evaluate(e => document.activeElement === e), true);
    assert.equal(new URL(page.url()).searchParams.get('case'), 'sansa');
    assert((await page.title()).includes('산사'));
    await page.goBack(); await settle(page, 'library');
    assert.equal(await page.locator('#sansa-card').evaluate(e => document.activeElement === e), true);
    await page.goForward(); await settle(page, 'sansa');
    await page.locator('#sansa-design .back-to-library').click(); await settle(page, 'library');
    const transitions = await page.evaluate(() => window.__sansaTransitions);
    assert.equal(transitions.length, 4); assert(transitions.every(t => t.ready && t.finished && !t.error));
    report.checks.push('Two service cards have unique native transition names. Sansa opens from the keyboard; Back/Forward and return restore the correct card focus, title and URL.');
    await page.goto(base + '/?case=sansa#sansa-technologies'); await page.reload();
    assert(await page.locator('#sansa-design').isVisible());
    assert((await page.locator('.sansa-evidence-note').textContent()).includes('간접'));
    assert.equal(await page.locator('#sansa-technologies [data-technology-card]').count(), 6);
    assert.equal(await page.locator('[data-related-web-project]').count(), 5);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 540, 760, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const action of sansaActions) {
        await page.locator(`[data-sansa-action="${action.id}"]`).evaluate(e => e.click());
        for (let step = 0; step < action.steps.length; step++) {
          await page.locator(`[data-sansa-step="${step}"]`).evaluate(e => e.click());
          for (const panel of ['role', 'stack']) {
            await page.locator(`#sansa-tab-${panel}`).evaluate(e => e.click());
            assert.equal(await page.locator(`#sansa-tab-${panel}`).getAttribute('aria-selected'), 'true');
            if (panel === 'role') assert((await page.locator('#sansa-panel-role').textContent()).includes(action.steps[step][1]));
            else assert.equal(await page.locator('#sansa-panel-stack [data-sansa-info]').count(), action.techs.length);
            await inspect(page, width, `${action.id}/${step}/${panel} at ${width}`);
            report.responsiveStates++;
          }
        }
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.locator('[data-sansa-action="move"]').click();
    await page.locator('#sansa-tab-role').focus(); await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#sansa-tab-stack').evaluate(e => document.activeElement === e), true);
    for (const id of ['threejs', 'webgl', 'websocket']) {
      const button = page.locator(`#sansa-panel-stack [data-sansa-info="${id}"]`);
      await button.click();
      assert.equal(await page.locator('#technology-sheet-title').textContent(), technologyCatalogue.find(t => t.id === id).name);
      assert(await page.locator(`[data-technology-info="${id}"]`).isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await button.evaluate(e => document.activeElement === e), true);
    }
    await page.locator('.sansa-alternative-grid [data-sansa-info="firebase-rtdb"]').click();
    assert((await page.locator('.technology-sheet-identity').textContent()).includes('브랜드 심벌'));
    assert((await page.locator('[data-technology-info="firebase-rtdb"]').textContent()).includes('Firestore'));
    await page.keyboard.press('Escape');
    report.checks.push('Six actions, four flow steps and two inspector tabs fit 384 states at 320–1920px. Technical buttons reuse the common native dialog, API marks and exact product names; image provenance and indirect evidence stay explicit.');
    await page.locator('#sansa-lab').scrollIntoViewIfNeeded();
    await page.locator('[data-move-to="2"]').click();
    assert.equal(await page.locator('[data-room-screen="local"]').getAttribute('data-position'), '2');
    assert.equal(await page.locator('[data-room-screen="remote"]').getAttribute('data-position'), '1');
    await page.waitForFunction(() => document.querySelector('[data-room-screen="remote"]').dataset.position === '2');
    assert.equal(await page.locator('[data-lab-sent]').textContent(), '1');
    await page.evaluate(() => { for (const index of [0, 1, 0]) document.querySelector(`[data-move-to="${index}"]`).click(); });
    await page.waitForFunction(() => document.querySelector('[data-room-screen="remote"]').dataset.position === '0');
    assert.equal(await page.locator('[data-lab-sent]').textContent(), '2');
    await page.getByLabel('이동 전송 간격', { exact: true }).selectOption('100');
    await page.getByLabel('전달 지연 가정', { exact: true }).selectOption('1500');
    await page.locator('[data-move-to="2"]').click();
    await page.waitForFunction(() => document.querySelector('[data-lab-sent]').textContent === '3');
    await page.locator('[data-lab-connection="ready"]').click();
    assert(await page.locator('[data-move-to="0"]').isDisabled());
    await page.waitForTimeout(1600);
    assert.equal(await page.locator('[data-room-screen="remote"]').getAttribute('data-position'), '0');
    assert.equal(await page.locator('[data-lab-received]').textContent(), '2');
    await page.getByLabel('전달 지연 가정', { exact: true }).selectOption('200');
    await page.locator('[data-lab-connection="offline"]').click();
    assert(await page.locator('[data-move-to="0"]').isDisabled());
    await page.locator('[data-lab-connection="ready"]').waitFor();
    assert.equal(await page.locator('[data-room-screen="local"]').getAttribute('data-position'), '0');
    assert.equal(await page.locator('[data-room-screen="remote"]').getAttribute('data-position'), '0');
    await page.getByRole('button', { name: '실험 초기화', exact: true }).click();
    assert.equal(await page.locator('[data-lab-sent]').textContent(), '0');
    assert.equal(await page.locator('[data-room-screen="local"]').getAttribute('data-position'), '1');
    report.checks.push('The deterministic presence model updates local state first, coalesces pending moves, preserves delivery order, cancels in-flight work on disconnect, disables actions while syncing, restores only accepted state and resets cleanly.');
    const offline = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const requests = [];
    offline.on('pageerror', error => report.errors.push(error.message));
    await offline.route('**/*', route => route.request().isNavigationRequest() ? route.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.resolve(__dirname, '../openconnect-visual-study.html')) }) : (requests.push(route.request().url()), route.abort()));
    await offline.context().setOffline(true);
    await offline.goto(base + '/offline.html?case=sansa');
    await offline.locator('#sansa-technologies [data-open-technology-info="web-audio"]').click();
    assert(await offline.locator('[data-technology-info="web-audio"]').isVisible());
    await offline.keyboard.press('Escape');
    await offline.locator('[data-move-to="0"]').click();
    await offline.waitForFunction(() => document.querySelector('[data-room-screen="remote"]').dataset.position === '0');
    assert.deepEqual(requests, []);
    report.checks.push('Direct Sansa links, native technical dialogs, all local assets and the presence experiment run in the offline HTML without runtime network requests.');
    assert.deepEqual(report.errors, []);
    fs.writeFileSync(path.resolve(__dirname, '../reports/interactive-web-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
