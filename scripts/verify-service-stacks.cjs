const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.ATLAS_BASE_URL || "http://127.0.0.1:4173";
const settle = (page) =>
  page.waitForFunction(
    () =>
      document.documentElement.dataset.route === "stacks" &&
      !document.documentElement.dataset.transitioning,
  );

async function inspect(page, width) {
  const issues = await page.locator("#service-stacks").evaluate((root) => {
    const visible = (e) =>
      e.getClientRects().length && getComputedStyle(e).visibility !== "hidden";
    return [...root.querySelectorAll("p,h1,h2,h3,h4,button,summary,dt,dd")]
      .filter(visible)
      .filter(
        (e) =>
          e.scrollWidth > e.clientWidth + 2 ||
          parseFloat(getComputedStyle(e).fontSize) < 12,
      )
      .map((e) => e.textContent.slice(0, 100));
  });
  assert.deepEqual(issues, [], `Text overflow or small text at ${width}`);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    width,
  );
  assert.equal(
    await page
      .locator(
        "#service-stacks button button, #service-stacks button a, #service-stacks a button",
      )
      .count(),
    0,
  );
  assert(
    await page
      .locator("#service-stacks img")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth),
      ),
  );
}

(async () => {
  const { serviceStacks } = await import("../src/data/service-stacks.js");
  const { technologyCatalogue } =
    await import("../src/data/technology-catalogue.js");
  for (const service of serviceStacks) {
    for (const part of service.parts) {
      assert(
        part.connects.every((id) =>
          service.parts.some((item) => item.id === id),
        ),
      );
      assert(part.sources.every((index) => service.sources[index]));
      assert(
        part.technologies.every(
          (entry) =>
            !entry.id ||
            technologyCatalogue.some((item) => item.id === entry.id),
        ),
      );
    }
  }
  fs.mkdirSync(path.resolve(__dirname, "../reports"), { recursive: true });
  const browser = await chromium.launch(require("./browser-options.cjs"));
  const report = { checks: [], responsiveStates: 0, errors: [] };
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.on("pageerror", (error) => report.errors.push(error.message));
    await page.addInitScript(() => {
      window.__stackTransitions = [];
      if (document.startViewTransition) {
        const native = document.startViewTransition.bind(document);
        document.startViewTransition = (...args) => {
          const record = { ready: false, error: null };
          window.__stackTransitions.push(record);
          const transition = native(...args);
          transition.ready.then(
            () => (record.ready = true),
            (error) => (record.error = error.message),
          );
          return transition;
        };
      }
    });
    await page.goto(base + "/");
    await page.locator(".topbar [data-stacks-link]").click();
    await settle(page);
    assert(await page.locator('[data-stack-overview="sansa"]').isVisible());
    assert.equal(
      await page
        .locator("#service-stacks-title")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    assert.equal(
      await page.locator('.topbar [aria-current="page"]').count(),
      1,
    );
    await page.locator('[data-stack-service="netflix"]').click();
    await settle(page);
    assert(await page.locator('[data-stack-overview="netflix"]').isVisible());
    assert((await page.title()).includes("넷플릭스"));
    await page.goBack();
    await page.locator('[data-stack-overview="sansa"]').waitFor();
    assert.equal(
      await page
        .locator("#service-stacks-title")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.goForward();
    await page.locator('[data-stack-overview="netflix"]').waitFor();
    assert.equal(new URL(page.url()).searchParams.get("service"), "netflix");
    const transitions = await page.evaluate(() => window.__stackTransitions);
    assert(
      transitions.length >= 2 &&
        transitions.every((item) => item.ready && !item.error),
    );
    report.checks.push(
      "New navigation, service selection, native transitions, title/focus and Back/Forward keep the chosen service in the URL.",
    );
    await page.locator(".topbar [data-catalogue-link]").click();
    await page.waitForFunction(
      () =>
        document.documentElement.dataset.route === "catalogue" &&
        !document.documentElement.dataset.transitioning,
    );
    assert.equal(
      new URL(
        await page.locator(".topbar [data-stacks-link]").getAttribute("href"),
        page.url(),
      ).searchParams.get("service"),
      "netflix",
    );
    await page.locator(".topbar [data-stacks-link]").click();
    await settle(page);
    assert(await page.locator('[data-stack-overview="netflix"]').isVisible());

    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const service of serviceStacks) {
      await page.goto(`${base}/?view=stacks&service=${service.id}`);
      assert.equal(
        await page.locator("[data-stack-part]").count(),
        service.parts.length,
      );
      assert.equal(
        await page.locator(".stack-quick-map li").count(),
        service.parts.length,
      );
      assert(
        (await page.locator(".stack-evidence").textContent()).includes(
          service.basis,
        ),
      );
      const ids = [
        ...new Set(
          service.parts
            .flatMap((part) => part.technologies)
            .map((entry) => entry.id)
            .filter(Boolean),
        ),
      ];
      assert.deepEqual(
        await page
          .locator("[data-stack-technology]")
          .evaluateAll((nodes) =>
            nodes.map((node) => node.dataset.stackTechnology),
          ),
        ids,
      );
      for (const id of ids) {
        const button = page.locator(`[data-stack-technology="${id}"]`);
        await button.click();
        assert.equal(
          await page.locator("#technology-sheet-title").textContent(),
          technologyCatalogue.find((item) => item.id === id).name,
        );
        assert(
          await page.locator(`[data-technology-info="${id}"]`).isVisible(),
        );
        await page.keyboard.press("Escape");
        await page.waitForFunction(
          () =>
            !document.querySelector("#technology-dialog").open &&
            !document.documentElement.classList.contains(
              "has-technology-dialog",
            ),
        );
        assert.equal(
          await button.evaluate((e) => e === document.activeElement),
          true,
        );
      }
      for (const width of [
        320, 360, 390, 540, 640, 768, 960, 1024, 1280, 1440, 1920, 2560,
      ]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const [index, [id]] of [
          ["all", "전체"],
          ...service.groups,
        ].entries()) {
          await page.locator(".stack-group-filter button").nth(index).click();
          assert.equal(
            await page.locator("[data-stack-part]").count(),
            id === "all"
              ? service.parts.length
              : service.parts.filter((part) => part.group === id).length,
          );
          await inspect(page, width);
          report.responsiveStates++;
        }
        await page.locator(".stack-group-filter button").first().click();
        await page
          .locator(".stack-part-detail")
          .evaluateAll((nodes) => nodes.forEach((node) => (node.open = true)));
        await inspect(page, width);
        report.responsiveStates++;
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator(".stack-group-filter button").last().click();
      await page.locator(".stack-path a").first().click();
      const target = service.paths[0].steps[0][0];
      assert.equal(
        await page
          .locator(".stack-group-filter button")
          .first()
          .getAttribute("aria-pressed"),
        "true",
      );
      assert.equal(
        await page
          .locator(`[data-stack-part="${target}"] details`)
          .getAttribute("open"),
        "",
      );
      assert.equal(
        await page
          .locator(`[data-stack-part="${target}"] h3`)
          .evaluate((e) => e === document.activeElement),
        true,
      );
      const summary = page.locator(`[data-stack-part="${target}"] summary`);
      await summary.focus();
      await page.keyboard.press("Enter");
      assert.equal(
        await page
          .locator(`[data-stack-part="${target}"] details`)
          .getAttribute("open"),
        null,
      );
      await page.locator(".stack-group-filter button").last().click();
      await page.locator(".stack-quick-map a").first().click();
      assert.equal(
        await page
          .locator(`[data-stack-part="${target}"] h3`)
          .evaluate((e) => e === document.activeElement),
        true,
      );
      await page.locator(".stack-design-link").click();
      await page.waitForFunction(
        (id) =>
          document.documentElement.dataset.route === id &&
          !document.documentElement.dataset.transitioning,
        service.id,
      );
      await page.locator(".detail-stack-entry a:visible").click();
      await settle(page);
      assert(
        await page.locator(`[data-stack-overview="${service.id}"]`).isVisible(),
      );
    }
    report.checks.push(
      "Twelve service parts keep exact products and service usage together. All eight catalogue technologies open shared dialogs and restore focus. Flow links clear filters, reveal the matching part and support keyboard disclosure.",
    );
    report.checks.push(
      "Indirect Sansa evidence, Workers endpoint limits and unidentified storage are explicit. Netflix AWS/Open Connect remain scoped entries; S3/CloudFront and comparison-project technologies never become claimed dependencies.",
    );

    const direct = `${base}/?view=stacks&service=sansa#stack-part-sansa-presence`;
    await page.goto(direct);
    await page.reload();
    assert.equal(
      await page
        .locator('[data-stack-part="presence"] details')
        .getAttribute("open"),
      "",
    );
    assert(
      Math.abs(
        await page
          .locator('[data-stack-part="presence"]')
          .evaluate((e) => e.getBoundingClientRect().top),
      ) < 150,
    );
    assert(
      (
        await page.locator('[data-stack-part="presence"]').textContent()
      ).includes("Durable Objects"),
    );
    assert.equal(
      await page
        .locator(
          '[data-stack-technology="supabase-realtime"], [data-stack-technology="firebase-rtdb"]',
        )
        .count(),
      0,
    );
    await page.goto(`${base}/?view=stacks&service=netflix`);
    assert.equal(
      await page
        .locator(
          '[data-stack-technology="s3"], [data-stack-technology="cloudfront"]',
        )
        .count(),
      0,
    );
    assert(
      (await page.locator('[data-stack-part="origin"]').textContent()).includes(
        "제품 미확인",
      ),
    );

    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.resolve(__dirname, "../docs/images/service-stack-netflix.png"),
      fullPage: true,
    });
    await page.goto(`${base}/?view=stacks&service=sansa`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.resolve(__dirname, "../docs/images/service-stack-sansa.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: path.resolve(__dirname, "../docs/images/service-stack-mobile.png"),
      fullPage: true,
    });

    const fallback = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await fallback.addInitScript(
      () => (document.startViewTransition = undefined),
    );
    await fallback.goto(base + "/");
    await fallback.locator(".library-stack-entry a").click();
    await settle(fallback);
    assert.equal(
      await fallback.locator("html").getAttribute("data-navigation-engine"),
      "instant",
    );
    await fallback.locator('[data-stack-service="netflix"]').click();
    await settle(fallback);
    await inspect(fallback, 390);

    const offline = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const requests = [];
    offline.on("pageerror", (error) => report.errors.push(error.message));
    await offline.route("**/*", (route) =>
      route.request().isNavigationRequest()
        ? route.fulfill({
            contentType: "text/html",
            body: fs.readFileSync(
              path.resolve(__dirname, "../openconnect-visual-study.html"),
            ),
          })
        : (requests.push(route.request().url()), route.abort()),
    );
    await offline.context().setOffline(true);
    await offline.goto(base + "/offline.html?view=stacks&service=sansa");
    await offline.locator('[data-stack-service="netflix"]').click();
    await settle(offline);
    await offline.locator('[data-stack-technology="freebsd"]').click();
    assert(
      await offline.locator('[data-technology-info="freebsd"]').isVisible(),
    );
    await offline.keyboard.press("Escape");
    await inspect(offline, 390);
    assert.deepEqual(requests, []);
    report.checks.push(
      "Direct part URLs open and scroll correctly after reload. Both services work without View Transitions, with reduced motion and in the standalone offline HTML.",
    );
    assert.deepEqual(report.errors, []);
    fs.writeFileSync(
      path.resolve(__dirname, "../reports/service-stacks-check.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
