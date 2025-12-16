import { useCallback, useEffect, useRef, useState } from "react";
import HeroSection from "./homepage/herosection";
import NewYearHeroSection from "./homepage/newyearherosection";

export default function App() {
  const [page, setPage] = useState<"christmas" | "newyear">("christmas");
  const [renderPage, setRenderPage] = useState<"christmas" | "newyear">("christmas");
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  const pageRef = useRef<"christmas" | "newyear">("christmas");
  const renderRef = useRef<"christmas" | "newyear">("christmas");
  const timers = useRef<{ out?: number; in?: number }>({});

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    renderRef.current = renderPage;
  }, [renderPage]);

  const navigate = useCallback((to: "christmas" | "newyear") => {
    if (to === pageRef.current && to === renderRef.current) return;

    if (timers.current.out) window.clearTimeout(timers.current.out);
    if (timers.current.in) window.clearTimeout(timers.current.in);

    setPhase("out");

    timers.current.out = window.setTimeout(() => {
      setPage(to);
      setRenderPage(to);
      setPhase("in");

      timers.current.in = window.setTimeout(() => {
        setPhase("idle");
      }, 300);
    }, 220);
  }, []);

  useEffect(() => {
    const onNav = (e: Event) => {
      const d = (e as CustomEvent).detail as { page?: "christmas" | "newyear" } | undefined;
      if (d?.page) navigate(d.page);
    };
    window.addEventListener("app:navigate", onNav as EventListener);
    return () => window.removeEventListener("app:navigate", onNav as EventListener);
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (timers.current.out) window.clearTimeout(timers.current.out);
      if (timers.current.in) window.clearTimeout(timers.current.in);
    };
  }, []);

  const content =
    renderPage === "newyear" ? <NewYearHeroSection /> : <HeroSection onNewYear={() => navigate("newyear")} />;

  return (
    <>
      <style>{`
        .app-page {
          width: 100%;
          min-height: 100vh;
        }
        .app-out {
          animation: appPageOut 220ms ease forwards;
        }
        .app-in {
          animation: appPageIn 300ms ease forwards;
        }
        @keyframes appPageOut {
          from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          to { opacity: 0; transform: translateY(10px) scale(0.99); filter: blur(2px); }
        }
        @keyframes appPageIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.99); filter: blur(2px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .app-out, .app-in { animation: none !important; }
        }
      `}</style>

      <div className={`app-page ${phase === "out" ? "app-out" : phase === "in" ? "app-in" : ""}`}>
        {content}
      </div>
    </>
  );
}
