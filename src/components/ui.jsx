import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { useApp } from "../state/AppState.jsx";

export const activate = (event, callback) => {
  if (["Enter", " "].includes(event.key)) {
    event.preventDefault();
    callback();
  }
};
export function ActionIcon({ kind = "dialog" }) {
  return (
    <svg
      className="action-icon"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "dialog" ? (
        <>
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M3 7h14M6 5h.01M9 5h.01" />
        </>
      ) : (
        <path
          d={
            kind === "down" ? "M10 3v13M5 11l5 5 5-5" : "M3 10h13M11 5l5 5-5 5"
          }
        />
      )}
    </svg>
  );
}
export function Reveal({ children, identity, className, ...props }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      key={identity}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      {...props}
    >
      {children}
    </m.div>
  );
}
export function ReadLink({ tech, children, ...props }) {
  const { readTech } = useApp();
  return (
    <a
      href={`#tech-${tech}`}
      data-read-tech={tech}
      onClick={(event) => {
        if (
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        readTech(tech);
      }}
      {...props}
    >
      {children || (
        <>
          본문의 동작 원리로 이동 <ActionIcon kind="down" />
        </>
      )}
    </a>
  );
}
export function Code({ children, label }) {
  return (
    <div className="note-code">
      <span>{label}</span>
      <pre tabIndex="0" aria-label={label}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
export function useRovingTabs(keys, selected, onSelect) {
  const refs = useRef({});
  const onKeyDown = (event) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    const focused = keys.findIndex(
      (key) => refs.current[key] === event.target.closest('[role="tab"]'),
    );
    const index = focused < 0 ? keys.indexOf(selected) : focused,
      direction = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
    const next =
      event.key === "Home"
        ? keys[0]
        : event.key === "End"
          ? keys.at(-1)
          : keys[(index + direction + keys.length) % keys.length];
    onSelect(next);
    refs.current[next]?.focus({ preventScroll: true });
  };
  return { refs, onKeyDown };
}
