import { useEffect, useMemo, useState } from "react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export default function HeroSection() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 70 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 10,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 8,
        opacity: 0.35 + Math.random() * 0.55,
        drift: -20 + Math.random() * 40,
      })),
    []
  );

  const names = useMemo(
    () => ["Yodaaaaaaaaaa!", "Jergennnnnnnnn!", "Aila Medel"],
    []
  );

  const [nameIndex, setNameIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const full = names[nameIndex] || "";
    const typeSpeed = 70;
    const deleteSpeed = 40;
    const pauseAfterType = 3000;
    const pauseAfterDelete = 250;
    let t: number;
    if (phase === "typing") {
      if (typed.length < full.length) {
        t = window.setTimeout(() => setTyped(full.slice(0, typed.length + 1)), typeSpeed);
      } else {
        t = window.setTimeout(() => setPhase("pausing"), pauseAfterType);
      }
    } else if (phase === "pausing") {
      t = window.setTimeout(() => setPhase("deleting"), 0);
    } else {
      if (typed.length > 0) {
        t = window.setTimeout(() => setTyped(full.slice(0, typed.length - 1)), deleteSpeed);
      } else {
        t = window.setTimeout(() => {
          setNameIndex((v) => (v + 1) % names.length);
          setPhase("typing");
        }, pauseAfterDelete);
      }
    }
    return () => window.clearTimeout(t);
  }, [typed, phase, nameIndex, names]);

  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [rings, setRings] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCx(e.clientX);
      setCy(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const down = (e: MouseEvent) => {
      setPressed(true);
      const id = Date.now();
      setRings((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRings((r) => r.filter((t) => t.id !== id)), 600);
    };
    const up = () => setPressed(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseenter", move, { passive: true });
    window.addEventListener("mouseleave", leave, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseenter", move);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-800 font-[Poppins]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

          @keyframes snowFall {
            0% { transform: translateX(var(--drift, 0px)) translateY(-20vh); }
            100% { transform: translateX(var(--drift, 0px)) translateY(120vh); }
          }
          @keyframes giftSoftShake {
            0%, 40% { transform: translate3d(0,0,0) rotate(0deg); }
            46% { transform: translate3d(3px, 0, 0) rotate(3deg); }
            50% { transform: translate3d(0, 0, 0) rotate(0deg); }
            54% { transform: translate3d(-3px, 0, 0) rotate(-3deg); }
            58% { transform: translate3d(0, 0, 0) rotate(0deg); }
            100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          }
          @keyframes caretBlink {
            0%, 45% { opacity: 1; }
            50%, 100% { opacity: 0; }
          }

          @media (pointer:fine) {
            html, body { cursor: none; }
          }
          .x-cursor {
            position: fixed;
            left: 0; top: 0;
            width: 40px; height: 40px;
            transform: translate(-50%, -50%) scale(var(--scale,1));
            background: url('/yodalove.gif') center/contain no-repeat;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
            pointer-events: none;
            transition: transform 120ms ease, opacity 120ms ease;
            z-index: 9999;
            opacity: var(--opacity, 0);
            will-change: transform;
          }
          .x-cursor:after{
            content:"";
            position:absolute; inset:-6px;
            border-radius:9999px;
            background: radial-gradient(closest-side, rgba(255,255,255,.35), rgba(255,255,255,0));
            filter: blur(6px);
            opacity:.6;
          }
          .x-ring {
            position: fixed;
            width: 10px; height: 10px;
            transform: translate(-50%, -50%);
            border-radius: 9999px;
            border: 2px solid rgba(255,255,255,.7);
            box-shadow: 0 0 18px rgba(59,130,246,.65), inset 0 0 8px rgba(255,255,255,.5);
            pointer-events: none;
            z-index: 9998;
            animation: x-ping .6s ease-out forwards;
          }
          @keyframes x-ping {
            0% { opacity: .9; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(5); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-60 w-60 sm:h-72 sm:w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute left-1/2 top-16 sm:top-20 h-44 w-44 sm:h-56 sm:w-56 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {flakes.map((f) => (
          <span
            key={f.id}
            className="absolute top-[-12%] rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: f.opacity,
              filter: "blur(0.2px)",
              animation: `snowFall ${f.duration}s linear ${f.delay}s infinite`,
              transform: `translateX(${f.drift}px)`,
              ["--drift"]: `${f.drift}px`,
            } as React.CSSProperties & { ["--drift"]: string }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Navigation />

        <div className="mt-10 sm:mt-14 grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white/90 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white" />
              Hello, How are you?
            </div>

            <h1 className="mt-5 sm:mt-6 text-3xl sm:4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Merry Christmas,{" "}
              <span className="inline-flex items-baseline">
                <span className="whitespace-nowrap">{typed}</span>
                <span
                  className="ml-1 inline-block h-[0.95em] w-0.5 bg-white/90"
                  style={{ animation: "caretBlink 0.9s steps(1) infinite" }}
                />
              </span>
              ✨
            </h1>

            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/80">
              May your heart feel calm, your dreams grow, and your days sparkle with hope.
              I’m grateful for you always cheering for you adooooy!
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <button className="w-full sm:w-auto rounded-2xl border border-blue-400/40 bg-blue-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-600 active:scale-[0.99]">
                Explore Gifts
              </button>
              <button className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white shadow-sm hover:bg-white/15 active:scale-[0.99]">
                View Wishlist
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 sm:-inset-6 rounded-4xl bg-linear-to-r from-white/10 via-emerald-400/15 to-white/10 blur-2xl" />
            <img
              src="/bluegift.png"
              alt="Christmas"
              className="relative w-full h-auto max-h-120 object-contain drop-shadow-sm select-none transform-gpu will-change-transform motion-safe:animate-[giftSoftShake_3s_ease-in-out_infinite]"
              style={{ animation: "giftSoftShake 3s ease-in-out infinite", transformOrigin: "50% 85%" }}
            />
          </div>
        </div>

        <Footer />
      </div>

      <div
        className="x-cursor"
        style={{
          left: cx,
          top: cy,
          ["--opacity" as any]: visible ? 1 : 0,
          ["--scale" as any]: pressed ? 0.9 : 1,
        }}
      />
      {rings.map((r) => (
        <span key={r.id} className="x-ring" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
