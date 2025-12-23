import { useState, useEffect, useRef } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

export default function NewYearNavigation() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [countdown, setCountdown] = useState("");
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playlist = [
    { title: "Aya - EARL AGUSTIN ", src: "/aya.mp3", img: "/aya.jpg" },

    { title: "Kahel na langit - MAKI ", src: "/kahel-na-langit.mp3", img: "/kahel-na-langit.jpg" },

    { title: "Kisame - RHODESSA", src: "/kisame.mp3", img: "/kisame.jpg" },

    { title: "Hindi Ako Mawawala - EL MANU ", src: "/hindi-ako-mawawala.mp3", img: "/hindi-ako-mawawala.png" },

    { title: "Libo Libong Buwan - KYLE RAPHAEL", src: "/libo-libong-buwan.mp3", img: "/libo-libong-buwan.png" },

    { title: "Naiilang - LE JOHN ", src: "/naiilang.mp3", img: "/naiilang.png" },

    { title: "Panaginip - NICOLE ", src: "/panaginip.mp3", img: "/panaginip.jpg" },

    { title: "Bulong - DECEMBER AVENUE", src: "/bulong.mp3", img: "/bulong.jpg" },

    { title: "Kalapastanganan - FITTERKARMA", src: "/kalapastanganan.mp3", img: "/kalapastanganan.jpg" },

    { title: "Ngalan Mo - YDEN", src: "/ngalan-mo.mp3", img: "/ngalan-mo.png" },
    
    { title: "Museo - ELIZA MATURAN", src: "/museo.mp3", img: "/museo.jpg" },

    { title: "Tibok - EARL AGUSTIN", src: "/tibok.mp3", img: "/tibok.png" },

    { title: "Isa Lang - ARTHUR NERY", src: "/isa-lang.mp3", img: "/isa-lang.jpg" },

    { title: "Mahika - ADIE", src: "/mahika.mp3", img: "/mahika.jpg" },

    { title: "Pagibig ay Kanibalismo II - FITTERKARMA", src: "/pagibig-ay-kanibalismo.mp3", img: "/pagibig-ay-kanibalismo.png" },

    { title: "Ikaw Lang - KIYO", src: "/ikaw-lang.mp3", img: "/ikaw-lang.jpg" },

    { title: "Aura - IV OF SPADE", src: "/aura.mp3", img: "/aura.jpg" },

    { title: "Eba - KIYO", src: "/eba.mp3", img: "/eba.jpg" },

    { title: "Mata sa Mata - 7TH", src: "/mata-sa-mata.mp3", img: "/mata-sa-mata.jpg" },

    { title: "Ligaya - MRLD", src: "/ligaya.mp3", img: "/ligaya.png" },

    { title: "Bahala Na - KENANIAH", src: "/bahala-na.mp3", img: "/bahala-na.jpg" },

    { title: "Kung Maging Akin Ka - SUGARCANE", src: "/kung-maging-akin-ka.mp3", img: "/kung-maging-akin-ka.png" },

    { title: "Sila - SUD", src: "/sila.mp3", img: "/sila.jpg" },

    { title: "Tadhana - UP DHARMA DOWN", src: "/tadhana.mp3", img: "/tadhana.png" },
  ];

  useEffect(() => {
    setTyped(playlist[index]?.title || "");
  }, [index]);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(playlist[index]?.src);
      a.preload = "auto";
      a.addEventListener("ended", () => handleNext());
      a.addEventListener("timeupdate", () => setCurrentTime(a.currentTime || 0));
      a.addEventListener("loadedmetadata", () => {
        setDuration(a.duration || 0);
        setCurrentTime(0);
      });
      audioRef.current = a;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = playlist[index]?.src || "";
    audioRef.current.load();
    setDuration(0);
    setCurrentTime(0);
    if (playing) audioRef.current.play().catch(() => setPlaying(false));
  }, [index]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  useEffect(() => {
    const target = new Date("2026-01-01T00:00:00+08:00").getTime();
    const tick = () => {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= d * 24 * 60 * 60 * 1000;
      const h = Math.floor(diff / (1000 * 60 * 60));
      diff -= h * 60 * 60 * 1000;
      const m = Math.floor(diff / (1000 * 60));
      diff -= m * 60 * 1000;
      const s = Math.floor(diff / 1000);
      setCountdown(
        `${String(d).padStart(2, "0")}d : ${String(h).padStart(2, "0")}h : ${String(m).padStart(2, "0")}m : ${String(s).padStart(2, "0")}s`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePrev = () => {
    setIndex((i) => (i - 1 + playlist.length) % playlist.length);
  };

  const handleNext = () => {
    setIndex((i) => (i + 1) % playlist.length);
  };

  const handleToggle = () => {
    setPlaying((p) => !p);
  };

  const onScrub = (v: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = v;
    setCurrentTime(v);
  };

  const fmt = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const pct = duration ? Math.max(0, Math.min(100, Math.floor((currentTime / duration) * 100))) : 0;

  const goChristmas = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: { page: "christmas" } }));
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');`}</style>
      <style>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          background: linear-gradient(to right, rgba(59,130,246,0.95) 0%, rgba(59,130,246,0.95) var(--fill,0%), rgba(255,255,255,0.25) var(--fill,0%), rgba(255,255,255,0.25) 100%);
          outline: none;
        }
        .slider:focus { box-shadow: 0 0 0 4px rgba(59,130,246,0.25); }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 40px;
          height: 40px;
          background: url('/yodaicon.gif') center/contain no-repeat transparent;
          border: 0;
          box-shadow: none;
          border-radius: 0;
          margin-top: -12px;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 32px;
          height: 32px;
          background: url('/yodaicon.gif') center/contain no-repeat transparent;
          border: 0;
          box-shadow: none;
          border-radius: 0;
          cursor: pointer;
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>

      <div
        className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur px-3 py-3 sm:px-4 sm:py-3"
        style={{
          fontFamily:
            "'Poppins', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl text-white grid place-items-center font-bold overflow-hidden">
              <img src={playlist[index]?.img || "/yodaicon.gif"} alt="Cover" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-white mt-1">{typed}</div>
                <div className="hidden sm:flex items-center gap-2 mt-1">
                  <button onClick={handlePrev} aria-label="Previous" className="p-2 text-white/90 hover:text-white active:scale-95">
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={handleToggle}
                    aria-label={playing ? "Pause" : "Play"}
                    className="p-2 text-white/90 hover:text-white active:scale-95"
                  >
                    {playing ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button onClick={handleNext} aria-label="Next" className="p-2 text-white/90 hover:text-white active:scale-95">
                    <SkipForward size={18} />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, Math.floor(duration))}
                    value={Math.floor(currentTime)}
                    onChange={(e) => onScrub(Number(e.target.value))}
                    className="slider w-44 sm:w-64"
                    style={{ ["--fill" as any]: `${pct}%` }}
                  />
                  <div className="text-[11px] sm:text-xs text-white/80 tabular-nums">
                    {fmt(currentTime)} / {fmt(duration)}
                  </div>
                </div>
              </div>

              <div className="hidden">
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.floor(duration))}
                  value={Math.floor(currentTime)}
                  onChange={(e) => onScrub(Number(e.target.value))}
                  className="slider w-56 sm:w-80"
                  style={{ ["--fill" as any]: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden"></div>

            <button
              onClick={goChristmas}
              className="hidden sm:inline-flex rounded-xl bg-blue-500 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-blue-600 active:scale-[0.99]"
            >
              Christmas Surprise
            </button>

            <button
              className="inline-flex sm:hidden rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white active:scale-[0.99]"
              onClick={() => setOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>

        <div className={`${open ? "grid" : "hidden"} sm:hidden mt-3 gap-2 text-xs`}>
          <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-white font-semibold text-center">
            {countdown}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={handlePrev} aria-label="Previous" className="p-2 text-white/90 hover:text-white active:scale-95">
              <SkipBack size={18} />
            </button>
            <button
              onClick={handleToggle}
              aria-label={playing ? "Pause" : "Play"}
              className="p-2 text-white/90 hover:text-white active:scale-95"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button onClick={handleNext} aria-label="Next" className="p-2 text-white/90 hover:text-white active:scale-95">
              <SkipForward size={18} />
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              value={Math.floor(currentTime)}
              onChange={(e) => onScrub(Number(e.target.value))}
              className="slider w-full"
              style={{ ["--fill" as any]: `${pct}%` }}
            />
            <div className="text-xs text-white/80 tabular-nums">
              {fmt(currentTime)} / {fmt(duration)}
            </div>
          </div>
          <button
            onClick={goChristmas}
            className="rounded-xl bg-blue-500 px-3 py-2 font-semibold text-white hover:bg-blue-600 active:scale-[0.99]"
          >
            Christmas Surprise
          </button>
        </div>
      </div>
    </>
  );
}
