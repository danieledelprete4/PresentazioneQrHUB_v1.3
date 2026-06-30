import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, SkipForward, Maximize, Minimize } from "lucide-react";
import { EASE } from "../lib/brand";

/* ============================================================
   QRHub · Spatial Intro v2
   - MP3 motivational backing track (~110s)
   - 9 narrative phases describing the full presentation
   - Futuristic "code space" backdrop (single canvas, low-cost)
   - Clean text reveals (one focal element per phase)
   - GPU-only animations (transform/opacity), no heavy filters
   ============================================================ */

const AUDIO_SRC = (process.env.PUBLIC_URL || "") + "/assets/intro_audio.mp3";

/* Phase script — total ~98s, faster cinematic pacing */
const SCRIPT = [
  { id: "title",    main: "QRHub",                                main2: null,                                       sub: "× WINDTRE Partner",                                                                          visual: "qr",        dur: 4500  },
  { id: "genesi",   main: "La Genesi.",                           main2: null,                                       sub: "Un'idea nata per rimanere vicino al cliente. Trasformare un QR in una leva commerciale senza confini.", visual: "code",      dur: 6500 },
  { id: "metrics",  main: "in 30 Giorni",                         main2: null,                                       sub: "1.699 scansioni · 1.311 relazioni dirette.",                                                visual: "metrics",   dur: 6500 },
  { id: "badge",    main: "Un cartellino.",                       main2: "Un QR.",                                   sub: "Il consulente indossa il cartellino. Il cliente lo porta a casa, nel telefono.",            visual: "cartellino",dur: 8000 },
  { id: "flow",     main: "Il Flusso.",                           main2: null,                                       sub: "Scansione → Landing → App → Push. In quattro tap, un canale permanente.",                   visual: "flow",      dur: 6500 },
  { id: "push",     main: "Push gratuite.",                       main2: null,                                       sub: "Annunci e offerte direttamente nel telefono del cliente.",                                  visual: "push",      dur: 6000 },
  { id: "insights", main: "Il negozio diventa misurabile.",       main2: null,                                       sub: "Orari di picco, dispositivi, comportamenti — dati che diventano decisioni.",                visual: "chart",     dur: 6500 },
  { id: "july",     main: "Update Luglio.",                       main2: null,                                       sub: "Cinque tasselli per chiudere il loop commerciale.",                                          visual: "roadmap",   dur: 8000 },
  { id: "welcome",  main: "Open per scelta.",                     main2: null,                                       sub: "QRHub × WINDTRE Partner — la presentazione inizia ora.",                                    visual: "welcome",   dur: 6500 },
];

const PREROLL = 500;
const TOTAL_MS = SCRIPT.reduce((a, s) => a + s.dur, 0); // 110000

/* ============================================================
   CODE RAIN CANVAS — futuristic backdrop, single canvas, low CPU
   Renders cascading glyphs at sub-30fps with low density.
   ============================================================ */
function CodeRainCanvas({ active }) {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();
    const onResize = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    };
    window.addEventListener("resize", onResize);

    const fontSize = 16;
    const columns = Math.max(20, Math.floor(canvas.clientWidth / fontSize));
    const drops = Array.from({ length: columns }, () => Math.random() * -50);
    const glyphs = "01アイウエオカキクケコQR{}<>;:/\\#$%&*▪◾◼·•";
    const accent = ["#C8FF00", "#FF6600", "#FFFFFF"];

    const draw = (now) => {
      if (!active) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      // Throttle to ~22 fps to save CPU
      if (now - lastRef.current < 45) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastRef.current = now;

      // Trailing fade
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      ctx.font = `${fontSize}px ui-monospace, Menlo, monospace`;
      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        // Head bright, trail dimmer
        const isHead = Math.random() > 0.93;
        if (isHead) {
          ctx.fillStyle = accent[(Math.random() * accent.length) | 0];
          ctx.globalAlpha = 0.95;
        } else {
          ctx.fillStyle = "rgba(200,255,0,0.55)";
          ctx.globalAlpha = 0.35 + Math.random() * 0.35;
        }
        ctx.fillText(ch, x, y);

        // Reset / drop fall
        if (y > canvas.clientHeight && Math.random() > 0.965) drops[i] = -2;
        drops[i] += 1;
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        opacity: 0.22,
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ============================================================
   GEO FIELD — immersive QR-inspired geometry flying from the void
   Colorful cubes, squares, circles & rings emerge from deep space,
   rush toward the viewer and dissolve — an abstract composition
   that frames the forming text. GPU-only transforms.
   ============================================================ */
const GEO_COLORS = ["#C8FF00", "#FF6600", "#FFFFFF", "#00E5FF", "#FF2D9B"];
const GEO_TYPES = ["square", "squareOutline", "circle", "ring", "cube", "plus", "diamond"];

function GeoShape({ type, color, size }) {
  const glow = `0 0 ${size * 0.7}px ${color}, 0 0 ${size * 0.25}px ${color}`;
  const radius = size * 0.14;
  if (type === "circle")
    return <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: glow }} />;
  if (type === "ring")
    return <div style={{ width: size, height: size, borderRadius: "50%", border: `${Math.max(2, size * 0.13)}px solid ${color}`, boxShadow: glow }} />;
  if (type === "square")
    return <div style={{ width: size, height: size, borderRadius: radius, background: color, boxShadow: glow }} />;
  if (type === "squareOutline")
    return <div style={{ width: size, height: size, borderRadius: radius, border: `${Math.max(2, size * 0.11)}px solid ${color}`, boxShadow: glow }} />;
  if (type === "diamond")
    return <div style={{ width: size, height: size, borderRadius: radius, background: `${color}`, transform: "rotate(45deg)", boxShadow: glow }} />;
  if (type === "plus")
    return (
      <div style={{ position: "relative", width: size, height: size }}>
        <div style={{ position: "absolute", top: "40%", left: 0, width: "100%", height: "20%", borderRadius: 99, background: color, boxShadow: glow }} />
        <div style={{ position: "absolute", left: "40%", top: 0, height: "100%", width: "20%", borderRadius: 99, background: color, boxShadow: glow }} />
      </div>
    );
  // cube — CSS 3D wireframe
  const h = size / 2;
  const faces = [
    `translateZ(${h}px)`, `translateZ(-${h}px)`,
    `rotateY(90deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`,
    `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`,
  ];
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", transform: "rotateX(22deg) rotateY(28deg)" }}>
      {faces.map((tf, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: radius * 0.6, border: `1.5px solid ${color}`, background: `${color}12`, transform: tf, boxShadow: `inset 0 0 ${size * 0.45}px ${color}66` }} />
      ))}
    </div>
  );
}

function GeoField({ active }) {
  const shapes = useMemo(() => {
    return Array.from({ length: 52 }).map((_, i) => {
      const r = (n) => (((i + 1) * 9301 + n * 49297) % 233280) / 233280;
      return {
        id: i,
        type: GEO_TYPES[Math.floor(r(1) * GEO_TYPES.length)],
        color: GEO_COLORS[Math.floor(r(2) * GEO_COLORS.length)],
        x: 2 + r(3) * 96,
        y: 2 + r(4) * 96,
        size: 10 + r(5) * 54,
        delay: r(6) * 3.5,
        dur: 2.2 + r(7) * 2.6,
        drift: (r(8) - 0.5) * 46,
        spin: (r(9) - 0.5) * 820,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: 1000 }} aria-hidden>
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, willChange: "transform,opacity,filter" }}
          initial={{ opacity: 0 }}
          animate={
            active
              ? {
                  opacity: [0, 0.9, 0.95, 0],
                  scale: [0.12, 0.5, 1.4, 2.8],
                  x: [0, s.drift, s.drift * 2.2],
                  y: [0, -s.drift, -s.drift * 1.8],
                  rotate: [0, s.spin],
                  filter: ["blur(12px)", "blur(3px)", "blur(0px)", "blur(10px)"],
                }
              : { opacity: 0 }
          }
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeIn" }}
        >
          <GeoShape type={s.type} color={s.color} size={s.size} />
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   SPATIAL BACKDROP — soft nebulae + faint orbital rings
   ============================================================ */
function Backdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: "#000" }} />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "85%",
          height: "85%",
          top: "-15%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(255,102,0,0.20) 0%, rgba(255,102,0,0) 60%)",
          willChange: "transform",
        }}
        animate={{ x: [0, 60, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "75%",
          height: "75%",
          bottom: "-20%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(200,255,0,0.16) 0%, rgba(200,255,0,0) 60%)",
          willChange: "transform",
        }}
        animate={{ x: [0, -40, 20, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Faint orbital rings (CSS, no JS animation cost) */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "170%",
          height: "170%",
          transform: "translate(-50%,-50%)",
          border: "1px solid rgba(200,255,0,0.04)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "130%",
          height: "130%",
          transform: "translate(-50%,-50%)",
          border: "1px solid rgba(255,102,0,0.05)",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.95) 100%)",
        }}
      />
    </div>
  );
}

/* ============================================================
   VISUAL: QR Construction (modular grid build-in) — phase 0
   ============================================================ */
const QR_SIZE = 17;
function buildQRPattern() {
  const grid = Array.from({ length: QR_SIZE }, () => Array(QR_SIZE).fill(0));
  const placeFinder = (r, c) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = edge || inner ? 1 : 0;
      }
    }
  };
  placeFinder(0, 0);
  placeFinder(0, QR_SIZE - 7);
  placeFinder(QR_SIZE - 7, 0);
  for (let i = 8; i < QR_SIZE - 8; i++) {
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }
  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c >= QR_SIZE - 8) ||
        (r >= QR_SIZE - 8 && c < 8) ||
        r === 6 ||
        c === 6;
      if (!inFinder && grid[r][c] === 0) {
        grid[r][c] = rand() > 0.5 ? 1 : 0;
      }
    }
  }
  return grid;
}

function QRConstruction() {
  const grid = useMemo(buildQRPattern, []);
  const cells = useMemo(() => {
    const arr = [];
    for (let r = 0; r < QR_SIZE; r++) {
      for (let c = 0; c < QR_SIZE; c++) {
        if (grid[r][c]) arr.push({ r, c });
      }
    }
    return arr
      .map((v) => ({ v, k: Math.random() }))
      .sort((a, b) => a.k - b.k)
      .map((o) => o.v);
  }, [grid]);

  return (
    <div
      style={{
        width: "clamp(7rem, 22cqw, 18rem)",
        aspectRatio: "1/1",
        display: "grid",
        gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${QR_SIZE}, 1fr)`,
        gap: "1.5%",
      }}
    >
      {cells.map(({ r, c }, idx) => (
        <motion.div
          key={`${r}-${c}`}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.35,
            delay: 0.15 + (idx / cells.length) * 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            gridRow: r + 1,
            gridColumn: c + 1,
            background: "#fff",
            borderRadius: "10%",
            willChange: "transform,opacity",
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   VISUAL: Wireframe rotating cube — "genesi" phase (code feel)
   ============================================================ */
function GenesiCube() {
  return (
    <motion.div
      style={{
        width: "clamp(7rem, 20cqw, 16rem)",
        height: "clamp(7rem, 20cqw, 16rem)",
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      animate={{ rotateY: 360, rotateX: 18 }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    >
      {[
        { tf: "translateZ(60px)" },
        { tf: "translateZ(-60px) rotateY(180deg)" },
        { tf: "rotateY(90deg) translateZ(60px)" },
        { tf: "rotateY(-90deg) translateZ(60px)" },
        { tf: "rotateX(90deg) translateZ(60px)" },
        { tf: "rotateX(-90deg) translateZ(60px)" },
      ].map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: "20%",
            border: "1px solid rgba(200,255,0,0.55)",
            boxShadow: "inset 0 0 30px rgba(200,255,0,0.15)",
            transform: f.tf,
            background:
              "linear-gradient(135deg, rgba(200,255,0,0.04), rgba(255,102,0,0.04))",
          }}
        />
      ))}
      {/* Center QR badge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          color: "#C8FF00",
          fontFamily: "ui-monospace, monospace",
          fontSize: "clamp(0.7rem, 1.4cqw, 1.2rem)",
          letterSpacing: "0.2em",
          textShadow: "0 0 10px rgba(200,255,0,0.8)",
        }}
      >
        QR.HUB
      </div>
    </motion.div>
  );
}

/* ============================================================
   VISUAL: Metrics — 3 KPI on parallel rails
   ============================================================ */
function MetricsRail() {
  const items = [
    { v: "30",     l: "GIORNI",     c: "#FF6600" },
    { v: "1.699",  l: "SCANSIONI",  c: "#FFFFFF" },
    { v: "1.311",  l: "RELAZIONI",  c: "#C8FF00" },
  ];
  return (
    <div className="flex gap-[5cqw] items-end">
      {items.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.25, ease: EASE }}
          className="flex flex-col items-center"
        >
          <span
            style={{
              color: m.c,
              fontSize: "clamp(2.4rem, 7cqw, 7rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              textShadow: `0 0 30px ${m.c}55`,
            }}
          >
            {m.v}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(0.55rem, 1cqw, 1rem)",
              letterSpacing: "0.25em",
              marginTop: "1cqh",
            }}
          >
            {m.l}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   VISUAL: Cartellino — SVG vector materialization
   ============================================================ */
function CartellinoVisual() {
  // Build a proper QR-style 21x21 matrix with finder squares, timing, alignment
  const QR_N = 21;
  const cells = useMemo(() => {
    const grid = Array.from({ length: QR_N }, () => Array(QR_N).fill(0));
    // 7x7 finder squares in 3 corners
    const placeFinder = (r, c) => {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
        const onEdge = i === 0 || i === 6 || j === 0 || j === 6;
        const inner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = onEdge || inner ? 1 : 0;
      }
    };
    placeFinder(0, 0);
    placeFinder(0, QR_N - 7);
    placeFinder(QR_N - 7, 0);
    // Timing patterns
    for (let i = 8; i < QR_N - 8; i++) {
      grid[6][i] = i % 2 === 0 ? 1 : 0;
      grid[i][6] = i % 2 === 0 ? 1 : 0;
    }
    // Single alignment pattern (bottom-right area, 5x5)
    const ar = QR_N - 9, ac = QR_N - 9;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const edge = i === 0 || i === 4 || j === 0 || j === 4;
      const center = i === 2 && j === 2;
      grid[ar + i][ac + j] = edge || center ? 1 : 0;
    }
    // Data modules (deterministic seed)
    let seed = 91;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let r = 0; r < QR_N; r++) for (let c = 0; c < QR_N; c++) {
      const inFinder =
        (r < 8 && c < 8) ||
        (r < 8 && c >= QR_N - 8) ||
        (r >= QR_N - 8 && c < 8) ||
        (r >= ar && r < ar + 5 && c >= ac && c < ac + 5) ||
        r === 6 || c === 6;
      if (!inFinder && grid[r][c] === 0) {
        grid[r][c] = rand() > 0.5 ? 1 : 0;
      }
    }
    // Collect cells with stable stagger key (do not randomize order — keeps vector clean look)
    const arr = [];
    for (let r = 0; r < QR_N; r++) for (let c = 0; c < QR_N; c++) {
      if (grid[r][c]) arr.push({ r, c });
    }
    return arr;
  }, []);

  // Layout: QR area starting positions (on a white panel over the dark card)
  const QR_X = 50, QR_Y = 132, QR_W = 100;
  const cell = QR_W / QR_N; // module size
  const mr = cell * 0.28; // rounded module radius

  return (
    <motion.svg
      viewBox="0 0 200 300"
      style={{
        width: "clamp(8rem, 19cqw, 16rem)",
        height: "auto",
        filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.65)) drop-shadow(0 0 40px rgba(200,255,0,0.12))",
        willChange: "transform,opacity",
      }}
      initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <defs>
        <linearGradient id="cardG" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#23252c" />
          <stop offset="55%" stopColor="#14151a" />
          <stop offset="100%" stopColor="#0a0b0e" />
        </linearGradient>
        <linearGradient id="edgeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C8FF00" />
          <stop offset="50%" stopColor="#9ad000" />
          <stop offset="100%" stopColor="#FF6600" />
        </linearGradient>
        <linearGradient id="topG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6600" />
          <stop offset="55%" stopColor="#ff8a3d" />
          <stop offset="100%" stopColor="#C8FF00" />
        </linearGradient>
        <linearGradient id="glossG" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="panelG" cx="0.5" cy="0.4" r="0.8">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef0ee" />
        </radialGradient>
      </defs>

      {/* Lanyard straps converging to a metallic clip */}
      <motion.path
        d="M 86 2 L 96 40 M 114 2 L 104 40"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      {/* Metal clip */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
      >
        <rect x="90" y="34" width="20" height="12" rx="3" fill="#3a3d44" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        <rect x="96" y="30" width="8" height="8" rx="2" fill="#54585f" />
      </motion.g>

      {/* Glowing accent border (draws in) */}
      <motion.rect
        x="18" y="46" width="164" height="234" rx="20"
        fill="none"
        stroke="url(#edgeG)"
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{ pathLength: 1, opacity: [1, 1, 0.55] }}
        transition={{ pathLength: { duration: 1.0, delay: 0.35, ease: EASE }, opacity: { duration: 0.5, delay: 1.3, ease: EASE } }}
        style={{ filter: "drop-shadow(0 0 6px rgba(200,255,0,0.5))" }}
      />
      {/* Dark glass card body */}
      <motion.rect
        x="18" y="46" width="164" height="234" rx="20"
        fill="url(#cardG)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease: EASE }}
      />
      {/* Glossy diagonal highlight */}
      <motion.path
        d="M 18 66 Q 18 46 38 46 L 150 46 L 70 280 L 38 280 Q 18 280 18 260 Z"
        fill="url(#glossG)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.45 }}
      />

      {/* Top accent bar */}
      <motion.g
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, delay: 1.6, ease: EASE }}
        style={{ transformOrigin: "100px 66px" }}
      >
        <rect x="34" y="62" width="132" height="3.5" rx="1.75" fill="url(#topG)" />
      </motion.g>

      {/* NAME */}
      <motion.text
        x="100" y="92"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="16"
        fontWeight="800"
        style={{ letterSpacing: "0.2em" }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.0, ease: EASE }}
      >
        NAME
      </motion.text>
      {/* Role chip */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 2.15, ease: EASE }}
      >
        <rect x="62" y="102" width="76" height="15" rx="7.5" fill="rgba(200,255,0,0.12)" stroke="rgba(200,255,0,0.5)" strokeWidth="0.8" />
        <text x="100" y="112.5" textAnchor="middle" fill="#C8FF00" fontSize="7" fontWeight="700" style={{ letterSpacing: "0.18em" }}>
          STORE SPECIALIST
        </text>
      </motion.g>

      {/* QR — white rounded panel */}
      <motion.rect
        x={QR_X - 10} y={QR_Y - 10}
        width={QR_W + 20} height={QR_W + 20}
        rx="12"
        fill="url(#panelG)"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 2.3, ease: EASE }}
        style={{ transformOrigin: "100px 182px", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))" }}
      />

      {/* QR — rounded finder squares */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 2.55, ease: EASE }}
      >
        {/* Top-left finder */}
        <rect x={QR_X} y={QR_Y} width={cell * 7} height={cell * 7} rx={cell} fill="#0a0b0e" />
        <rect x={QR_X + cell} y={QR_Y + cell} width={cell * 5} height={cell * 5} rx={cell * 0.7} fill="#fff" />
        <rect x={QR_X + cell * 2} y={QR_Y + cell * 2} width={cell * 3} height={cell * 3} rx={cell * 0.6} fill="#0a0b0e" />
        {/* Top-right finder */}
        <rect x={QR_X + cell * (QR_N - 7)} y={QR_Y} width={cell * 7} height={cell * 7} rx={cell} fill="#0a0b0e" />
        <rect x={QR_X + cell * (QR_N - 6)} y={QR_Y + cell} width={cell * 5} height={cell * 5} rx={cell * 0.7} fill="#fff" />
        <rect x={QR_X + cell * (QR_N - 5)} y={QR_Y + cell * 2} width={cell * 3} height={cell * 3} rx={cell * 0.6} fill="#0a0b0e" />
        {/* Bottom-left finder */}
        <rect x={QR_X} y={QR_Y + cell * (QR_N - 7)} width={cell * 7} height={cell * 7} rx={cell} fill="#0a0b0e" />
        <rect x={QR_X + cell} y={QR_Y + cell * (QR_N - 6)} width={cell * 5} height={cell * 5} rx={cell * 0.7} fill="#fff" />
        <rect x={QR_X + cell * 2} y={QR_Y + cell * (QR_N - 5)} width={cell * 3} height={cell * 3} rx={cell * 0.6} fill="#0a0b0e" />
      </motion.g>

      {/* QR — rounded data modules with smooth grid fill */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2.95 }}
      >
        {cells
          .filter(({ r, c }) => {
            const inTLF = r < 7 && c < 7;
            const inTRF = r < 7 && c >= QR_N - 7;
            const inBLF = r >= QR_N - 7 && c < 7;
            return !(inTLF || inTRF || inBLF);
          })
          .map(({ r, c }, i, arr) => (
            <motion.rect
              key={`${r}-${c}`}
              x={QR_X + c * cell + cell * 0.06}
              y={QR_Y + r * cell + cell * 0.06}
              width={cell * 0.88}
              height={cell * 0.88}
              rx={mr}
              fill="#0a0b0e"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.18,
                delay: 3.05 + (i / arr.length) * 0.9,
                ease: "easeOut",
              }}
            />
          ))}
      </motion.g>

      {/* Bottom brand line */}
      <motion.text
        x="100" y="268"
        textAnchor="middle"
        fill="rgba(255,255,255,0.45)"
        fontSize="7"
        fontWeight="600"
        style={{ letterSpacing: "0.2em" }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 4.1, ease: EASE }}
      >
        × WINDTRE PARTNER
      </motion.text>
    </motion.svg>
  );
}

/* ============================================================
   VISUAL: Badge wireframe — phase "badge"
   ============================================================ */
function BadgeVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      style={{
        width: "clamp(7rem, 18cqw, 14rem)",
        height: "clamp(10rem, 25cqw, 20rem)",
        position: "relative",
      }}
    >
      {/* lanyard */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "-30%",
          width: "4px",
          height: "30%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.4))",
          transform: "translateX(-50%)",
        }}
      />
      {/* card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #f4f4f4 100%)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {/* orange header */}
        <div
          style={{
            height: "22%",
            background: "linear-gradient(135deg, #FF6600 0%, #ff8533 100%)",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: 800,
            letterSpacing: "0.2em",
            fontSize: "clamp(0.55rem, 1.1cqw, 1rem)",
          }}
        >
          NAME
        </div>
        {/* QR */}
        <div
          style={{
            margin: "12% 18%",
            aspectRatio: "1/1",
            background: "#000",
            backgroundImage:
              "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)",
            backgroundSize: "20% 20%",
            backgroundPosition: "0 0, 10% 10%",
            border: "8px solid #fff",
            outline: "2px solid #000",
          }}
        />
        <div
          style={{
            textAlign: "center",
            fontSize: "clamp(0.45rem, 0.9cqw, 0.8rem)",
            color: "#FF6600",
            fontWeight: 700,
            letterSpacing: "0.15em",
          }}
        >
          STORE SPECIALIST
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   VISUAL: Flow — 4 nodes connected
   ============================================================ */
function FlowVisual() {
  const steps = ["SCAN", "LAND", "APP", "PUSH"];
  return (
    <div className="flex items-center gap-[2cqw]">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.35, ease: EASE }}
            style={{
              width: "clamp(3rem, 7cqw, 6rem)",
              height: "clamp(3rem, 7cqw, 6rem)",
              borderRadius: "50%",
              border: `2px solid ${i % 2 === 0 ? "#C8FF00" : "#FF6600"}`,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontFamily: "ui-monospace, monospace",
              fontSize: "clamp(0.55rem, 1cqw, 1rem)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              boxShadow: `0 0 30px ${i % 2 === 0 ? "rgba(200,255,0,0.45)" : "rgba(255,102,0,0.45)"}`,
              willChange: "transform,opacity",
            }}
          >
            {s}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.4 + i * 0.35, ease: EASE }}
              style={{
                width: "clamp(2rem, 5cqw, 5rem)",
                height: "2px",
                background: "linear-gradient(90deg, #C8FF00, #FF6600)",
                transformOrigin: "left center",
                boxShadow: "0 0 14px rgba(200,255,0,0.4)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   VISUAL: Push cards stacking
   ============================================================ */
function PushCards() {
  const cards = [
    { tint: "#FF6600", title: "iPhone 17 · -50%",  body: "WINDTRE Mobile · Luce&Gas" },
    { tint: "#C8FF00", title: "Sblocca le Passioni",   body: "Migrazione FIB · Bovolone" },
    { tint: "#FFFFFF", title: "A casa tutto bene",     body: "WINDTRE Protetti · Casa" },
  ];
  return (
    <div className="relative" style={{ width: "clamp(15rem, 38cqw, 30rem)", height: "clamp(8rem, 18cqw, 14rem)" }}>
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, x: i * 30 - 30, rotate: i * 4 - 4 }}
          animate={{ opacity: 1, y: i * 22 - 22, x: i * 38 - 38, rotate: i * 5 - 5 }}
          transition={{ duration: 0.7, delay: 0.2 + i * 0.25, ease: EASE }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            background: "rgba(20,20,22,0.85)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${c.tint}55`,
            boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${c.tint}33`,
            padding: "1.2cqw 1.6cqw",
            color: "#fff",
            zIndex: 3 - i,
          }}
        >
          <div style={{ fontSize: "clamp(0.65rem,1.1cqw,1rem)", color: c.tint, letterSpacing: "0.18em", fontWeight: 700, marginBottom: "0.6cqh" }}>
            NOTIFICA · ORA
          </div>
          <div style={{ fontSize: "clamp(0.85rem,1.6cqw,1.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>{c.title}</div>
          <div style={{ fontSize: "clamp(0.6rem,1cqw,0.9rem)", opacity: 0.7, marginTop: "0.4cqh" }}>{c.body}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   VISUAL: Chart/heartbeat pulse — insights phase
   ============================================================ */
function ChartPulse() {
  const points = "0,40 12,38 22,30 32,42 42,18 52,46 62,28 72,36 82,12 92,40 100,32";
  return (
    <div style={{ width: "clamp(16rem, 42cqw, 36rem)" }}>
      <svg viewBox="0 0 100 60" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="cl" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#FF6600" />
            <stop offset="100%" stopColor="#C8FF00" />
          </linearGradient>
        </defs>
        <motion.polyline
          points={points}
          fill="none"
          stroke="url(#cl)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 6px rgba(200,255,0,0.6))" }}
        />
        {/* moving dot */}
        <motion.circle
          r="1.4"
          fill="#C8FF00"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, ease: EASE }}
        >
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M0,40 L12,38 L22,30 L32,42 L42,18 L52,46 L62,28 L72,36 L82,12 L92,40 L100,32" />
        </motion.circle>
      </svg>
      <div className="flex items-center gap-[2cqw] mt-[2cqh] justify-center">
        {[
          { v: "18:00", l: "PICCO" },
          { v: "iOS", l: "DISPOSITIVO" },
          { v: "x3", l: "CONVERSIONI" },
        ].map((k, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.2, duration: 0.5 }}
            className="text-center"
          >
            <div style={{ color: "#C8FF00", fontWeight: 800, fontSize: "clamp(0.9rem,1.8cqw,1.7rem)", letterSpacing: "-0.02em" }}>{k.v}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.5rem,0.9cqw,0.85rem)", letterSpacing: "0.2em" }}>{k.l}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VISUAL: Roadmap — 5 feature chips (Update Luglio)
   ============================================================ */
function RoadmapVisual() {
  const items = [
    { t: "Dashboard Store Manager",  c: "#FF6600" },
    { t: "Notifiche Push Annunci",   c: "#C8FF00" },
    { t: "Store Landing",            c: "#FFFFFF" },
    { t: "Analisi Vendor",           c: "#FF6600" },
    { t: "Funnel Marketing",         c: "#C8FF00" },
  ];
  return (
    <div
      className="grid gap-[1.2cqw]"
      style={{
        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        width: "clamp(20rem, 50cqw, 42rem)",
      }}
    >
      {items.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.12 + i * 0.13, ease: EASE }}
          style={{
            gridColumn: i === 3 ? "1 / span 1" : i === 4 ? "2 / span 2" : "auto",
            border: `1px solid ${m.c}55`,
            borderLeft: `3px solid ${m.c}`,
            background: "rgba(255,255,255,0.03)",
            padding: "1.4cqh 1.2cqw",
            borderRadius: "10px",
            color: "#fff",
            backdropFilter: "blur(6px)",
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.04em",
            fontSize: "clamp(0.6rem,1.15cqw,1.15rem)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.7cqw",
            willChange: "transform,opacity",
          }}
        >
          <span style={{ color: m.c, fontSize: "clamp(0.45rem,0.85cqw,0.85rem)", opacity: 0.7 }}>0{i + 1}</span>
          {m.t}
        </motion.div>
      ))}
    </div>
  );
}

/* ============================================================
   VISUAL: Welcome — big QRHub lockup
   ============================================================ */
function WelcomeLockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="flex flex-col items-center"
    >
      <span
        style={{
          color: "#C8FF00",
          fontSize: "clamp(3.2rem, 12.5cqw, 15rem)",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          lineHeight: 0.9,
          textShadow:
            "0 3px 0 rgba(0,0,0,0.45), 0 6px 0 rgba(0,0,0,0.28), 0 11px 30px rgba(0,0,0,0.6), 0 0 80px rgba(200,255,0,0.55)",
        }}
      >
        QRHub
      </span>
      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(0.8rem,1.8cqw,1.8rem)", marginTop: "0.5cqh" }}>
        × WINDTRE Partner
      </span>
    </motion.div>
  );
}

/* ============================================================
   Per-phase visual switcher
   ============================================================ */
function PhaseVisual({ id }) {
  switch (id) {
    case "qr":         return <QRConstruction />;
    case "code":       return <GenesiCube />;
    case "metrics":    return <MetricsRail />;
    case "cartellino": return <CartellinoVisual />;
    case "badge":      return <BadgeVisual />;
    case "flow":       return <FlowVisual />;
    case "push":       return <PushCards />;
    case "chart":      return <ChartPulse />;
    case "roadmap":    return <RoadmapVisual />;
    case "welcome":    return <WelcomeLockup />;
    default:           return null;
  }
}

/* ============================================================
   SyllableText — letters compose from space (random offsets in)
   ============================================================ */
function SyllableText({ children, baseDelay = 0, charDelay = 0.035, style, mode = "char" }) {
  const text = String(children || "");
  const tokens = mode === "word" ? text.split(/(\s+)/) : text.split("");
  return (
    <span style={{ display: "inline-block", perspective: 700, ...style }}>
      {tokens.map((c, i) => {
        if (c === " " || /^\s+$/.test(c)) {
          return <span key={i} style={{ display: "inline-block", width: "0.32em" }}>&nbsp;</span>;
        }
        // Stable-ish random per char index (deterministic so re-renders match)
        const sx = (((i * 73) % 100) / 100 - 0.5) * 220;
        const sy = (((i * 41) % 100) / 100 - 0.5) * 150;
        const sr = (((i * 17) % 100) / 100 - 0.5) * 55;
        const sz = -220 - (((i * 53) % 100) / 100) * 420;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: sx, y: sy, z: sz, rotate: sr, scale: 2.6, filter: "blur(16px)" }}
            animate={{ opacity: 1, x: 0, y: 0, z: 0, rotate: 0, scale: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              delay: baseDelay + i * charDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ display: "inline-block", whiteSpace: "pre", willChange: "transform,opacity,filter" }}
          >
            {c}
          </motion.span>
        );
      })}
    </span>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SpatialIntro({ onDone }) {
  const [phase, setPhase] = useState(-1);
  const [muted, setMuted] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const toggleFs = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);
  const [skipped, setSkipped] = useState(false);
  const audioRef = useRef(null);

  const finish = useCallback(() => {
    if (skipped) return;
    setSkipped(true);
    const a = audioRef.current;
    if (a) {
      try {
        // soft fade-out
        const fade = setInterval(() => {
          if (!audioRef.current) return clearInterval(fade);
          if (audioRef.current.volume <= 0.05) {
            audioRef.current.pause();
            clearInterval(fade);
          } else {
            audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.08);
          }
        }, 50);
      } catch (_e) { /* noop */ }
    }
    setTimeout(() => onDone && onDone(), 700);
  }, [skipped, onDone]);

  useEffect(() => {
    // Start audio (parent already gated by user gesture, autoplay allowed)
    const a = audioRef.current;
    if (a) {
      a.volume = 0;
      const p = a.play();
      if (p && p.catch) p.catch(() => { /* ignore autoplay block */ });
      // gentle fade-in
      let t = 0;
      const id = setInterval(() => {
        t += 60;
        if (!audioRef.current) return clearInterval(id);
        const target = 0.85;
        audioRef.current.volume = Math.min(target, t / 1400);
        if (audioRef.current.volume >= target) clearInterval(id);
      }, 60);
    }

    // Schedule visual phases
    const timers = [];
    let acc = PREROLL;
    SCRIPT.forEach((s, i) => {
      timers.push(setTimeout(() => setPhase(i), acc));
      acc += s.dur;
    });
    timers.push(setTimeout(() => finish(), acc + 400));

    return () => {
      timers.forEach(clearTimeout);
      try { audioRef.current && audioRef.current.pause(); } catch (_e) { /* noop */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade audio out gently when the QRHub logo (final phase) appears —
  // play a bit longer, then fade right before handing over to the slides.
  useEffect(() => {
    if (phase !== SCRIPT.length - 1) return;
    const a = audioRef.current;
    if (!a) return;
    let id;
    const startTimer = setTimeout(() => {
      id = setInterval(() => {
        const au = audioRef.current;
        if (!au) return clearInterval(id);
        if (au.volume <= 0.03) {
          au.volume = 0;
          clearInterval(id);
        } else {
          au.volume = Math.max(0, au.volume - 0.024);
        }
      }, 130);
    }, 2200);
    return () => {
      clearTimeout(startTimer);
      if (id) clearInterval(id);
    };
  }, [phase]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  };

  const current = phase >= 0 ? SCRIPT[phase] : null;

  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-hidden cursor-default"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6, ease: EASE }}
      data-testid="spatial-intro"
    >
      <Backdrop />
      <CodeRainCanvas active={phase >= 0} />
      <GeoField active={phase >= 0} />

      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Central stage */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[6cqw]">
        {/* Visual element (one at a time, clean stage) */}
        <div
          style={{
            minHeight: "30cqh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3cqh",
          }}
        >
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.id + "-vis"}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.04 }}
                transition={{ duration: 0.75, ease: EASE }}
                style={{ willChange: "transform,opacity" }}
              >
                <PhaseVisual id={current.visual} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text block */}
        <div style={{ textAlign: "center", maxWidth: "82cqw", minHeight: "16cqh" }}>
          <AnimatePresence mode="wait">
            {current && current.id !== "welcome" && (
              <motion.div
                key={current.id + "-txt"}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <h2
                  style={{
                    color: "#ffffff",
                    fontSize: "clamp(1.9rem, 6cqw, 6.6rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.045em",
                    lineHeight: 1.02,
                    textShadow:
                      "0 2px 0 #161616, 0 4px 0 #101010, 0 6px 1px rgba(0,0,0,0.4), 0 9px 20px rgba(0,0,0,0.7), 0 0 60px rgba(200,255,0,0.20)",
                    margin: 0,
                  }}
                >
                  <SyllableText baseDelay={0.05}>{current.main}</SyllableText>
                  {current.main2 && (
                    <>
                      {" "}
                      <span style={{ color: "#FF6600" }}>
                        <SyllableText baseDelay={0.4}>{current.main2}</SyllableText>
                      </span>
                    </>
                  )}
                </h2>
                {current.sub && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.62)",
                      fontSize: "clamp(0.75rem, 1.7cqw, 1.6rem)",
                      marginTop: "1.6cqh",
                      maxWidth: "62cqw",
                      marginLeft: "auto",
                      marginRight: "auto",
                      lineHeight: 1.35,
                    }}
                  >
                    <SyllableText baseDelay={0.75} charDelay={0.018} mode="word">
                      {current.sub}
                    </SyllableText>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div
        className="absolute z-[110] flex items-center gap-[1cqw]"
        style={{ right: "2cqw", top: "2cqw" }}
      >
        <button
          onClick={toggleFs}
          aria-label={isFs ? "Esci da schermo intero" : "Schermo intero"}
          className="ctrl-btn"
          style={{
            width: "clamp(2rem,3.2cqw,3.4rem)",
            height: "clamp(2rem,3.2cqw,3.4rem)",
          }}
          data-testid="intro-fullscreen"
        >
          {isFs ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Riattiva audio" : "Silenzia"}
          className="ctrl-btn"
          style={{
            width: "clamp(2rem,3.2cqw,3.4rem)",
            height: "clamp(2rem,3.2cqw,3.4rem)",
          }}
          data-testid="intro-mute"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          onClick={finish}
          aria-label="Salta intro"
          className="ctrl-btn flex items-center"
          style={{
            paddingLeft: "1cqw",
            paddingRight: "1.2cqw",
            height: "clamp(2rem,3.2cqw,3.4rem)",
            gap: "0.5rem",
            fontSize: "clamp(0.6rem,1cqw,0.9rem)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-testid="intro-skip"
        >
          <SkipForward size={16} /> Salta
        </button>
      </div>

      {/* Progress dots */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
        style={{ bottom: "3cqh" }}
      >
        {SCRIPT.map((_, i) => (
          <motion.span
            key={i}
            className="rounded-full"
            animate={{
              width: i === phase ? 22 : 6,
              opacity: i <= phase ? 1 : 0.25,
              backgroundColor: i <= phase ? "#C8FF00" : "#ffffff",
            }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ height: 4 }}
          />
        ))}
      </div>

      {/* Phase timer (subtle, top-left) */}
      <div
        className="absolute z-[110]"
        style={{
          left: "2cqw",
          top: "2cqw",
          color: "rgba(200,255,0,0.55)",
          fontFamily: "ui-monospace, monospace",
          fontSize: "clamp(0.55rem,0.9cqw,0.85rem)",
          letterSpacing: "0.18em",
        }}
      >
        {String(Math.max(0, phase + 1)).padStart(2, "0")} / {String(SCRIPT.length).padStart(2, "0")} · QR.HUB.SYS
      </div>
    </motion.div>
  );
}
