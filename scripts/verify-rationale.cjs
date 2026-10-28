const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.ATLAS_BASE_URL || 'http://127.0.0.1:4173';

async function openKafka(page) {
  await page.goto(base + '/?view=technologies');
  await page.locator('#technology-search').fill('Kafka');
  await page.locator('#technology-catalogue-grid [data-open-technology-info="kafka"]').click();
  await page.locator('[data-messaging-demo]').waitFor();
}
async function assertNoOverflow(page, width, context) {
  const issues = await page.locator('[data-technology-info="kafka"]').evaluate(root => [...root.querySelectorAll('p,h3,h4,dt,dd,button,li,label,input')].filter(e => !e.closest('pre') && e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 2).map(e => e.textContent.slice(0, 70)));
  assert.deepEqual(issues, [], context);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
}

(async () => {
  const { technologyCatalogue } = await import('../src/data/technology-catalogue.js');
  for (const tech of technologyCatalogue) {
    const why = tech.rationale;
    assert(why, tech.id + ' needs a rationale');
    for (const key of ['short', 'problem', 'change', 'ask', 'simpler']) assert(why[key]?.trim(), tech.id + ' ' + key);
    assert(why.decisions.length >= 2, tech.id + ' paired gains and responsibilities');
    for (const pair of why.decisions) for (const key of ['gainTitle', 'gain', 'costTitle', 'cost']) assert(pair[key]?.trim(), tech.id + ' ' + key);
  }
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const report = { checks: [], scenarioStates: 0, errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push(error.message));
    await openKafka(page);
    assert.equal(await page.locator('[data-info-section]').first().getAttribute('data-info-section'), 'why');
    await page.locator('[data-info-jump="decision"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.closest('[data-info-section]').dataset.infoSection), 'decision');
    assert.equal(await page.locator('.technology-decision-pair').count(), 4);
    await page.locator('[data-info-jump="why"]').click();
    assert.equal(await page.evaluate(() => document.activeElement.closest('[data-info-section]').dataset.infoSection), 'why');
    const route = page.url();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const mode of ['sync', 'async']) {
        const modeButton = page.locator(`[data-messaging-mode="${mode}"]`);
        await modeButton.focus(); await page.keyboard.press('Enter');
        assert.equal(await modeButton.evaluate(e => document.activeElement === e), true);
        assert.equal(await modeButton.getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[data-messaging-model]').getAttribute('data-messaging-model'), mode);
        assert.equal(await page.locator('.messaging-flow-steps').count(), mode === 'async' ? 2 : 1);
        if (mode === 'async') {
          assert((await page.locator('.messaging-flow-steps').first().textContent()).includes('주문 + outbox 커밋'));
          assert(!(await page.locator('.messaging-flow-steps').first().textContent()).includes('Kafka'));
          assert.equal(await page.locator('.messaging-consumers > p').count(), 2);
        }
        for (const situation of ['normal', 'slow', 'stopped', 'uncertain']) {
          const control = page.locator(`[data-messaging-situation="${situation}"]`);
          await control.focus(); await page.keyboard.press('Enter');
          assert.equal(await control.getAttribute('aria-pressed'), 'true');
          const result = page.locator('[data-messaging-result]');
          assert.equal(await result.getAttribute('data-messaging-result'), `${mode}-${situation}`);
          assert.equal(await result.locator('dl > div').count(), 3);
          const text = await result.textContent();
          if (mode === 'async') assert(text.includes('주문 접수 응답'));
          if (mode === 'sync' && situation !== 'normal') assert(text.includes('주문은 이미 저장됨'));
          if (mode === 'async' && situation === 'uncertain') {
            assert(text.includes('offset 커밋 전에 중단'));
            assert(text.includes('event_id만 DB에 남기는 것으로'));
            assert(text.includes('외부 메일을 자동으로 한 번만 실행하지 않습니다'));
          }
          await assertNoOverflow(page, width, `${mode}/${situation} at ${width}`);
          assert.equal(page.url(), route);
          report.scenarioStates++;
        }
      }
    }
    report.checks.push('33 technology rationales explain the problem, mechanism, paired gains/responsibilities and simpler starting point. Necessity comes before definition, and jump buttons move keyboard focus.');
    report.checks.push('32 Kafka example states fit 320–1440px with keyboard controls: synchronous/async, normal/slow/stopped/uncertain. Order acceptance, DB commit, event publication and downstream completion stay distinct.');

    const summary = page.locator('[data-backlog-calculator] > summary');
    await summary.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-backlog-count]').textContent(), '6,000건');
    assert.equal(await page.locator('[data-backlog-catchup]').textContent(), '120초');
    for (const capacity of ['100', '50', '0']) {
      await page.locator('#backlog-capacity').fill(capacity);
      assert(await page.locator('[data-backlog-no-drain]').isVisible());
      assert.equal(await page.locator('[data-backlog-catchup]').count(), 0);
    }
    await page.locator('#backlog-capacity').fill('200');
    assert.equal(await page.locator('[data-backlog-catchup]').textContent(), '60초');
    await page.locator('#backlog-arrival').fill('1');
    await page.locator('#backlog-stopped').fill('1');
    await page.locator('#backlog-capacity').fill('1000000');
    assert.equal(await page.locator('[data-backlog-catchup]').textContent(), '0.1초 미만');
    await page.locator('#backlog-stopped').fill('60');
    await page.locator('#backlog-capacity').fill('200');
    for (const invalid of ['', '-1', '0.5', '1000001']) {
      await page.locator('#backlog-arrival').fill(invalid);
      assert((await page.locator('[data-backlog-result]').textContent()).includes('정수를 입력'));
      assert.equal(await page.locator('[data-backlog-count]').count(), 0);
    }
    await page.locator('#backlog-arrival').fill('0');
    assert.equal(await page.locator('[data-backlog-count]').textContent(), '0건');
    await page.locator('#backlog-arrival').fill('100');
    await page.locator('#backlog-stopped').fill('0');
    assert.equal(await page.locator('[data-backlog-count]').textContent(), '0건');
    await page.locator('#backlog-stopped').fill('60');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await assertNoOverflow(page, width, 'expanded calculator at ' + width);
    }
    await page.locator('[data-messaging-mode="sync"]').click();
    assert.equal(await page.locator('#backlog-capacity').inputValue(), '200');
    assert(!(await page.locator('[data-backlog-result]').textContent()).match(/NaN|Infinity/));
    report.checks.push('Backlog is 6,000 events after 100/s for 60s; 150/s needs 120s to catch up and 200/s needs 60s. Equal/slower processing cannot drain backlog. Empty, negative, fractional, zero and excessive inputs are handled; values survive mode changes.');

    const offline = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const requests = [];
    offline.on('pageerror', error => report.errors.push(error.message));
    await offline.route('**/*', route => route.request().isNavigationRequest() ? route.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.resolve(__dirname, '../openconnect-visual-study.html')) }) : (requests.push(route.request().url()), route.abort()));
    await offline.context().setOffline(true);
    await openKafka(offline);
    await offline.locator('[data-messaging-mode="async"]').click();
    await offline.locator('[data-messaging-situation="uncertain"]').click();
    assert(await offline.locator('[data-messaging-result="async-uncertain"]').isVisible());
    await offline.locator('[data-backlog-calculator] > summary').click();
    assert.equal(await offline.locator('[data-backlog-catchup]').textContent(), '120초');
    assert.deepEqual(requests, []);
    report.checks.push('Kafka rationale, original logo, controls and calculator work offline in the standalone HTML, with reduced motion and no runtime network requests.');
    assert.deepEqual(report.errors, []);
    fs.mkdirSync(path.resolve(__dirname, '../reports'), { recursive: true });
    fs.writeFileSync(path.resolve(__dirname, '../reports/rationale-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
