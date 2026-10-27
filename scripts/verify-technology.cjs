const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = (process.env.ATLAS_BASE_URL || 'http://127.0.0.1:8765') + '/index.html?case=netflix';
const reports = path.join(root, 'reports');
fs.mkdirSync(reports, { recursive: true });

(async () => {
  const browser = await chromium.launch(require('./browser-options.cjs'));
  const checks = [], errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + '#tech-nginx');
    await page.evaluate(() => document.fonts.ready);
    assert(await page.locator('#tech-nginx').isVisible());
    assert.equal(await page.locator('#note-tab-nginx').getAttribute('aria-selected'), 'true');
    await page.reload();
    assert(await page.locator('#tech-nginx').isVisible());
    checks.push('A direct technology link selects its article and survives reload.');

    for (const key of ['oca', 'aws', 'freebsd', 'nginx', 'https', 'fill', 'abr', 'steering']) {
      await page.locator(`[data-note-tab="${key}"]`).click();
      const article = page.locator(`#tech-${key}`);
      assert.equal(await page.locator('.technology-note:visible').count(), 1);
      assert.equal(await article.locator('.mechanism-flow li').count(), 4);
      assert.equal(await article.locator('[data-show-alternatives]').count(), 1);
      assert((await article.locator('.note-sources a').count()) >= 2);
      assert.equal(await page.locator('[data-note-tab][tabindex="0"]').count(), 1);
    }
    checks.push('All eight articles have diagrams, worked examples, catalogue links, metrics and source links.');
    await page.locator('#note-tab-nginx').focus();
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#note-tab-https').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#note-tab-oca').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('End');
    assert.equal(await page.locator('#note-tab-steering').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'tech-steering');
    checks.push('Arrow, Home, End and Tab keys keep one selected tab and reach the visible article.');

    await page.locator('[data-tech="freebsd"]').click();
    await page.locator('#detail-content [data-read-tech]').click();
    assert.equal(new URL(page.url()).hash, '#tech-freebsd');
    assert(await page.locator('#tech-freebsd').isVisible());
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'FreeBSD와 파일 전송 경로');
    await page.locator('[data-note-location="freebsd"]').click();
    assert.equal(await page.locator('[data-node="oca"]').getAttribute('aria-pressed'), 'true');
    assert((await page.locator('#detail-title').textContent()).includes('FreeBSD'));
    await page.goBack();
    assert(await page.locator('#tech-freebsd').isVisible());
    assert.equal(new URL(page.url()).hash, '#tech-freebsd');
    checks.push('Inspector links open and focus the matching article; returning to the diagram and browser Back agree.');

    await page.locator('#note-tab-oca').click();
    assert((await page.locator('#capacity-result').textContent()).includes('71.43 Gb/s'));
    await page.locator('#capacity-viewers').fill('20000');
    await page.locator('#capacity-utilization').fill('50');
    assert((await page.locator('#capacity-result').textContent()).includes('200 Gb/s'));
    await page.locator('#capacity-utilization').fill('0');
    assert((await page.locator('#capacity-result').textContent()).includes('범위'));
    assert(!/Infinity|NaN/.test(await page.locator('.capacity-output').textContent()));
    await page.locator('#capacity-viewers').fill('');
    assert((await page.locator('#capacity-result').textContent()).includes('범위'));
    checks.push('Capacity responds to audience and utilization changes and rejects empty or zero-divisor inputs.');

    await page.locator('#note-tab-abr').click();
    for (const [speed, duration, candidate] of [['2', '10.00초', '다음 후보 1 Mb/s'], ['10', '2.00초', '다음 후보 5 Mb/s'], ['0.5', '40.00초', '조건을 만족하는 후보 없음']]) {
      await page.locator('#abr-throughput').fill(speed);
      assert((await page.locator('#abr-result').textContent()).includes(duration));
      assert((await page.locator('#abr-next').textContent()).includes(candidate));
    }
    checks.push('ABR shows both buffer pressure and the no-sustainable-rendition case on a slow network.');

    await page.locator('.technology-overview > summary').click();
    await page.locator('.tech-card [data-read-tech="nginx"]').click();
    assert(await page.locator('#tech-nginx').isVisible());
    await page.setViewportSize({ width: 320, height: 844 });
    assert.equal(await page.locator('#note-tabs').getAttribute('aria-orientation'), 'horizontal');
    assert(await page.locator('#tech-nginx pre').evaluate(element => element.scrollWidth > element.clientWidth));
    await page.locator('#tech-nginx [data-show-alternatives]').click();
    assert.equal(await page.locator('.product-card').count(), 2);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 320);
    checks.push('Cards reach the full article; code scrolls locally and the related product catalogue fits narrow screens.');

    const offline = await browser.newPage({ reducedMotion: 'reduce' });
    offline.on('pageerror', error => errors.push(error.message));
    const externalRequests = [];
    const artifactURL = base.replace('/index.html?case=netflix', '/openconnect-visual-study.html?case=netflix#tech-nginx');
    // Fulfill only the initial HTML from disk: the test also works where managed
    // Chromium blocks file://. Every runtime asset must come from the bundle.
    await offline.route('**/*', route => {
      if (route.request().isNavigationRequest() && new URL(route.request().url()).pathname === '/openconnect-visual-study.html') {
        return route.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(root, 'openconnect-visual-study.html')) });
      }
      externalRequests.push(route.request().url());
      return route.abort();
    });
    await offline.context().setOffline(true);
    await offline.goto(artifactURL);
    await offline.evaluate(() => document.fonts.ready);
    assert(await offline.locator('#tech-nginx').isVisible());
    await offline.locator('#note-tab-oca').click();
    assert((await offline.locator('#capacity-result').textContent()).includes('71.43 Gb/s'));
    await offline.locator('[data-alternative-category="all"]').click();
    assert.equal(await offline.locator('.product-card').count(), 11);
    await offline.locator('[data-open-alternative="s3"]').click();
    assert.equal(await offline.locator('#technology-sheet-title').textContent(), 'Amazon S3');
    await offline.keyboard.press('Escape');
    assert.deepEqual(externalRequests, []);
    const broken = await offline.locator('img[src]').evaluateAll(async images => {
      await Promise.all(images.map(image => image.decode().catch(() => {})));
      return images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.alt);
    });
    assert.deepEqual(broken, []);
    checks.push('The bundled HTML, supplied as the initial document, calculates offline with all images and no runtime network requests.');
    assert.deepEqual(errors, []);
    const report = { checks, errors };
    fs.writeFileSync(path.join(reports, 'technology-validation.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
