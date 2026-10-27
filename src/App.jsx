import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import { AppProvider, useApp } from "./state/AppState.jsx";
import {
  GlossaryProvider,
  GlossarySwitch,
  GlossaryGuide,
} from "./components/Glossary.jsx";
import { Library } from "./components/Library.jsx";
import { DesignPage } from "./components/DesignPage.jsx";
import { TechnologyDialog } from "./components/TechnologyDialog.jsx";
import { ZoomDialog } from "./components/References.jsx";
export function Providers({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AppProvider>
          <GlossaryProvider>{children}</GlossaryProvider>
        </AppProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
function Site() {
  const { state, followRoute } = useApp();
  return (
    <>
      <a
        className="skip-link"
        href={state.route === "library" ? "#library-title" : "#case-title"}
      >
        본문으로 바로가기
      </a>
      <header className="topbar">
        <a
          className="wordmark"
          href="?"
          data-home
          onClick={(event) => followRoute(event, "library")}
        >
          아키텍처 노트
        </a>
        <GlossarySwitch />
      </header>
      <main id="main-content">
        <GlossaryGuide />
        <Library />
        <DesignPage />
      </main>
      <ZoomDialog />
      <TechnologyDialog />
      <div className="toast" id="toast" role="status" hidden />
    </>
  );
}
export default function App() {
  return (
    <Providers>
      <Site />
    </Providers>
  );
}
