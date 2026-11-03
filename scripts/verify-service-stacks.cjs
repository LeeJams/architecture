const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.ATLAS_BASE_URL || "http://127.0.0.1:4173";
const widths = [
  320, 360, 390, 540, 640, 768, 960, 1024, 1280, 1440, 1920, 2560,
];
const settle = (page, layer = "overview") =>
  page.waitForFunction(
    (layer) =>
      document.documentElement.dataset.route === "stacks" &&
      !document.documentElement.dataset.transitioning &&
      document.querySelector("#service-stacks")?.dataset.stackLayer === layer,
    layer,
  );
async function inspect(page, width) {
  const issues = await page.locator("#service-stacks").evaluate((root) =>
    [...root.querySelectorAll("p,h1,h2,h3,h4,button,dt,dd")]
      .filter((e) => e.getClientRects().length)
      .filter(
        (e) =>
          e.scrollWidth > e.clientWidth + 2 ||
          parseFloat(getComputedStyle(e).fontSize) < 12,
      )
      .map((e) => e.textContent.slice(0, 100)),
  );
  assert.deepEqual(issues, [], `Text overflow or small type at ${width}`);
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
async function screenshot(page, name, fullPage = true) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    scrollTo({ top: 0, behavior: "instant" });
  });
  await page.screenshot({
    path: path.resolve(__dirname, `../docs/images/${name}.png`),
    fullPage,
  });
}
(async () => {
  const { serviceStacks, partsInLayer, layerForPart, stackHref, stackPartId } =
    await import("../src/data/service-stacks.js");
  const { technologyCatalogue } =
    await import("../src/data/technology-catalogue.js");
  for (const service of serviceStacks) {
    assert.deepEqual(
      service.layers.map((layer) => layer.id),
      ["frontend", "server", "storage"],
    );
    assert.equal(
      service.layers.flatMap((layer) => partsInLayer(service, layer)).length,
      service.parts.length,
    );
    for (const part of service.parts) {
      assert.equal(
        service.layers.filter((layer) => layer.groups.includes(part.group))
          .length,
        1,
      );
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
            technologyCatalogue.some((tech) => tech.id === entry.id),
        ),
      );
    }
  }
  assert.deepEqual(
    partsInLayer(serviceStacks[0], serviceStacks[0].layers[0]).map(
      (part) => part.id,
    ),
    ["scene", "sync", "audio", "settings"],
  );
  assert.deepEqual(
    partsInLayer(serviceStacks[1], serviceStacks[1].layers[1]).map(
      (part) => part.id,
    ),
    ["control", "delivery", "http", "os"],
  );
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
    assert.equal(await page.locator("[data-stack-layer-link]").count(), 3);
    assert.equal(
      await page.locator("[data-stack-part]").count(),
      0,
      "Overview must not include the full detail articles.",
    );
    assert.equal(
      await page.locator('.topbar [aria-current="page"]').count(),
      1,
    );
    const frontend = page.locator('[data-stack-layer-link="frontend"]');
    assert(
      (await frontend.textContent()).includes("프론트엔드 상세 페이지로 이동"),
    );
    assert.equal(
      new URL(await frontend.getAttribute("href"), page.url()).searchParams.get(
        "layer",
      ),
      "frontend",
    );
    await frontend.focus();
    await page.keyboard.press("Enter");
    await settle(page, "frontend");
    assert.equal(
      await page.locator("#service-stacks-title").textContent(),
      "산사 · 프론트엔드",
    );
    assert.equal(
      await page
        .locator("#service-stacks-title")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    assert.equal(await page.locator("[data-stack-part]").count(), 4);
    assert((await page.title()).includes("프론트엔드"));
    await page.goBack();
    await settle(page);
    assert.equal(
      await page
        .locator('[data-stack-layer-link="frontend"]')
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.goForward();
    await settle(page, "frontend");
    await page.locator('[data-stack-detail-link="server"]').click();
    await settle(page, "server");
    assert.equal(await page.locator("[data-stack-part]").count(), 1);
    assert(
      (
        await page.locator('[data-stack-part="presence"]').textContent()
      ).includes("연결 주소만 확인"),
    );
    await page.locator(".stack-connected-parts a").first().click();
    await settle(page, "frontend");
    assert.equal(
      await page
        .locator('[data-stack-part="sync"] h3')
        .evaluate((e) => e === document.activeElement),
      true,
    );
    assert.equal(new URL(page.url()).hash, "#stack-part-sansa-sync");
    await page.locator("[data-stack-back]").click();
    await settle(page);
    await page.locator('[data-stack-service="netflix"]').click();
    await settle(page);
    await page.goBack();
    await settle(page);
    assert(await page.locator('[data-stack-overview="sansa"]').isVisible());
    await page.goForward();
    await settle(page);
    assert(await page.locator('[data-stack-overview="netflix"]').isVisible());
    for (let i = 0; i < 2; i++) {
      await page
        .locator('[data-stack-layer-link="frontend"]')
        .evaluate((e) => e.click());
      await page.goBack();
      await settle(page);
      assert.equal(new URL(page.url()).searchParams.has("layer"), false);
    }
    const transitions = await page.evaluate(() => window.__stackTransitions);
    assert(transitions.filter((item) => !item.error).length >= 8);
    assert(
      transitions.every((item) => item.ready || item.error?.includes("skip")),
    );
    report.checks.push(
      "Overview cards navigate to separate frontend/server/storage pages using native transitions. Keyboard entry, title/focus, Back/Forward, return-card focus and immediate cancellation preserve URL/view consistency.",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const service of serviceStacks) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(base + "/" + stackHref(service.id));
        await settle(page);
        assert.equal(await page.locator("[data-stack-part]").count(), 0);
        assert.equal(
          await page.locator(".stack-layer-preview li").count(),
          service.parts.length,
        );
        await inspect(page, width);
        report.responsiveStates++;
        for (const layer of service.layers) {
          await page
            .locator(`[data-stack-layer-link="${layer.id}"]`)
            .evaluate((e) => e.click());
          await settle(page, layer.id);
          assert.deepEqual(
            await page
              .locator("[data-stack-part]")
              .evaluateAll((nodes) =>
                nodes.map((node) => node.dataset.stackPart),
              ),
            partsInLayer(service, layer).map((part) => part.id),
          );
          assert.equal(
            await page
              .locator('.stack-layer-navigation [aria-current="page"]')
              .count(),
            1,
          );
          for (const part of partsInLayer(service, layer)) {
            assert(
              (
                await page
                  .locator(`[data-stack-part="${part.id}"]`)
                  .textContent()
              ).includes(part.detail),
            );
          }
          await inspect(page, width);
          report.responsiveStates++;
          await page.locator("[data-stack-back]").evaluate((e) => e.click());
          await settle(page);
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const layer of service.layers) {
        await page.goto(base + "/" + stackHref(service.id, layer.id));
        await settle(page, layer.id);
        const ids = [
          ...new Set(
            partsInLayer(service, layer)
              .flatMap((part) => part.technologies)
              .map((entry) => entry.id)
              .filter(Boolean),
          ),
        ];
        for (const id of ids) {
          const button = page.locator(`[data-stack-technology="${id}"]`);
          await button.click();
          assert.equal(
            await page.locator("#technology-sheet-title").textContent(),
            technologyCatalogue.find((tech) => tech.id === id).name,
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
      }
      await page.goto(base + "/" + stackHref(service.id));
      for (let index = 0; index < service.paths.length; index++) {
        const part = service.parts.find(
          (part) => part.id === service.paths[index].steps[0][0],
        );
        await page
          .locator(".stack-path")
          .nth(index)
          .locator("a")
          .first()
          .click();
        await settle(page, layerForPart(service, part).id);
        assert.equal(
          await page
            .locator(`[data-stack-part="${part.id}"] h3`)
            .evaluate((e) => e === document.activeElement),
          true,
        );
        await page.locator("[data-stack-back]").click();
        await settle(page);
      }
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
      "Both overviews and six detail pages fit 96 states across 320–2560px. All twelve parts keep the detailed rationale, processing, evidence boundaries and exact technology marks; all eight catalogue technologies reuse the common dialog.",
    );
    for (const query of [
      "?view=stacks&service=sansa&layer=server#stack-part-sansa-presence",
      "?view=stacks&service=sansa#stack-part-sansa-presence",
    ]) {
      await page.goto(base + "/" + query);
      await page.reload();
      await settle(page, "server");
      await page.evaluate(() => document.fonts.ready);
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
    }
    await page.goto(base + "/?view=stacks&service=sansa&layer=storage");
    assert(
      (await page.locator('[data-stack-part="data"]').textContent()).includes(
        "제품 미확인",
      ),
    );
    await page.goto(base + "/?view=stacks&service=netflix&layer=unknown");
    await settle(page);
    assert.equal(await page.locator("[data-stack-layer-link]").count(), 3);
    for (const service of serviceStacks) {
      const ids = service.parts
        .flatMap((part) => part.technologies)
        .map((entry) => entry.id);
      assert(
        !ids.includes("s3") &&
          !ids.includes("cloudfront") &&
          !ids.includes("supabase-realtime") &&
          !ids.includes("firebase-rtdb"),
      );
    }
    report.checks.push(
      "Canonical detail URLs and previous part bookmarks survive reload. Client storage stays in the frontend; Workers is endpoint evidence, and unidentified backend storage stays explicit. Alternative technologies do not become claimed dependencies.",
    );
    await page.setViewportSize({ width: 1440, height: 1100 });
    for (const id of ["sansa", "netflix"]) {
      await page.goto(base + "/" + stackHref(id));
      await settle(page);
      await screenshot(page, `service-stack-${id}`);
    }
    await page.goto(base + "/" + stackHref("sansa", "frontend"));
    await settle(page, "frontend");
    await screenshot(page, "service-stack-frontend");
    await page.goto(base + "/" + stackHref("netflix", "server"));
    await settle(page, "server");
    await screenshot(page, "service-stack-server");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/" + stackHref("sansa"));
    await settle(page);
    await screenshot(page, "service-stack-mobile");
    await page.locator('[data-stack-layer-link="frontend"]').click();
    await settle(page, "frontend");
    await screenshot(page, "service-stack-detail-mobile");
    const fallback = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    fallback.on("pageerror", (error) => report.errors.push(error.message));
    await fallback.addInitScript(
      () => (document.startViewTransition = undefined),
    );
    await fallback.goto(base + "/");
    await fallback.locator(".library-stack-entry a").click();
    await settle(fallback);
    await fallback.locator('[data-stack-layer-link="server"]').click();
    await settle(fallback, "server");
    assert.equal(
      await fallback.locator("html").getAttribute("data-navigation-engine"),
      "instant",
    );
    await inspect(fallback, 390);
    const offline = await browser.newPage({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      }),
      requests = [];
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
    await offline.locator('[data-stack-layer-link="server"]').click();
    await settle(offline, "server");
    await offline.locator('[data-stack-technology="freebsd"]').click();
    assert(
      await offline.locator('[data-technology-info="freebsd"]').isVisible(),
    );
    await offline.keyboard.press("Escape");
    await inspect(offline, 390);
    assert.deepEqual(requests, []);
    report.checks.push(
      "Layer navigation, shared dialogs, source marks and local assets work with reduced motion, without View Transitions and in the standalone HTML with no runtime network requests.",
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
