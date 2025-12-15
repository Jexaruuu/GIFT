import { useEffect, useMemo, useRef, useState } from "react";
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
      { img: "/yoda1.png", title: "To my favorite person", text: "This season, I hope you feel extra loved." },
      { img: "/yoda2.png", title: "Little moments", text: "The small things we share are the biggest gifts." },
      { img: "/yoda3.png", title: "Always cheering you on", text: "You’ve got this. I’m here, always." },
      { img: "/yoda4.png", title: "Bright days ahead", text: "May every day bring you calm and joy." },
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
    setTilt({ x: ((my / rect.height) - 0.5) * -8, y: ((mx / rect.width) - 0.5) * 8 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const cards = useMemo(() => {
    return [
      { img: "/adoy1.png", title: "Warm Wishes", tag: "Smile", text: "Soft lights, calm nights, best smiles." },
      { img: "/adoy2.png", title: "Tiny Joys", tag: "Always", text: "Little wins that make big days." },
      { img: "/adoy3.png", title: "You’ve Got This", tag: "And", text: "I’m rooting for you—always." },
      { img: "/adoy4.png", title: "Bright Tomorrows", tag: "Be", text: "Good days are on the way." },
      { img: "/adoy5.png", title: "Kind Lights", tag: "Happy", text: "Breathe in, breathe out, feel peace." },
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
          @keyframes cardPop { 0% { transform: translateZ(0) scale(.96); filter: saturate(.9) brightness(.95); } 60% { transform: translateZ(24px) scale(1.02); filter: saturate(1.05) brightness(1.02); } 100% { transform: translateZ(0) scale(1); }
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
          @media (pointer:fine) { html, body { cursor: none; }
          }
          .x-cursor { position: fixed; left: 0; top: 0; width: 40px; height: 40px; transform: translate(-50%, -50%) scale(var(--scale,1)); background: url('/yodalove.gif') center/contain no-repeat; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35)); pointer-events: none; transition: transform 120ms ease, opacity 120ms ease; z-index: 9999; opacity: var(--opacity, 0); will-change: transform; }
          .x-cursor:after{ content:""; position:absolute; inset:-6px; border-radius:9999px; background: radial-gradient(closest-side, rgba(255,255,255,.35), rgba(255,255,255,0)); filter: blur(6px); opacity:.6; }
          .x-ring { position: fixed; width: 10px; height: 10px; transform: translate(-50%, -50%); border-radius: 9999px; border: 2px solid rgba(255,255,255,.7); box-shadow: 0 0 18px rgba(59,130,246,.65), inset 0 0 8px rgba(255,255,255,.5); pointer-events: none; z-index: 9998; animation: x-ping .6s ease-out forwards; }
          @keyframes x-ping { 0% { opacity: .9; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(5); } }
          @keyframes tiltFloat {
            0% { transform: perspective(800px) rotate(-4deg) translateY(0) scale(1.02); }
            50% { transform: perspective(800px) rotate(4deg) translateY(-4px) scale(1.02); }
            100% { transform: perspective(800px) rotate(-4deg) translateY(0) scale(1.02); }
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

      <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-14 x-tight-pad">
        <Navigation />

        <div className="mt-8 sm:mt-14 grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 sm:px-4 py-2 text-xs sm:text-sm text-white/90 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-white" />
              Hello, How are you?
            </div>

            <h1 className="mt-4 sm:mt-6 text-[clamp(24px,6vw,48px)] lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Merry Christmas,{" "}
              <span className="inline-flex items-baseline">
                <span className="whitespace-nowrap">{typed}</span>
                <span className="ml-1 inline-block h-[0.95em] w-0.5 bg-white/90" style={{ animation: "caretBlink 0.9s steps(1) infinite" }} />
              </span>
              ✨
            </h1>

            <p className="mt-3 sm:mt-4 text-[clamp(14px,3.6vw,18px)] text-white/80">
              May your heart feel calm, your dreams grow, and your days sparkle with hope.
              I’m grateful for you always cheering for you adooooy!
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
              <button className="w-full sm:w-auto rounded-2xl border border-blue-400/40 bg-blue-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-600 active:scale-[0.99]" onClick={() => setOpenModal(true)}>
                Open Surprise
              </button>
              <button className="w-full sm:w-auto rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white shadow-sm hover:bg-white/15 active:scale-[0.99]" onClick={() => setOpenScroll(true)}>
                Read Message
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 sm:-inset-6 rounded-4xl bg-linear-to-r from-white/10 via-emerald-400/15 to-white/10 blur-2xl" />
            <img src="/bluegift.png" alt="Christmas" className="relative w-full h-auto max-h-[36vh] sm:max-h-120 object-contain drop-shadow-sm select-none transform-gpu will-change-transform motion-safe:animate-[giftSoftShake_3s_ease-in-out_infinite]" style={{ animation: "giftSoftShake 3s ease-in-out infinite", transformOrigin: "50% 85%" }} />
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
                onMouseEnter={() => { hoverRef.current = true; }}
                onMouseLeave={() => { hoverRef.current = false; onUp(); }}
                onMouseDown={(e) => onDown(e.clientX)}
                onMouseMove={(e) => onMove(e.clientX)}
                onMouseUp={onUp}
                onTouchStart={(e) => onDown(e.touches[0].clientX)}
                onTouchMove={(e) => onMove(e.touches[0].clientX)}
                onTouchEnd={onUp}
              >
                <div
                  ref={dragTrackRef}
                  className="flex gap-3 sm:gap-5 will-change-transform"
                  style={{ transform: `translateX(${dragX}px)` }}
                >
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

        <Footer />
      </div>

      {openModal && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="relative w-full max-w-5xl px-3 sm:px-4">
            <div className="rounded-3xl bg-transparent border border-transparent shadow-none p-0">
              <div className="flex items-start justify-end mb-2 sm:mb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                <button onClick={() => setOpenModal(false)} className="rounded-xl border border-white/20 px-3 py-2 text-white/90 hover:bg-white/10 active:scale-95">✕</button>
              </div>

              <div className="relative h-[60vh] sm:h-110 md:h-130 perspective-[1400px]" ref={areaRef} onMouseMove={handleMove} onMouseLeave={resetTilt}>
                <div className="pointer-events-none absolute inset-0 blur-3xl opacity-30 animate-[glowPulse_3s_ease-in-out_infinite]">
                  <div className="absolute left-1/3 top-1/3 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-sky-400/50" />
                  <div className="absolute right-1/4 bottom-1/4 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-fuchsia-400/50" />
                </div>

                <div className="relative h-full w-full overflow-visible transform-gpu transition-transform duration-200" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
                  <div className="absolute left-1/2 top-1/2 w-[72%] sm:w-[46%] -translate-x-[160%] -translate-y-1/2 scale-[.9] opacity-70 blur-[0.5px] transition-all duration-500 ease-out cursor-pointer" onClick={prev}>
                    <figure className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/20 shadow-xl bg-white/5 backdrop-blur">
                      <div className="px-4 pt-3">
                        <div className="text-white font-semibold text-xs sm:text-sm truncate">{slides[leftIdx]?.title}</div>
                        <div className="text-white/80 text-[11px] sm:text-xs truncate">{slides[leftIdx]?.text}</div>
                      </div>
                      <div className="relative m-3 mt-2 rounded-xl overflow-hidden border border-white/20">
                        <img src={slides[leftIdx]?.img || ""} alt="" className="w-full h-56 sm:h-92.5 object-cover blur-md sm:blur-lg scale-[1.05]" />
                        <div className="absolute inset-0 grid place-items-center text-white/85 text-xs tracking-wide bg-black/50">Locked</div>
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-[11px] sm:text-xs px-2 py-1 backdrop-blur">{leftIdx + 1}/{len}</div>
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
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-xs px-2 py-1 backdrop-blur">{idx + 1}/{len}</div>
                      </div>
                      <div className="pointer-events-none absolute -inset-1 rounded-[26px] sm:rounded-[40px] border border-white/20 opacity-40" />
                    </figure>
                  </div>

                  <div className="absolute left-1/2 top-1/2 w-[72%] sm:w-[46%] translate-x-[60%] -translate-y-1/2 scale-[.9] opacity-70 blur-[0.5px] transition-all duration-500 ease-out cursor-pointer" onClick={next}>
                    <figure className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden border border-white/20 shadow-xl bg-white/5 backdrop-blur">
                      <div className="px-4 pt-3">
                        <div className="text-white font-semibold text-xs sm:text-sm truncate">{slides[rightIdx]?.title}</div>
                        <div className="text-white/80 text-[11px] sm:text-xs truncate">{slides[rightIdx]?.text}</div>
                      </div>
                      <div className="relative m-3 mt-2 rounded-xl overflow-hidden border border-white/20">
                        <img src={slides[rightIdx]?.img || ""} alt="" className="w-full h-56 sm:h-92.5 object-cover blur-md sm:blur-lg scale-[1.05]" />
                        <div className="absolute inset-0 grid place-items-center text-white/85 text-xs tracking-wide bg-black/50">Locked</div>
                        <div className="absolute top-2 right-2 rounded-full bg-white/15 border border-white/25 text-white text-[11px] sm:text-xs px-2 py-1 backdrop-blur">{rightIdx + 1}/{len}</div>
                      </div>
                    </figure>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2 pb-3 sm:pb-4">
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`h-1.5 w-6 sm:w-7 rounded-full transition-all ${i === idx ? "bg-white scale-100" : "bg-white/40 scale-95"} active:scale-95`} />
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
              <button onClick={() => setOpenScroll(false)} className="rounded-xl border border-white/20 px-3 py-2 text-white/90 hover:bg-white/10 active:scale-95">✕</button>
            </div>
            <div className="relative mx-auto w-full animate-[scrollUnroll_.28s_ease-out]">
              <img src="/scroll.png" alt="" className="w-full h-auto max-h-[80vh] sm:max-h-[85vh] object-contain" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[70%] sm:w-[58%] max-h-[42vh] sm:max-h-[50vh] overflow-y-auto x-scroll-pretty px-5 sm:px-8 pt-[clamp(44px,11vh,120px)] pb-[clamp(44px,11vh,120px)] text-white text-justify text-[clamp(13px,3.6vw,16px)] leading-7">
                  <h2 className="text-center text-[clamp(18px,6vw,30px)] sm:text-1xl font-bold tracking-wide">A Letter For My Favorite Person</h2>
                  <p className="mt-3 sm:mt-4">
                    Hello Adooooyyyyy, kumusta? Eto nanaman ako mangungulit hehe, by the way I just wanna say Merry Christmas sa'yo at tska kay baby aquiiii at syempre sa family mo din. I hope na sana okay lang kayo dyan and healthy lagi. Sana okay lang ikaw palagi Adooooy.
                  </p>
                  <p className="mt-3 sm:mt-4">
                   Hindi ko na din talaga alam ano sasabihin ko sayo kasi nasabi ko na lahat, pero ewan ko ba? nag eenjoy parin ako gumawa ng mga surprise na ganto kapag para sayo. Hindi ko na din nga alam kung matututwa ka pa sa gantong trip ko eh hehe, pero gusto ko lang sabihin na lahat ng gantong ginagawa ko ay galing sa aking heart. Gusto ko lang talaga na mapasaya ka kahit papano, kahit na hindi naman talaa tayo nag kikita tska hindi din ganun masyado nang nag uusap.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    Pero not gonna lie, alam mo ba na iniisip parin kita? hindi lang madalas, kundi palagi. Pasensya na kung minsan napapansin mo na sobrang downbad ako ha, pero sinusunod ko yung sinasabi mo na piliin ko maging masaya, Gustong gusto kong mag rant sayo about sa mga nangyayare na sa life ko, pero nahihiya na ko kasi dadagdag pa ba ako sa mga iniisip mo? kung alam mo lang kung gaano kita gusto kausap at kausapin. Alam ko nasabi ko na sayo to pero ewan, yun talaga nararamdaman ko.
                  </p>
                  <p className="mt-3 sm:mt-4">
                    Kaya kahit mabasa mo lang to, okay na ko. Kahit walang response or anything, okay na ako. Naalala mo yung mga sinabi ko nung unang message ko? Ganun parin yun walang nag bago. si YODA parin talaga eh. So ayun lang gusto ko lang sabihin sayo Adooy, na kahit anong mangyari, andito parin ako. Lagi parin kitang susuportahan sa mga goals mo, sa mga pangarap mo, sa mga gusto mong gawin. Lagi parin kitang mamahalin kahit anong mangyari.
                    </p>
                    <p className="mt-3 sm:mt-4">
                    Bawi ako soon, Roblox ulet tayo. Iiwasan ko na ma end yung streak, ayoko mag promise kasi naka ilang ulet na, pero susubukan ko parin po. Ingat ka palagi Adooy, at tandaan mo...
                    </p>
                  <p className="mt-5 sm:mt-6 text-right font-semibold">Mahalaga ka palagi, Merry Christmas! ✨</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="x-cursor" style={{ left: cx, top: cy, ["--opacity" as any]: visible ? 1 : 0, ["--scale" as any]: pressed ? 0.9 : 1 }} />
      {rings.map((r) => (
        <span key={r.id} className="x-ring" style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}
