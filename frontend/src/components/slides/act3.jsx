import React from "react";
import { motion } from "framer-motion";
import { SlideShell } from "../SlideShell";
import { FadeUp, Kicker } from "../primitives";
import { useCountUp } from "../../hooks/useCountUp";
import { ChannelBars, DailyChart } from "../charts/Charts";
import { KPI, SPECIALISTS } from "../../data/presentation";

const Counter = ({ value, decimals = 0, suffix = "", delay = 0 }) => {
  const txt = useCountUp(value, { decimals, delay });
  return <span>{txt}{suffix}</span>;
};

/* SLIDE 11 — Titolo Numeri */
const TitoloNumeri = () => (
  <SlideShell bg="numbers_slide_bg.png" overlay="linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)" contentClassName="justify-center">
    <FadeUp delay={0.1}><h2 className="t-display text-white">30 giorni.</h2></FadeUp>
    <FadeUp delay={0.4}><h2 className="t-h1 mt-[1cqh]" style={{ color: "#C8FF00" }}>I numeri parlano.</h2></FadeUp>
  </SlideShell>
);

/* SLIDE 12 — KPI Hero */
const KpiHero = () => (
  <SlideShell contentClassName="justify-center">
    <Kicker color="orange">Il primo mese in cifre</Kicker>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[3cqw] mt-[3cqh]">
      {KPI.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="t-kpi" style={{ color: k.color, fontSize: "clamp(1.6rem, 5cqw, 6rem)" }}>
            <Counter value={k.value} decimals={k.decimals || 0} suffix={k.suffix || ""} delay={300 + i * 120} />
          </div>
          <div className="t-kpilabel mt-[1.5cqh]">{k.label}</div>
        </motion.div>
      ))}
    </div>
  </SlideShell>
);

/* SLIDE 13 — Click per Canale */
const ClickCanale = () => (
  <SlideShell contentClassName="">
    <Kicker color="lime">Click per Canale</Kicker>
    <FadeUp delay={0.15}><h3 className="t-h3 text-white mb-[3cqh]">Dove va l'attenzione del cliente.</h3></FadeUp>
    <ChannelBars height="62cqh" />
  </SlideShell>
);

/* SLIDE 14 — Andamento Giornaliero */
const Andamento = () => (
  <SlideShell contentClassName="">
    <Kicker color="orange">Andamento Giornaliero</Kicker>
    <FadeUp delay={0.15}>
      <div className="flex items-center gap-[3cqw] mb-[2cqh]">
        <h3 className="t-h3 text-white">Scansioni QR vs Click WhatsApp.</h3>
        <div className="flex items-center gap-[2cqw]">
          <span className="flex items-center gap-2 t-body"><span className="w-3 h-3 rounded-sm" style={{ background: "#FF6600" }} />Scansioni</span>
          <span className="flex items-center gap-2 t-body"><span className="w-3 h-3 rounded-sm" style={{ background: "#C8FF00" }} />WhatsApp</span>
        </div>
      </div>
    </FadeUp>
    <DailyChart height="56cqh" />
  </SlideShell>
);

/* SLIDE 15 — Insight Chiave */
const Insight = () => {
  const items = [
    { big: "71%", txt: "dei click va su WhatsApp", c: "#C8FF00" },
    { big: "1 scansione", txt: "= 1 ingresso in negozio", c: "#FF6600", small: true },
    { big: "1 click", txt: "= 1 conversazione avviata", c: "#FFFFFF" },
  ];
  return (
    <SlideShell contentClassName="justify-center">
      <Kicker color="lime">Insight Chiave</Kicker>
      <div className="grid grid-cols-3 gap-[6cqw] mt-[4cqh]">
        {items.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.18, duration: 0.7 }}>
            <div
              className="t-num"
              style={{
                color: it.c,
                fontSize: it.small ? "clamp(1.1rem,3.2cqw,3.6rem)" : undefined,
                whiteSpace: "nowrap",
              }}
            >
              {it.big}
            </div>
            <p className="t-sub mt-[2.4cqh]">{it.txt}</p>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

/* SLIDE 16 — Top Venditori Giugno (top 10 per scansioni QR) */
const TopVenditori = () => {
  const ranked = [...SPECIALISTS].sort((a, b) => b.visits - a.visits);
  const max = ranked[0].visits;
  const totalScans = ranked.reduce((s, r) => s + r.visits, 0);
  const medals = ["#FFD24A", "#C0C7D0", "#CD7F4D"];
  return (
    <SlideShell contentClassName="justify-center">
      <Kicker color="lime">Top Venditori · Giugno</Kicker>
      <FadeUp delay={0.15}>
        <h2 className="t-h2 text-white mb-[1cqh]">I migliori del mese.</h2>
      </FadeUp>
      <FadeUp delay={0.25}>
        <p className="t-body text-white/45 mb-[3cqh]">
          {totalScans} scansioni totali · 10 venditori attivi
        </p>
      </FadeUp>
      <div className="space-y-[1.1cqh]">
        {ranked.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.55 }}
            className="flex items-center gap-[1.4cqw]"
          >
            <span
              className="font-extrabold tabular-nums text-right"
              style={{
                fontSize: "clamp(0.85rem,1.8cqw,2rem)",
                color: i < 3 ? medals[i] : "#52525B",
                width: "3cqw",
              }}
            >
              {i + 1}
            </span>
            <span
              className="text-white font-semibold truncate"
              style={{ width: "14cqw", fontSize: "clamp(0.78rem,1.5cqw,1.7rem)" }}
            >
              {s.name}
            </span>
            <div
              className="flex-1 rounded-full bg-white/5 overflow-hidden"
              style={{ height: "2cqh" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: i < 3 ? medals[i] : "#FF6600" }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.visits / max) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span
              className="text-white font-bold tabular-nums"
              style={{
                width: "7cqw",
                textAlign: "right",
                fontSize: "clamp(0.78rem,1.5cqw,1.7rem)",
              }}
            >
              {s.visits}{" "}
              <span className="text-white/40" style={{ fontSize: "0.62em" }}>
                QR
              </span>
            </span>
            <span
              className="font-bold tabular-nums"
              style={{
                width: "6.5cqw",
                textAlign: "right",
                fontSize: "clamp(0.78rem,1.5cqw,1.7rem)",
                color: "#25D366",
              }}
            >
              {s.clicks}{" "}
              <span className="text-white/40" style={{ fontSize: "0.62em" }}>
                WA
              </span>
            </span>
            <span
              className="text-white/50 tabular-nums"
              style={{
                width: "5.5cqw",
                textAlign: "right",
                fontSize: "clamp(0.7rem,1.2cqw,1.4rem)",
              }}
            >
              {s.conv}
            </span>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

export default [<TitoloNumeri key="s11" />, <KpiHero key="s12" />, <ClickCanale key="s13" />, <Andamento key="s14" />, <Insight key="s15" />, <TopVenditori key="s16" />];
