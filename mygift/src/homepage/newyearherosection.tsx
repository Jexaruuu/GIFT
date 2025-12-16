import { useEffect, useMemo, useRef, useState } from "react";
import NewYearNavigation from "../components/newyearnavigation";
import NewYearFooter from "../components/newyearfooter";

export default function NewYearHeroSection() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: 6 + Math.random() * 88,
        top: 8 + Math.random() * 55,
        hue: Math.floor(190 + Math.random() * 140),
        duration: 1.6 + Math.random() * 1.9,
        delay: Math.random() * 1.6,
        size: 2.2 + Math.random() * 2.2,
        radius: 46 + Math.random() * 64,
      })),
    []
  );

  const fwAngles = useMemo(() => Array.from({ length: 14 }).map((_, i) => (i * 360) / 14), []);

  const names = useMemo(() => ["Yodaaaaaaaaaa!", "Jergennnnnnnnn!", "Aila Medel"], []);
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
      if (typed.length < full.length) t = window.setTimeout(() => setTyped(full.slice(0, typed.length + 1)), typeSpeed);
      else t = window.setTimeout(() => setPhase("pausing"), pauseAfterType);
    } else if (phase === "pausing") {
      t = window.setTimeout(() => setPhase("deleting"), 0);
    } else {
      if (typed.length > 0) t = window.setTimeout(() => setTyped(full.slice(0, typed.length - 1)), deleteSpeed);
      else {
        t = window.setTimeout(() => {
          setNameIndex((v) => (v + 1) % names.length);
          setPhase("typing");
        }, pauseAfterDelete);
      }
    }
    return () => window.clearTimeout(t);
  }, [typed, phase, nameIndex, names]);

  const cursorUrl = "/yodalove.gif";

  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [rings, setRings] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const img = new Image();
    img.src = cursorUrl;
  }, [cursorUrl]);

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
    window.addEventListener("mouseleave", leave);
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

  const slides = useMemo(
    () => [
      { img: "/yoda1.png", title: "A fresh start", text: "New year, new peace, new reasons to smile." },
      { img: "/yoda2.png", title: "Little wins", text: "Every small step counts—always proud of you." },
      { img: "/yoda3.png", title: "Still cheering", text: "Same support, same energy, all year long." },
      { img: "/yoda4.png", title: "2026 vibes", text: "May your days feel lighter and brighter." },
    ],
    []
  );

  const [openModal, setOpenModal] = useState(false);
  const [openScroll, setOpenScroll] = useState(false);
  const [idx, setIdx] = useState(0);
  const len = slides.length;
  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);
  const leftIdx = (idx - 1 + len) % len;
  const rightIdx = (idx + 1) % len;

  const areaRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setTilt({ x: (my / rect.height - 0.5) * -8, y: (mx / rect.width - 0.5) * 8 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const cards = useMemo(() => {
    return [
      { img: "/adoy1.png", title: "New Year Wish", tag: "Start", text: "A calmer mind and a lighter heart." },
      { img: "/adoy2.png", title: "Good Energy", tag: "Glow", text: "More smiles, more peace, more you." },
      { img: "/adoy3.png", title: "Keep Going", tag: "Win", text: "I’m still rooting for you—always." },
      { img: "/adoy4.png", title: "Bright Days", tag: "Hope", text: "Better days are coming—trust it." },
      { img: "/adoy5.png", title: "Soft Moments", tag: "Calm", text: "Slow days, warm nights, deep breaths." },
    ];
  }, []);

  useEffect(() => {
    document.body.style.overflow = openModal || openScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal, openScroll]);

  const dragWrapRef = useRef<HTMLDivElement | null>(null);
  const dragTrackRef = useRef<HTMLDivElement | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const baseXRef = useRef(0);
  const lastXRef = useRef(0);
  const velRef = useRef(-0.12);
  const rafRef = useRef(0);
  const hoverRef = useRef(false);
  const wrapWRef = useRef(0);
  const trackWRef = useRef(0);
  const minXRef = useRef(0);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  useEffect(() => {
    const measure = () => {
      const wrap = dragWrapRef.current;
      const track = dragTrackRef.current;
      wrapWRef.current = wrap ? wrap.clientWidth : 0;
      trackWRef.current = track ? track.scrollWidth : 0;
      minXRef.current = Math.min(0, wrapWRef.current - trackWRef.current);
      setDragX((x) => clamp(x, minXRef.current, 0));
    };
    measure();
    const ro1 = new ResizeObserver(measure);
    const ro2 = new ResizeObserver(measure);
    if (dragWrapRef.current) ro1.observe(dragWrapRef.current);
    if (dragTrackRef.current) ro2.observe(dragTrackRef.current);
    return () => {
      ro1.disconnect();
      ro2.disconnect();
    };
  }, []);

  useEffect(() => {
    const step = () => {
      if (!isDragging && !hoverRef.current) {
        setDragX((x) => {
          let nx = x + velRef.current;
          if (nx < minXRef.current) {
            nx = minXRef.current;
            velRef.current = Math.abs(velRef.current);
          }
          if (nx > 0) {
            nx = 0;
            velRef.current = -Math.abs(velRef.current);
          }
          return nx;
        });
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDragging]);

  const onDown = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    baseXRef.current = dragX;
    lastXRef.current = clientX;
  };
  const onMove = (clientX: number) => {
    if (!isDragging) return;
    const dx = clientX - startXRef.current;
    const nx = clamp(baseXRef.current + dx, minXRef.current, 0);
    setDragX(nx);
    velRef.current = clientX - lastXRef.current;
    lastXRef.current = clientX;
  };
  const onUp = () => {
    setIsDragging(false);
    velRef.current = Math.max(Math.min(velRef.current, 20), -20) * 0.2;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue-800 font-[Poppins]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          @keyframes snowFall { 0% { transform: translateX(var(--drift, 0px)) translateY(-20vh); } 100% { transform: translateX(var(--drift, 0px)) translateY(120vh); } }
          @keyframes giftSoftShake { 0%, 40% { transform: translate3d(0,0,0) rotate(0deg); } 46% { transform: translate3d(3px, 0, 0) rotate(3deg); } 50% { transform: translate3d(0, 0, 0) rotate(0deg); } 54% { transform: translate3d(-3px, 0, 0) rotate(-3deg); } 58% { transform: translate3d(0, 0, 0) rotate(0deg); } 100% { transform: translate3d(0, 0, 0) rotate(0deg); } }
          @keyframes caretBlink { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
          @keyframes cardPop { 0% { transform: translateZ(0) scale(.96); filter: saturate(.9) brightness(.95); } 60% { transform: translateZ(24px) scale(1.02); filter: saturate(1.05) brightness(1.02); } 100% { transform: translateZ(0) scale(1); } }
          @keyframes glowPulse { 0%,100% { opacity:.25; filter: blur(30px); } 50% { opacity:.5; filter: blur(45px); } }
          @keyframes scrollUnroll { 0% { transform: scaleY(.9); opacity: 0; } 100% { transform: scaleY(1); opacity: 1); } }
          .x-scroll{
            overscroll-behavior: contain;
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
            scrollbar-color: transparent transparent !important;
            -webkit-overflow-scrolling: touch;
          }
          .x-scroll::-webkit-scrollbar{ width:0 !important; height:0 !important; display:none !important; }
          .x-scroll::-webkit-scrollbar-thumb,
          .x-scroll::-webkit-scrollbar-track,
          .x-scroll::-webkit-scrollbar-button,
          .x-scroll::-webkit-scrollbar-corner{ display:none !important; background:transparent !important; border:none !important; }
          .x-scroll-pretty{
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,.5) transparent;
          }
          .x-scroll-pretty::-webkit-scrollbar{ width:10px; height:10px; }
          .x-scroll-pretty::-webkit-scrollbar-track{ background: transparent; }
          .x-scroll-pretty::-webkit-scrollbar-thumb{
            background: rgba(255,255,255,.45);
            border-radius: 9999px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          .x-scroll-pretty:hover::-webkit-scrollbar-thumb{ background: rgba(255,255,255,.6); }
          .x-scroll-pretty::-webkit-scrollbar-thumb:active{ background: rgba(255,255,255,.8); }
          @media (max-width: 360px){
            .x-tight-pad{ padding-left: 0.75rem; padding-right: 0.75rem; }
          }
          @media (pointer:fine) { html, body, * { cursor: none !important; } }
          .x-cursor {
            position: fixed;
            left: 0;
            top: 0;
            width: 44px;
            height: 44px;
            transform: translate(-50%, -50%) scale(var(--scale,1));
            background-image: var(--cursor-img);
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
            pointer-events: none;
            transition: transform 120ms ease, opacity 120ms ease;
            z-index: 9999;
            opacity: var(--opacity, 0);
            will-change: transform;
          }
          .x-cursor:after{ content:""; position:absolute; inset:-6px; border-radius:9999px; background: radial-gradient(closest-side, rgba(255,255,255,.35), rgba(255,255,255,0)); filter: blur(6px); opacity:.6; }
          .x-ring { position: fixed; width: 10px; height: 10px; transform: translate(-50%, -50%); border-radius: 9999px; border: 2px solid rgba(255,255,255,.7); box-shadow: 0 0 18px rgba(59,130,246,.65), inset 0 0 8px rgba(255,255,255,.5); pointer-events: none; z-index: 9998; animation: x-ping .6s ease-out forwards; }
          @keyframes x-ping { 0% { opacity: .9; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(5); } }
          @keyframes tiltFloat {
            0% { transform: perspective(800px) rotate(-4deg) translateY(0) scale(1.02); }
            50% { transform: perspective(800px) rotate(4deg) translateY(-4px) scale(1.02); }
            100% { transform: perspective(800px) rotate(-4deg) translateY(0) scale(1.02); }
          }

          .x-moon-wrap{
            position:absolute;
            top: 26px;
            right: 22px;
            width: clamp(92px, 14vw, 160px);
            height: clamp(92px, 14vw, 160px);
            z-index: 3;
            pointer-events:none;
          }
          .x-moon {
            position:absolute;
            inset: 0;
            border-radius: 9999px;
            background:
              radial-gradient(circle at 32% 30%, rgba(225,245,255,.95), rgba(175,215,255,.55) 42%, rgba(110,175,255,.18) 72%, rgba(255,255,255,0) 78%),
              radial-gradient(circle at 36% 28%, rgba(215,240,255,.95), rgba(160,210,255,.6) 56%, rgba(95,165,255,.16) 82%),
              radial-gradient(circle at 58% 64%, rgba(35,110,255,.08), rgba(255,255,255,0) 56%);
            filter: drop-shadow(0 18px 40px rgba(115,170,255,.22));
            opacity: .96;
            animation: moonSpin 18s linear infinite;
            transform-origin: 50% 50%;
          }
          @keyframes moonSpin{
            0%{ transform: rotate(0deg); }
            100%{ transform: rotate(360deg); }
          }
          .x-moon:before{
            content:"";
            position:absolute;
            inset: 10%;
            border-radius: 9999px;
            background:
              radial-gradient(circle at 30% 40%, rgba(0,40,120,.13) 0 10px, rgba(0,0,0,0) 11px),
              radial-gradient(circle at 68% 58%, rgba(0,40,120,.10) 0 14px, rgba(0,0,0,0) 15px),
              radial-gradient(circle at 52% 28%, rgba(0,40,120,.09) 0 9px, rgba(0,0,0,0) 10px),
              radial-gradient(circle at 38% 70%, rgba(0,40,120,.08) 0 12px, rgba(0,0,0,0) 13px);
            mix-blend-mode: soft-light;
            opacity: .9;
          }
          .x-moon:after{
            content:"";
            position:absolute;
            inset:-14%;
            border-radius: 9999px;
            background: radial-gradient(circle, rgba(170,220,255,.18), rgba(255,255,255,0) 62%);
            filter: blur(2px);
            opacity: .85;
          }

          .x-cloud{
            position:absolute;
            left: 50%;
            top: 50%;
            width: 92%;
            height: 56%;
            transform: translate(-50%, -50%);
            border-radius: 9999px;
            opacity: .85;
            filter: blur(0.2px) drop-shadow(0 10px 18px rgba(0,0,0,.18));
            background:
              radial-gradient(circle at 18% 60%, rgba(255,255,255,.90) 0 22px, rgba(255,255,255,0) 26px),
              radial-gradient(circle at 34% 46%, rgba(255,255,255,.88) 0 28px, rgba(255,255,255,0) 34px),
              radial-gradient(circle at 52% 60%, rgba(255,255,255,.92) 0 24px, rgba(255,255,255,0) 30px),
              radial-gradient(circle at 70% 48%, rgba(255,255,255,.86) 0 30px, rgba(255,255,255,0) 36px),
              radial-gradient(circle at 86% 62%, rgba(255,255,255,.90) 0 22px, rgba(255,255,255,0) 28px),
              linear-gradient(to bottom, rgba(255,255,255,.55), rgba(255,255,255,0));
            mix-blend-mode: screen;
          }
          .x-cloud-1{
            animation: cloudDrift1 7.5s ease-in-out infinite;
          }
          .x-cloud-2{
            width: 106%;
            height: 62%;
            opacity: .65;
            filter: blur(0.6px) drop-shadow(0 10px 18px rgba(0,0,0,.14));
            transform: translate(-52%, -54%) scale(1.02);
            animation: cloudDrift2 9.5s ease-in-out infinite;
          }
          @keyframes cloudDrift1{
            0%{ transform: translate(-56%, -50%) translateX(-10px); opacity:.72; }
            50%{ transform: translate(-44%, -52%) translateX(12px); opacity:.9; }
            100%{ transform: translate(-56%, -50%) translateX(-10px); opacity:.72; }
          }
          @keyframes cloudDrift2{
            0%{ transform: translate(-58%, -56%) translateX(12px) scale(1.02); opacity:.52; }
            50%{ transform: translate(-44%, -54%) translateX(-14px) scale(1.03); opacity:.72; }
            100%{ transform: translate(-58%, -56%) translateX(12px) scale(1.02); opacity:.52; }
          }

          .x-fw {
            position: absolute;
            left: 0;
            top: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 2;
          }
          .x-fw-core{
            position:absolute;
            left:50%;
            top:50%;
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(255,255,255,.95), rgba(255,255,255,0) 70%);
            filter: drop-shadow(0 0 18px rgba(255,255,255,.35));
            animation: x-core var(--dur) ease-out var(--delay) infinite;
            opacity: 0;
          }
          @keyframes x-core{
            0%{ opacity:0; transform: translate(-50%, 20px) scale(.2); }
            10%{ opacity:.85; transform: translate(-50%, -12px) scale(.9); }
            18%{ opacity:0; transform: translate(-50%, -22px) scale(.2); }
            100%{ opacity:0; transform: translate(-50%, -22px) scale(.2); }
          }
          .x-fw-p{
            position:absolute;
            left:50%;
            top:50%;
            width: var(--sz);
            height: var(--sz);
            border-radius: 9999px;
            transform: translate(-50%, -50%) rotate(var(--a)) translateY(0);
            background:
              radial-gradient(circle at 30% 30%, rgba(255,255,255,.95), rgba(255,255,255,0) 38%),
              radial-gradient(circle, hsl(var(--hue) 100% 65% / .92), hsl(calc(var(--hue) + 18) 100% 62% / .62) 48%, rgba(255,255,255,0) 78%);
            box-shadow:
              0 0 22px hsl(var(--hue) 100% 70% / .42),
              0 0 34px hsl(calc(var(--hue) + 30) 100% 68% / .20);
            opacity: 0;
            animation: x-pop var(--dur) ease-out var(--delay) infinite;
          }
          @keyframes x-pop{
            0%{ opacity:0; transform: translate(-50%, 22px) rotate(var(--a)) translateY(0) scale(.55); filter: blur(.18px); }
            12%{ opacity:0; transform: translate(-50%, 10px) rotate(var(--a)) translateY(0) scale(.7); }
            18%{ opacity: 1; transform: translate(-50%, -10px) rotate(var(--a)) translateY(0) scale(1.05); }
            44%{ opacity: .95; transform: translate(-50%, -10px) rotate(var(--a)) translateY(calc(var(--r) * -1px)) scale(.98); }
            72%{ opacity: .18; transform: translate(-50%, -10px) rotate(var(--a)) translateY(calc(var(--r) * -1px)) scale(.78); filter: blur(.75px); }
            100%{ opacity:0; transform: translate(-50%, -10px) rotate(var(--a)) translateY(calc(var(--r) * -1px)) scale(.62); filter: blur(1.1px); }
          }
          .x-fw-fade{
            position:absolute;
            left:50%;
            top:50%;
            width: calc(var(--r) * 2px);
            height: calc(var(--r) * 2px);
            border-radius: 9999px;
            transform: translate(-50%, -50%);
            background:
              radial-gradient(circle, hsl(var(--hue) 100% 70% / .26), hsl(calc(var(--hue) + 40) 100% 68% / .14) 38%, rgba(255,255,255,0) 62%);
            filter: blur(5px);
            opacity: 0;
            animation: x-bloom var(--dur) ease-out var(--delay) infinite;
          }
          @keyframes x-bloom{
            0%{ opacity:0; transform: translate(-50%, 22px) scale(.15); }
            18%{ opacity: .0; transform: translate(-50%, -10px) scale(.2); }
            34%{ opacity: .6; transform: translate(-50%, -10px) scale(1.02); }
            70%{ opacity: .14; transform: translate(-50%, -10px) scale(1.1); }
            100%{ opacity:0; transform: translate(-50%, -10px) scale(1.14); }
          }
        `}
      </style>

      <img src={cursorUrl} alt="" className="hidden" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-60 w-60 sm:h-72 sm:w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute left-1/2 top-16 sm:top-20 h-44 w-44 sm:h-56 sm:w-56 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />

        <div className="x-moon-wrap">
          <div className="x-moon" />
          <div className="x-cloud x-cloud-1" />
          <div className="x-cloud x-cloud-2" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        {flakes.map((f) => (
          <div
            key={f.id}
            className="x-fw"
            style={
              {
                left: `${f.left}%`,
                top: `${f.top}%`,
                ["--hue" as any]: f.hue,
                ["--dur" as any]: `${f.duration}s`,
                ["--delay" as any]: `${f.delay}s`,
                ["--sz" as any]: `${f.size}px`,
                ["--r" as any]: f.radius,
              } as React.CSSProperties
            }
          >
            <span className="x-fw-fade" />
            <span className="x-fw-core" />
            {fwAngles.map((a) => (
              <span
                key={`${f.id}-${a}`}
                className="x-fw-p"
                style={
                  {
                    ["--a" as any]: `${a}deg`,
                    ["--hue" as any]: (f.hue + ((a / 360) * 140) * 0.9) % 360,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-14 x-tight-pad">
        <NewYearNavigation />

        <div className="mt-8 sm:mt-14 grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white/90 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white" />
              Hello, How are you?
            </div>

            <h1 className="mt-4 sm:mt-6 text-[clamp(24px,6vw,48px)] lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Happy New Year,{" "}
              <span className="inline-flex items-baseline">
                <span className="whitespace-nowrap">{typed}</span>
                <span className="ml-1 inline-block h-[0.95em] w-0.5 bg-white/90" style={{ animation: "caretBlink 0.9s steps(1) infinite" }} />
              </span>
              ✨
            </h1>

            <p className="mt-3 sm:mt-4 text-[clamp(14px,3.6vw,18px)] text-white/80">
              New year, new chapter. I hope 2026 treats you gently, gives you peace, and makes you smile more, adooooy!
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                className="w-full sm:w-auto rounded-2xl border border-blue-400/40 bg-blue-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-600 active:scale-[0.99]"
                onClick={() => setOpenModal(true)}
              >
                Open Surprise
              </button>
              <button
                className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white shadow-sm hover:bg-white/15 active:scale-[0.99]"
                onClick={() => setOpenScroll(true)}
              >
                Read Message
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 sm:-inset-6 rounded-4xl bg-linear-to-r from-white/10 via-emerald-400/15 to-white/10 blur-2xl" />
            <img
              src="/bluegift.png"
              alt="New Year"
              className="relative w-full h-auto max-h-[36vh] sm:max-h-120 object-contain drop-shadow-sm select-none transform-gpu will-change-transform motion-safe:animate-[giftSoftShake_3s_ease-in-out_infinite]"
              style={{ animation: "giftSoftShake 3s ease-in-out infinite", transformOrigin: "50% 85%" }}
            />
          </div>
        </div>

        <div className="mt-10 sm:mt-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-3 sm:px-6 py-5 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-white/90 font-semibold text-lg sm:text-xl">Mini Adoy</div>
              <div className="text-white/60 text-xs sm:text-sm">Hover to pause • Drag to browse</div>
            </div>

            <div className="mt-5 sm:mt-6">
              <div
                ref={dragWrapRef}
                className="group relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
                onMouseEnter={() => {
                  hoverRef.current = true;
                }}
                onMouseLeave={() => {
                  hoverRef.current = false;
                  onUp();
                }}
                onMouseDown={(e) => onDown(e.clientX)}
                onMouseMove={(e) => onMove(e.clientX)}
                onMouseUp={onUp}
                onTouchStart={(e) => onDown(e.touches[0].clientX)}
                onTouchMove={(e) => onMove(e.touches[0].clientX)}
                onTouchEnd={onUp}
              >
                <div ref={dragTrackRef} className="flex gap-3 sm:gap-5 will-change-transform" style={{ transform: `translateX(${dragX}px)` }}>
                  {cards.map((c, i) => (
                    <article key={`drag-${i}-${c.title}`} className="relative w-50 sm:w-65 md:w-[320px] shrink-0">
                      <div className="relative h-40 sm:h-56 md:h-64 overflow-hidden rounded-2xl bg-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                        <img src={c.img} alt="" className="h-full w-full object-contain" />
                        <div className="absolute inset-0 bg-linear-to-t from-blue-950/70 via-blue-900/20 to-transparent" />
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 rounded-full bg-white/15 border border-white/25 text-white text-[10px] sm:text-xs px-2 py-1 backdrop-blur">
                          {c.tag}
                        </div>
                      </div>
                      <div className="px-1.5 pt-2">
                        <h3 className="text-white font-semibold truncate">{c.title}</h3>
                        <p className="text-white/70 text-xs sm:text-sm line-clamp-2">{c.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <NewYearFooter />
      </div>

      {openModal && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="relative w-full max-w-5xl px-3 sm:px-4">
            <div className="rounded-3xl bg-transparent border border-transparent shadow-none p-0">
              <div className="flex items-start justify-end mb-2 sm:mb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                <button onClick={() => setOpenModal(false)} className="rounded-xl border border-white/20 px-3 py-2 text-white/90 hover:bg-white/10 active:scale-95">
                  ✕
                </button>
              </div>

              <div className="pb-2 sm:pb-3 text-center">
                <div className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/90 text-sm sm:text-base">
                  Tap the Surprise Cards to Next
                </div>
              </div>

              <div className="relative h-[60vh] sm:h-110 md:h-130 perspective-[1400px]" ref={areaRef} onMouseMove={handleMove} onMouseLeave={resetTilt}>
                <div className="pointer-events-none absolute inset-0 blur-3xl opacity-30 animate-[glowPulse_3s_ease-in-out_infinite]">
                  <div className="absolute left-1/3 top-1/3 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-sky-400/50" />
                  <div className="absolute right-1/4 bottom-1/4 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-fuchsia-400/50" />
                </div>

                <div className="relative h-full w-full overflow-visible transform-gpu transition-transform duration-200" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
                  <div
                    className="absolute left-1/2 top-1/2 w-[72%] sm:w-[46%] -translate-x-[160%] -translate-y-1/2 scale-[.9] opacity-70 blur-[0.5px] transition-all duration-500 ease-out cursor-pointer"
                    onClick={prev}
                  >
                    <figure className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/20 shadow-xl bg-white/5 backdrop-blur">
                      <div className="px-4 pt-3">
                        <div className="text-white font-semibold text-xs sm:text-sm truncate">{slides[leftIdx]?.title}</div>
                        <div className="text-white/80 text-[11px] sm:text-xs truncate">{slides[leftIdx]?.text}</div>
                      </div>
                      <div className="relative m-3 mt-2 rounded-xl overflow-hidden border border-white/20">
                        <img src={slides[leftIdx]?.img || ""} alt="" className="w-full h-56 sm:h-92.5 object-cover blur-md sm:blur-lg scale-[1.05]" />
                        <div className="absolute inset-0 grid place-items-center text-white/85 text-xs tracking-wide bg-black/50">Locked</div>
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-[11px] sm:text-xs px-2 py-1 backdrop-blur">
                          {leftIdx + 1}/{len}
                        </div>
                      </div>
                    </figure>
                  </div>

                  <div className="absolute left-1/2 top-1/2 w-[84%] sm:w-[54%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out">
                    <figure className="relative rounded-3xl sm:rounded-4xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:shadow-[0_30px_80px_rgba(0,0,0,0.4)] bg-white/5 backdrop-blur animate-[cardPop_.6s_ease]">
                      <div className="px-4 sm:px-6 pt-4 sm:pt-5">
                        <div className="text-white font-semibold text-base sm:text-lg">{slides[idx]?.title}</div>
                        <div className="text-white/80 text-sm sm:text-base">{slides[idx]?.text}</div>
                      </div>
                      <div className="relative m-3 sm:m-4 mt-3 rounded-2xl overflow-hidden border border-white/20">
                        <img key={idx} src={slides[idx]?.img || ""} alt="" className="w-full h-64 sm:h-100 object-cover" />
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-xs px-2 py-1 backdrop-blur">
                          {idx + 1}/{len}
                        </div>
                      </div>
                      <div className="pointer-events-none absolute -inset-1 rounded-[26px] sm:rounded-[40px] border border-white/20 opacity-40" />
                    </figure>
                  </div>

                  <div
                    className="absolute left-1/2 top-1/2 w-[72%] sm:w-[46%] translate-x-[60%] -translate-y-1/2 scale-[.9] opacity-70 blur-[0.5px] transition-all duration-500 ease-out cursor-pointer"
                    onClick={next}
                  >
                    <figure className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/20 shadow-xl bg-white/5 backdrop-blur">
                      <div className="px-4 pt-3">
                        <div className="text-white font-semibold text-xs sm:text-sm truncate">{slides[rightIdx]?.title}</div>
                        <div className="text-white/80 text-[11px] sm:text-xs truncate">{slides[rightIdx]?.text}</div>
                      </div>
                      <div className="relative m-3 mt-2 rounded-xl overflow-hidden border border-white/20">
                        <img src={slides[rightIdx]?.img || ""} alt="" className="w-full h-56 sm:h-92.5 object-cover blur-md sm:blur-lg scale-[1.05]" />
                        <div className="absolute inset-0 grid place-items-center text-white/85 text-xs tracking-wide bg-black/50">Locked</div>
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-[11px] sm:text-xs px-2 py-1 backdrop-blur">
                          {rightIdx + 1}/{len}
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    className={`h-1.5 w-6 sm:w-7 rounded-full transition-all ${i === idx ? "bg-white scale-100" : "bg-white/40 scale-95"} active:scale-95`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {openScroll && (
        <div className="fixed inset-0 z-10001 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="relative w-full max-w-3xl px-3 sm:px-4">
            <div className="flex items-start justify-end mb-2 sm:mb-3 px-1 pt-2">
              <button onClick={() => setOpenScroll(false)} className="rounded-xl border border-white/20 px-3 py-2 text-white/90 hover:bg-white/10 active:scale-95">
                ✕
              </button>
            </div>

            <div className="relative mx-auto w-full animate-[scrollUnroll_.28s_ease-out]">
              <img src="/scroll.png" alt="" className="w-full h-auto max-h-[80vh] sm:max-h-[85vh] object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[70%] sm:w-[58%] max-h-[42vh] sm:max-h-[50vh] overflow-y-auto x-scroll-pretty px-5 sm:px-8 pt-[clamp(44px,11vh,120px)] pb-[clamp(44px,11vh,120px)] text-white text-justify text-[clamp(13px,3.6vw,16px)] leading-7">
                  <h2 className="text-center text-[clamp(18px,6vw,30px)] sm:text-1xl font-bold tracking-wide">A New Year Letter For My Favorite Person</h2>

                  <p className="mt-3 sm:mt-4">
                    Hello Adooooyyyyy, kumusta? Happy New Year sa’yo at kay baby aquiiii, and syempre sa family mo din. Sana safe kayo palagi and healthy lagi.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    New year na, pero same pa rin ako: I enjoy doing surprises kapag para sayo. Sana maramdaman mo pa rin na sincere lahat ng to, galing sa heart.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    Alam mo ba na iniisip parin kita? not always, but a lot. Pasensya na kung minsan sobrang downbad ako, pero sinusubukan ko yung sinabi mo—piliin ko maging masaya.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    Kahit mabasa mo lang to, okay na ko. Kahit walang response, okay na ako. Same pa rin yung sinabi ko dati—si YODA parin talaga.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    Ingat ka palagi Adooy, and this year… sana mas maging okay lahat. Lagi parin kitang susuportahan sa goals mo, sa pangarap mo, sa lahat.
                  </p>

                  <p className="mt-5 sm:mt-6 text-right font-semibold">Happy New Year! ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="x-cursor"
        style={
          {
            left: cx,
            top: cy,
            ["--opacity" as any]: visible ? 1 : 0,
            ["--scale" as any]: pressed ? 0.9 : 1,
            ["--cursor-img" as any]: `url(${cursorUrl})`,
          } as React.CSSProperties
        }
      />
      {rings.map((r) => (
        <span key={r.id} className="x-ring" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
