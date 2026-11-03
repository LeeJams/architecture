import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { flushSync } from "react-dom";
import {
  components,
  technologies,
  playbackJourney,
} from "../data/architecture.js";
import { technologyNotes } from "../data/technology-notes.js";
import {
  alternativeCategories,
  replacementSources,
} from "../data/alternatives.js";
import {
  findServiceStack,
  findStackLayer,
  layerForPart,
  stackPartId,
} from "../data/service-stacks.js";

const AppContext = createContext(null);
const routeFromURL = () => {
  const params = new URLSearchParams(location.search);
  if (params.get("view") === "stacks") return "stacks";
  if (params.get("view") === "technologies") return "catalogue";
  return ["netflix", "sansa"].includes(params.get("case"))
    ? params.get("case")
    : "library";
};
const stackServiceFromURL = () =>
  new URLSearchParams(location.search).get("service") === "netflix"
    ? "netflix"
    : "sansa";
const stackLayerFromURL = () => {
  const service = findServiceStack(stackServiceFromURL());
  const part = service.parts.find(
    (item) => `#${stackPartId(service.id, item.id)}` === location.hash,
  );
  return part
    ? layerForPart(service, part).id
    : findStackLayer(service, new URLSearchParams(location.search).get("layer"))
        ?.id || null;
};
const noteFromURL = (fallback = "oca") =>
  technologyNotes.find((item) => location.hash === `#tech-${item.key}`)?.key ||
  fallback;
export const scrollBehavior = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
export const alternativeCategoryFor = (key) =>
  ({
    oca: "delivery",
    nginx: "http",
    freebsd: "os",
    aws: "cloud",
    playback: "cloud",
    origin: "storage",
  })[key] || "all";
export function replacementLinkLabel(key) {
  const category = alternativeCategoryFor(key);
  return category === "storage"
    ? "원본 저장 예시로 이동"
    : replacementSources[category]
      ? `${replacementSources[category].name} 대체 목록으로 이동`
      : "전체 대체 목록으로 이동";
}
export const noteKeyFor = (node, technology) =>
  technology ||
  { player: "abr", playback: "aws", origin: "fill", fallback: "steering" }[
    node
  ] ||
  node;
const initialState = () => ({
  route: routeFromURL(),
  stackService: stackServiceFromURL(),
  stackLayer: stackLayerFromURL(),
  catalogueCategory: "all",
  catalogueQuery: "",
  node: "oca",
  technology: null,
  panel: "role",
  step: -1,
  playing: false,
  failover: false,
  note: noteFromURL(),
  layer: "nginx",
  category: "delivery",
  storageOpen: false,
  sheet: null,
  zoom: null,
});
const reducer = (state, patch) => ({ ...state, ...patch });

export function AppProvider({ children }) {
  const [state, patch] = useReducer(reducer, undefined, initialState);
  const current = useRef(state);
  current.current = state;
  const navigation = useRef({
    sequence: 0,
    transition: null,
    libraryY: 0,
    catalogueY: 0,
    libraryCard: "netflix-card",
    stackOverviewY: {},
    stackReturn: null,
  });
  const centerNode = useCallback((id) => {
    const viewport = document.querySelector(".diagram-viewport");
    const node = document.querySelector(`[data-node="${id}"]`);
    if (!node || !viewport || viewport.scrollWidth <= viewport.clientWidth + 1)
      return;
    const rect = node.getBoundingClientRect(),
      parent = viewport.getBoundingClientRect();
    viewport.scrollTo({
      left:
        viewport.scrollLeft +
        rect.left -
        parent.left -
        (viewport.clientWidth - rect.width) / 2,
      behavior: "instant",
    });
  }, []);
  const selectNode = useCallback(
    (node, options = {}) => {
      if (!components[node]) return;
      patch({ node, technology: null, playing: false, step: -1, ...options });
      if (options.reveal !== false) centerNode(node);
    },
    [centerNode],
  );
  const selectTech = useCallback(
    (key) => {
      const tech = technologies.find((item) => item.key === key);
      if (!tech) return;
      patch({
        node: tech.node,
        technology: key,
        panel: "role",
        step: -1,
        playing: false,
        ...(["nginx", "freebsd"].includes(key) ? { layer: key } : {}),
      });
      centerNode(tech.node);
    },
    [centerNode],
  );
  const selectStep = useCallback(
    (index) => {
      const step = playbackJourney[index];
      if (!step) return;
      const node =
        current.current.failover && index === 8 ? "fallback" : step.node;
      patch({
        step: index,
        node,
        technology: null,
        panel: "role",
        playing: false,
      });
      centerNode(node);
    },
    [centerNode],
  );
  const openTech = useCallback(
    (key) =>
      patch({
        playing: false,
        zoom: null,
        sheet: { kind: "technology", key: noteKeyFor(key) },
      }),
    [],
  );
  const closeSheet = useCallback(() => patch({ sheet: null }), []);
  const updateHash = useCallback((hash, push = false) => {
    const url = new URL(location.href);
    url.hash = hash;
    if (url.href !== location.href)
      history[push ? "pushState" : "replaceState"](
        { atlasRoute: current.current.route },
        "",
        url,
      );
  }, []);
  const readTech = useCallback(
    (key, { reveal = true, focus = true, push = true } = {}) => {
      if (!technologyNotes.some((item) => item.key === key)) return;
      updateHash(`tech-${key}`, push);
      // Closing native dialogs restores focus synchronously before moving to the article.
      document.querySelector("#technology-dialog")?.close();
      flushSync(() => patch({ note: key, playing: false, sheet: null }));
      const panel = document.getElementById(`tech-${key}`);
      if (focus) panel?.querySelector("h3")?.focus({ preventScroll: true });
      if (reveal)
        panel?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
    },
    [updateHash],
  );
  const showAlternatives = useCallback((category) => {
    document.querySelector("#technology-dialog")?.close();
    const storage = category === "storage";
    flushSync(() =>
      patch({
        sheet: null,
        playing: false,
        storageOpen: storage,
        ...(!storage
          ? {
              category: alternativeCategories.some(([key]) => key === category)
                ? category
                : "all",
            }
          : {}),
      }),
    );
    const target = document.getElementById(
      storage ? "storage-implementations" : "alternatives",
    );
    target?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
    document
      .getElementById(storage ? "storage-examples-title" : "alternatives-title")
      ?.focus({ preventScroll: true });
  }, []);
  const locateTech = useCallback(
    (key) => {
      const tech = technologyNotes.find((item) => item.key === key);
      if (!tech) return;
      if (technologies.some((item) => item.key === key)) selectTech(key);
      else selectNode(tech.node, { panel: "role" });
      updateHash("architecture", true);
      const target = document.querySelector(
        innerWidth < 1440 ? ".inspector" : "#architecture",
      );
      target?.scrollIntoView({ block: "start", behavior: scrollBehavior() });
      document.getElementById("detail-title")?.focus({ preventScroll: true });
    },
    [selectNode, selectTech, updateHash],
  );
  const scrollToRoute = useCallback((route) => {
    if (route === "library" || route === "catalogue")
      return window.scrollTo({
        top:
          route === "library"
            ? navigation.current.libraryY
            : navigation.current.catalogueY,
        behavior: "instant",
      });
    let id = "";
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      /* Ignore malformed fragments. */
    }
    const target = document.getElementById(id);
    if (route === "stacks" && !id && !stackLayerFromURL()) {
      window.scrollTo({
        top: navigation.current.stackOverviewY[stackServiceFromURL()] || 0,
        behavior: "instant",
      });
      if (navigation.current.stackReturn)
        document
          .getElementById(`stack-layer-card-${navigation.current.stackReturn}`)
          ?.scrollIntoView({ block: "nearest", behavior: "instant" });
      return;
    }
    if (
      target &&
      (document.getElementById("design")?.contains(target) ||
        document.getElementById("sansa-design")?.contains(target) ||
        document.getElementById("service-stacks")?.contains(target))
    )
      target.scrollIntoView({ block: "start", behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const presentRoute = useCallback(
    async (route) => {
      const nav = navigation.current,
        sequence = ++nav.sequence;
      nav.stackReturn =
        route === "stacks" &&
        current.current.route === "stacks" &&
        current.current.stackService === stackServiceFromURL() &&
        current.current.stackLayer &&
        !stackLayerFromURL()
          ? current.current.stackLayer
          : null;
      if (current.current.route === "stacks" && !current.current.stackLayer)
        nav.stackOverviewY[current.current.stackService] = scrollY;
      if (["netflix", "sansa"].includes(current.current.route))
        nav.libraryCard = `${current.current.route}-card`;
      nav.transition?.skipTransition();
      document.querySelector("#technology-dialog")?.close();
      document.querySelector("#zoom-dialog")?.close();
      document.documentElement.dataset.transitioning = "true";
      const update = async () => {
        if (sequence !== nav.sequence) return;
        flushSync(() =>
          patch({
            route,
            stackService:
              route === "stacks"
                ? stackServiceFromURL()
                : current.current.stackService,
            stackLayer: route === "stacks" ? stackLayerFromURL() : null,
            playing: false,
            sheet: null,
            zoom: null,
            failover: false,
            step: -1,
            node: "oca",
            panel: "role",
            technology: null,
            note: noteFromURL(current.current.note),
          }),
        );
        await document.fonts.ready;
        await Promise.all(
          [...document.querySelectorAll(".case-cover img, .detail-cover img")]
            .filter((image) => image.getClientRects().length)
            .map((image) => image.decode().catch(() => {})),
        );
        if (sequence === nav.sequence) scrollToRoute(route);
      };
      try {
        if (
          document.startViewTransition &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          document.documentElement.dataset.navigationEngine = "view-transition";
          const transition = document.startViewTransition(update);
          nav.transition = transition;
          transition.ready.catch(() => {});
          await transition.finished;
        } else {
          document.documentElement.dataset.navigationEngine = "instant";
          await update();
        }
      } finally {
        if (sequence === nav.sequence) {
          nav.transition = null;
          delete document.documentElement.dataset.transitioning;
          const stackTarget =
            route === "stacks"
              ? document
                  .getElementById(location.hash.slice(1))
                  ?.querySelector("h3")
              : null;
          (
            stackTarget ||
            document.getElementById(
              route === "netflix"
                ? "case-title"
                : route === "sansa"
                  ? "sansa-title"
                  : route === "catalogue"
                    ? "technology-library-title"
                    : route === "stacks"
                      ? nav.stackReturn
                        ? `stack-layer-card-${nav.stackReturn}`
                        : "service-stacks-title"
                      : nav.libraryCard,
            )
          )?.focus({ preventScroll: true });
          // Native transitions may adjust scroll after the update snapshot.
          scrollToRoute(route);
        }
      }
    },
    [scrollToRoute],
  );
  const followRoute = useCallback(
    (
      event,
      route,
      { service = current.current.stackService, layer = null, hash = "" } = {},
    ) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      if (
        route === current.current.route &&
        (route !== "stacks" ||
          (service === current.current.stackService &&
            layer === current.current.stackLayer &&
            location.hash === (hash ? `#${hash}` : ""))) &&
        !document.documentElement.dataset.transitioning
      )
        return hash
          ? scrollToRoute(route)
          : window.scrollTo({ top: 0, behavior: scrollBehavior() });
      if (current.current.route === "library")
        navigation.current.libraryY = scrollY;
      if (current.current.route === "catalogue")
        navigation.current.catalogueY = scrollY;
      const url = new URL(location.href);
      url.hash = route === "stacks" ? hash : "";
      url.searchParams.delete("view");
      url.searchParams.delete("service");
      url.searchParams.delete("layer");
      if (route === "catalogue") url.searchParams.set("view", "technologies");
      if (route === "stacks") {
        url.searchParams.set("view", "stacks");
        url.searchParams.set("service", service);
        if (layer) url.searchParams.set("layer", layer);
      }
      if (["netflix", "sansa"].includes(route))
        url.searchParams.set("case", route);
      else url.searchParams.delete("case");
      history.pushState({ atlasRoute: route }, "", url);
      presentRoute(route).catch((error) =>
        console.error("Navigation failed", error),
      );
    },
    [presentRoute, scrollToRoute],
  );
  useLayoutEffect(() => {
    document.documentElement.dataset.route = state.route;
    const stackLayer = findStackLayer(
      findServiceStack(state.stackService),
      state.stackLayer,
    );
    document.title =
      state.route === "catalogue"
        ? "기술 목록 · 아키텍처 노트"
        : state.route === "stacks"
          ? `${state.stackService === "netflix" ? "넷플릭스" : "산사"}${stackLayer ? ` · ${stackLayer.name}` : "의 서비스 스택"} · 아키텍처 노트`
          : state.route === "library"
            ? "아키텍처 노트 · 서비스의 구조와 기술"
            : state.route === "sansa"
              ? "산사, 같은 방에서 움직임이 공유되는 방식 · 아키텍처 노트"
              : "넷플릭스, 재생 버튼 뒤의 설계 · 아키텍처 노트";
  }, [state.route, state.stackService, state.stackLayer]);
  useEffect(() => {
    history.scrollRestoration = "manual";
    const historyChange = () => {
      const route = routeFromURL();
      const stackChanged =
        route === "stacks" &&
        (stackServiceFromURL() !== current.current.stackService ||
          stackLayerFromURL() !== current.current.stackLayer);
      if (
        route === current.current.route &&
        !stackChanged &&
        !document.documentElement.dataset.transitioning
      ) {
        flushSync(() =>
          patch({
            note: noteFromURL(current.current.note),
            sheet: null,
            zoom: null,
          }),
        );
        if (route === "stacks")
          document
            .getElementById(location.hash.slice(1))
            ?.querySelector("h3")
            ?.focus({ preventScroll: true });
        scrollToRoute(route);
      } else presentRoute(route).catch(console.error);
    };
    const visibility = () => {
      if (document.hidden) patch({ playing: false });
    };
    window.addEventListener("popstate", historyChange);
    window.addEventListener("hashchange", historyChange);
    document.addEventListener("visibilitychange", visibility);
    document.fonts.ready.then(() => scrollToRoute(current.current.route));
    return () => {
      window.removeEventListener("popstate", historyChange);
      window.removeEventListener("hashchange", historyChange);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [presentRoute, scrollToRoute]);
  useEffect(() => {
    if (!state.playing) return;
    const timer = setInterval(() => {
      const index = (current.current.step + 1) % playbackJourney.length;
      patch({
        step: index,
        node: playbackJourney[index].node,
        technology: null,
        panel: "role",
      });
      centerNode(playbackJourney[index].node);
    }, 2400);
    return () => clearInterval(timer);
  }, [state.playing, centerNode]);
  const value = useMemo(
    () => ({
      state,
      patch,
      followRoute,
      selectNode,
      selectTech,
      selectStep,
      openTech,
      closeSheet,
      readTech,
      locateTech,
      showAlternatives,
    }),
    [
      state,
      followRoute,
      selectNode,
      selectTech,
      selectStep,
      openTech,
      closeSheet,
      readTech,
      locateTech,
      showAlternatives,
    ],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
