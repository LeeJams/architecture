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

const AppContext = createContext(null);
const routeFromURL = () =>
  new URLSearchParams(location.search).get("view") === "technologies"
    ? "catalogue"
    : new URLSearchParams(location.search).get("case") === "netflix"
      ? "netflix"
      : "library";
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
    if (target && document.getElementById("design")?.contains(target))
      target.scrollIntoView({ block: "start", behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const presentRoute = useCallback(
    async (route) => {
      const nav = navigation.current,
        sequence = ++nav.sequence;
      nav.transition?.skipTransition();
      document.querySelector("#technology-dialog")?.close();
      document.querySelector("#zoom-dialog")?.close();
      document.documentElement.dataset.transitioning = "true";
      const update = async () => {
        if (sequence !== nav.sequence) return;
        flushSync(() =>
          patch({
            route,
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
          document
            .getElementById(
              route === "netflix"
                ? "case-title"
                : route === "catalogue"
                  ? "technology-library-title"
                  : "netflix-card",
            )
            ?.focus({ preventScroll: true });
        }
      }
    },
    [scrollToRoute],
  );
  const followRoute = useCallback(
    (event, route) => {
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
        !document.documentElement.dataset.transitioning
      )
        return window.scrollTo({ top: 0, behavior: scrollBehavior() });
      if (current.current.route === "library")
        navigation.current.libraryY = scrollY;
      if (current.current.route === "catalogue")
        navigation.current.catalogueY = scrollY;
      const url = new URL(location.href);
      url.hash = "";
      url.searchParams.delete("view");
      if (route === "catalogue") url.searchParams.set("view", "technologies");
      if (route === "netflix") url.searchParams.set("case", "netflix");
      else url.searchParams.delete("case");
      history.pushState({ atlasRoute: route }, "", url);
      presentRoute(route).catch((error) =>
        console.error("Navigation failed", error),
      );
    },
    [presentRoute],
  );
  useLayoutEffect(() => {
    document.documentElement.dataset.route = state.route;
    document.title =
      state.route === "catalogue"
        ? "기술 목록 · 아키텍처 노트"
        : state.route === "library"
          ? "아키텍처 노트 · 서비스의 구조와 기술"
          : "넷플릭스, 재생 버튼 뒤의 설계 · 아키텍처 노트";
  }, [state.route]);
  useEffect(() => {
    history.scrollRestoration = "manual";
    const historyChange = () => {
      const route = routeFromURL();
      if (
        route === current.current.route &&
        !document.documentElement.dataset.transitioning
      ) {
        flushSync(() =>
          patch({
            note: noteFromURL(current.current.note),
            sheet: null,
            zoom: null,
          }),
        );
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
