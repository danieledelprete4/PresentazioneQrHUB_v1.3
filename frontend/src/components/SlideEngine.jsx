import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Keyboard, Play } from "lucide-react";
import { slides, actNameFor } from "./slides";
import { EASE, STATIC } from "../lib/brand";
import { FadeUp } from "./primitives";
import SpatialIntro from "./SpatialIntro";

const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
const skipIntro = STATIC || params.has("slide");

const initialSlide = () => {
  const n = parseInt(params.get("slide"), 10);
  return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), slides.length - 1) : 0;
};

const INTRO_STEPS = [
  { text: "30 GIORNI.", color: "#FF6600" },
  { text: "1.699 SCANSIONI.", color: "#FFFFFF" },
  { text: "1.311 RELAZIONI.", color: "#FF6600" },
  { text: "Codifichiamo il futuro.", color: "#C8FF00" },
  { text: "QRHub", color: "#C8FF00", big: true, sub: "× WINDTRE Partner" },
  { text: "#insiemeperilsuccesso", color: "#FFFFFF" },
];

/* Apple-style cinematic aurora backdrop — soft drifting gradients */
function AuroraBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base deep black */}
      <div className="absolute inset-0" style={{ background: "#000" }} />

      {/* Drifting aurora orbs — Apple keynote style */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "70%",
          height: "70%",
          top: "-15%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(255,102,0,0.32) 0%, rgba(255,102,0,0) 65%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "65%",
          height: "65%",
          bottom: "-20%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(200,255,0,0.22) 0%, rgba(200,255,0,0) 65%)",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "55%",
          height: "55%",
          top: "20%",
          right: "10%",
          background:
            "radial-gradient(circle, rgba(120,180,255,0.10) 0%, rgba(120,180,255,0) 65%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 40, -50, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Subtle film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}

/* Apple-style start gate */
function IntroGate({ onBegin }) {
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer"
      onClick={onBegin}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      data-testid="intro-gate"
    >
      <AuroraBackdrop />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <FadeUp delay={0.15}>
          <span className="t-kicker" style={{ color: "#C8FF00" }}>
            VDN Partner · Review del primo mese
          </span>
        </FadeUp>
        <FadeUp delay={0.4}>
          <h1 className="t-display text-white mt-[3cqh]">QRHub</h1>
        </FadeUp>
        <FadeUp delay={0.65}>
          <p className="t-h3 text-white/60 mt-[1cqh]">× WINDTRE Partner</p>
        </FadeUp>
        <FadeUp delay={0.95}>
          <motion.div
            className="mt-[6cqh] rounded-full grid place-items-center text-black"
            style={{
              background: "#C8FF00",
              width: "clamp(3.2rem,6cqw,6rem)",
              height: "clamp(3.2rem,6cqw,6rem)",
            }}
            whileHover={{ scale: 1.08 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(200,255,0,0)",
                "0 0 50px rgba(200,255,0,0.6)",
                "0 0 0px rgba(200,255,0,0)",
              ],
            }}
            transition={{ boxShadow: { duration: 2.2, repeat: Infinity } }}
            data-testid="intro-start"
          >
            <Play size={26} fill="#000" style={{ marginLeft: 4 }} />
          </motion.div>
        </FadeUp>
        <FadeUp delay={1.2}>
          <p className="t-kicker text-white/35 mt-[4cqh]">
            Premi play
          </p>
        </FadeUp>
      </div>
    </motion.div>
  );
}

/* Cinematic QR-themed intro sequence */
function IntroSequence({ onDone }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= INTRO_STEPS.length) {
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    const last = step === INTRO_STEPS.length - 1;
    const t = setTimeout(() => setStep((s) => s + 1), last ? 3600 : 2800);
    return () => clearTimeout(t);
  }, [step, onDone]);

  const cur = INTRO_STEPS[Math.min(step, INTRO_STEPS.length - 1)];
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={onDone}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: EASE }}
      data-testid="intro-overlay"
    >
      <AuroraBackdrop />
      <div className="relative z-10 text-center px-[6cqw]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div
              className={cur.big ? "t-display glow-orange" : "t-h1"}
              style={{ color: cur.color }}
            >
              {cur.text}
            </div>
            {cur.sub && (
              <motion.div
                className="t-h3 text-white/70 mt-[1.5cqh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              >
                {cur.sub}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <span
        className="absolute z-20 text-white/40"
        style={{
          bottom: "2.6cqw",
          right: "3cqw",
          fontSize: "clamp(0.6rem,1cqw,0.9rem)",
        }}
        data-testid="intro-skip"
      >
        Tocca per saltare →
      </span>
    </motion.div>
  );
}

export default function SlideEngine() {
  const [index, setIndex] = useState(initialSlide);
  const [isFs, setIsFs] = useState(false);
  const [hint, setHint] = useState(true);
  const [started, setStarted] = useState(skipIntro);
  const [playing, setPlaying] = useState(false);
  const total = slides.length;
  const touch = useRef(null);

  const begin = useCallback(() => setPlaying(true), []);
  const start = useCallback(() => setStarted(true), []);

  const go = useCallback(
    (dir) => setIndex((i) => Math.min(Math.max(i + dir, 0), total - 1)),
    [total]
  );

  const toggleFs = useCallback(() => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (!started) {
        if (!playing && (k === " " || k === "Enter" || k === "ArrowRight")) {
          e.preventDefault();
          begin();
        } else if (
          playing &&
          (k === " " || k === "Enter" || k === "ArrowRight" || k === "Escape")
        ) {
          e.preventDefault();
          start();
        }
        return;
      }
      if (k === "ArrowRight" || k === " " || k === "PageDown" || k === "Enter") {
        e.preventDefault();
        go(1);
      } else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") {
        e.preventDefault();
        go(-1);
      } else if (k.toLowerCase() === "f") toggleFs();
      else if (k === "Home") setIndex(0);
      else if (k === "End") setIndex(total - 1);
    };
    const onFs = () => setIsFs(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [go, toggleFs, begin, start, started, playing, total]);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const onTouchStart = (e) => {
    touch.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touch.current == null || !started) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  const pct = ((index + 1) / total) * 100;
  const btn = {
    width: "clamp(2rem,3cqw,3rem)",
    height: "clamp(2rem,3cqw,3rem)",
  };

  return (
    <div
      className="app-root"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-testid="slide-engine"
    >
      <div className="stage" data-testid="slide-stage">
        {started && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              {slides[index]}
            </motion.div>
          </AnimatePresence>
        )}

        {started && (
          <>
            <div
              className="nav-zone left-0"
              onClick={() => go(-1)}
              data-testid="nav-prev-zone"
            />
            <div
              className="nav-zone right-0"
              onClick={() => go(1)}
              data-testid="nav-next-zone"
            />

            <button
              className="ctrl-btn"
              style={{
                left: "1.4cqw",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(2rem,3.2cqw,3.4rem)",
                height: "clamp(2rem,3.2cqw,3.4rem)",
                opacity: index === 0 ? 0.2 : 1,
              }}
              onClick={() => go(-1)}
              disabled={index === 0}
              data-testid="prev-button"
              aria-label="Slide precedente"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="ctrl-btn"
              style={{
                right: "1.4cqw",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(2rem,3.2cqw,3.4rem)",
                height: "clamp(2rem,3.2cqw,3.4rem)",
                opacity: index === total - 1 ? 0.2 : 1,
              }}
              onClick={() => go(1)}
              disabled={index === total - 1}
              data-testid="next-button"
              aria-label="Slide successiva"
            >
              <ChevronRight size={20} />
            </button>
            <button
              className="ctrl-btn"
              style={{ ...btn, right: "1.4cqw", top: "1.4cqw" }}
              onClick={toggleFs}
              data-testid="fullscreen-toggle"
              aria-label="Schermo intero"
            >
              {isFs ? <Minimize size={17} /> : <Maximize size={17} />}
            </button>

            <span className="act-tag" data-testid="act-name">
              {actNameFor(index)}
            </span>
            <span className="slide-counter" data-testid="slide-counter">
              {String(index + 1).padStart(2, "0")} / {total}
            </span>

            <AnimatePresence>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/50 text-[clamp(0.55rem,1cqw,0.85rem)] z-[60]"
                  style={{ bottom: "2.4cqw" }}
                >
                  <Keyboard size={14} /> ← → naviga · F schermo intero
                </motion.div>
              )}
            </AnimatePresence>

            <div className="progress-track" data-testid="slide-progress">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}

        <AnimatePresence>
          {!started && !playing && <IntroGate key="gate" onBegin={begin} />}
          {!started && playing && <SpatialIntro key="spatial" onDone={start} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
