import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { glossaryEntries } from "../data/glossary.js";

const Context = createContext(null);
const entries = new Map(glossaryEntries.map((entry) => [entry.id, entry]));
const aliases = new Map(
  glossaryEntries.flatMap((entry) =>
    entry.aliases.map((alias) => [alias, entry.id]),
  ),
);
const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(
  [...aliases.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapePattern)
    .join("|"),
  "g",
);
const excluded = new Set([
  "a",
  "button",
  "code",
  "pre",
  "svg",
  "label",
  "input",
  "textarea",
  "select",
  "nav",
]);

export function GlossaryProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("atlas.glossary.enabled") === "true";
    } catch {
      return false;
    }
  });
  const [explanation, setExplanation] = useState(null);
  const close = useCallback(
    (restore = false) =>
      setExplanation((previous) => {
        if (restore && previous?.anchor.isConnected)
          previous.anchor.focus({ preventScroll: true });
        return null;
      }),
    [],
  );
  const toggle = useCallback(() => {
    close();
    setEnabled((previous) => !previous);
  }, [close]);
  useEffect(() => {
    try {
      localStorage.setItem("atlas.glossary.enabled", String(enabled));
    } catch {
      /* Keep the preference in memory when storage is unavailable. */
    }
  }, [enabled]);
  const show = useCallback(
    (key, anchor) => {
      if (!enabled || !entries.has(key)) return;
      setExplanation((previous) =>
        previous?.anchor === anchor
          ? null
          : {
              entry: entries.get(key),
              anchor,
              container: anchor.closest("dialog[open]") || document.body,
            },
      );
    },
    [enabled],
  );
  return (
    <Context.Provider value={{ enabled, toggle, explanation, show, close }}>
      {children}
      {explanation && (
        <Explanation
          key={explanation.entry.id + explanation.container.id}
          {...explanation}
          close={close}
        />
      )}
    </Context.Provider>
  );
}
export function GlossarySwitch() {
  const { enabled, toggle } = useContext(Context);
  return (
    <button
      className="glossary-toggle"
      type="button"
      role="switch"
      aria-checked={enabled}
      title={enabled ? "용어 설명 끄기" : "용어 설명 켜기"}
      data-glossary-toggle
      onClick={toggle}
    >
      <span>용어 설명</span>
      <span className="glossary-track" aria-hidden="true" />
      <span data-glossary-state aria-hidden="true">
        {enabled ? "켬" : "끔"}
      </span>
    </button>
  );
}
export function GlossaryTerm({ term, children }) {
  const { show, explanation } = useContext(Context);
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      className="glossary-term"
      type="button"
      data-glossary-term={term}
      aria-label={`${children} 뜻 보기`}
      aria-haspopup="dialog"
      aria-expanded={explanation?.anchor === ref.current}
      aria-controls="glossary-popover"
      onClick={(event) => show(term, event.currentTarget)}
    >
      {children}
      <span className="glossary-mark" aria-hidden="true">
        ?
      </span>
    </button>
  );
}
export function GlossaryGuide({ sheet = false }) {
  const { enabled } = useContext(Context);
  return sheet ? (
    <p
      className="sheet-glossary-guide"
      data-glossary-ui
      data-glossary-hint
      hidden={!enabled}
    >
      물음표가 붙은 용어를 누르면 뜻과 예시가 나옵니다.
    </p>
  ) : (
    <aside
      className="glossary-guide"
      data-glossary-ui
      data-glossary-hint
      hidden={!enabled}
    >
      <p>물음표가 붙은 용어를 누르면 뜻과 예시가 나옵니다.</p>
      <GlossaryTerm term="bitrate">비트레이트</GlossaryTerm>
    </aside>
  );
}
// Annotate text as React elements. Never mutate React-owned DOM or place buttons inside controls/code.
export function RichText({ children }) {
  const { enabled } = useContext(Context);
  if (!enabled) return children;
  const seen = new Set();
  function annotate(text) {
    let end = 0;
    const parts = [];
    for (const match of text.matchAll(pattern)) {
      const key = aliases.get(match[0]);
      if (seen.has(key) || seen.size >= 3) continue;
      if (
        /^[A-Za-z]/.test(match[0]) &&
        /[A-Za-z0-9_]/.test(text[match.index - 1] || "")
      )
        continue;
      if (
        /[A-Za-z0-9_]$/.test(match[0]) &&
        /[A-Za-z0-9_]/.test(text[match.index + match[0].length] || "")
      )
        continue;
      parts.push(
        text.slice(end, match.index),
        <GlossaryTerm key={match.index} term={key}>
          {match[0]}
        </GlossaryTerm>,
      );
      seen.add(key);
      end = match.index + match[0].length;
    }
    if (!end) return text;
    return (
      <Fragment>
        {parts}
        {text.slice(end)}
      </Fragment>
    );
  }
  function walk(nodes) {
    return Children.map(nodes, (node) => {
      if (typeof node === "string") return annotate(node);
      if (
        !isValidElement(node) ||
        typeof node.type !== "string" ||
        excluded.has(node.type) ||
        node.props["data-glossary-ui"]
      )
        return node;
      return cloneElement(node, {}, walk(node.props.children));
    });
  }
  return walk(children);
}
export function Text({ as: Tag = "p", children, ...props }) {
  return (
    <Tag {...props}>
      <RichText>{children}</RichText>
    </Tag>
  );
}
export function TechnicalText({ children }) {
  return (
    <RichText>
      {String(children)
        .split(/(`[^`]+`)/g)
        .map((part, index) =>
          part.startsWith("`") ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : (
            part
          ),
        )}
    </RichText>
  );
}
function Explanation({ entry, anchor, container, close }) {
  const ref = useRef(null);
  const position = useCallback(() => {
    const popover = ref.current;
    if (
      !popover ||
      !anchor.isConnected ||
      anchor.closest("[hidden]") ||
      anchor.closest("dialog:not([open])")
    )
      return close();
    const rect = anchor.getBoundingClientRect(),
      card = popover.getBoundingClientRect();
    const clip = anchor
      .closest("#technology-sheet-scroll,.detail-content")
      ?.getBoundingClientRect();
    if (
      rect.bottom < Math.max(0, clip?.top || 0) ||
      rect.top > Math.min(innerHeight, clip?.bottom || innerHeight)
    )
      return close();
    popover.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - card.width - 12))}px`;
    popover.style.top = `${rect.bottom + 8 + card.height <= innerHeight - 12 ? rect.bottom + 8 : Math.max(12, rect.top - card.height - 8)}px`;
  }, [anchor, close]);
  useLayoutEffect(() => {
    const popover = ref.current;
    if (popover.showPopover) popover.showPopover();
    position();
    popover.querySelector("h3").focus({ preventScroll: true });
    return () => {
      if (popover.hidePopover && popover.matches(":popover-open"))
        popover.hidePopover();
    };
  }, [position]);
  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      }
    };
    const scroll = (event) => {
      if (!ref.current?.contains(event.target)) position();
    };
    const modalClosed = (event) => {
      if (event.target.contains(anchor)) close();
    };
    const outside = (event) => {
      if (
        !ref.current?.contains(event.target) &&
        event.target !== anchor &&
        !anchor.contains(event.target)
      )
        close();
    };
    document.addEventListener("keydown", escape, true);
    document.addEventListener("scroll", scroll, true);
    document.addEventListener("close", modalClosed, true);
    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("resize", position);
    window.addEventListener("popstate", close);
    return () => {
      document.removeEventListener("keydown", escape, true);
      document.removeEventListener("scroll", scroll, true);
      document.removeEventListener("close", modalClosed, true);
      document.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("resize", position);
      window.removeEventListener("popstate", close);
    };
  }, [position, anchor, close]);
  return createPortal(
    <div
      ref={ref}
      className="glossary-popover"
      id="glossary-popover"
      popover="auto"
      role="dialog"
      aria-labelledby="glossary-word"
      data-glossary-ui
      onToggle={(event) => {
        if (
          event.newState === "closed" &&
          !ref.current?.matches(":popover-open")
        )
          close();
      }}
    >
      <div className="glossary-popover-header">
        <div>
          <p className="glossary-eyebrow">용어 설명</p>
          <h3 id="glossary-word" tabIndex="-1">
            {entry.label}
          </h3>
        </div>
        <button
          className="glossary-popover-close"
          type="button"
          data-close-glossary
          onClick={() => close(true)}
        >
          닫기
        </button>
      </div>
      <p id="glossary-meaning">{entry.meaning}</p>
      <div className="glossary-example">
        <strong>예를 들면</strong>
        <p id="glossary-example">{entry.example}</p>
      </div>
      <p id="glossary-note">{entry.note}</p>
    </div>,
    container,
  );
}
