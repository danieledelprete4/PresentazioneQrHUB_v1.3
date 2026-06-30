import React from "react";
import { motion } from "framer-motion";
import { SlideShell } from "../SlideShell";
import { FadeUp, Kicker } from "../primitives";
import { GitBranch, ShieldCheck, Boxes, BadgeCheck, MessageCircle, Megaphone, Clock } from "lucide-react";

/* SLIDE 22 — Open Source */
const OpenSource = () => {
  const points = [
    { icon: <Boxes size={28} />, t: "Multi-tenant nativo", c: "#C8FF00" },
    { icon: <ShieldCheck size={28} />, t: "GDPR ready", c: "#FF6600" },
    { icon: <GitBranch size={28} />, t: "Open source MIT", c: "#C8FF00" },
    { icon: <BadgeCheck size={28} />, t: "Zero licenze", c: "#FF6600" },
  ];
  return (
    <SlideShell contentClassName="justify-center">
      <Kicker color="lime">La Filosofia</Kicker>
      <FadeUp delay={0.2}><h2 className="t-h1 text-white max-w-[60cqw]">Tuo. Open per scelta.</h2></FadeUp>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[3cqw] mt-[5cqh]">
        {points.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }} className="flex flex-col gap-[2cqh]">
            <span style={{ color: p.c }}>{p.icon}</span>
            <span className="t-h3 text-white">{p.t}</span>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

/* SLIDE 23 — Tips & Best Practice */
const Tips = () => {
  const tips = [
    { n: "1", t: "Badge sempre al collo", s: "Il QR è visibile, sempre.", icon: <BadgeCheck size={26} /> },
    { n: "2", t: "Invitare a scansionare", s: "«Mi salvi nel telefono?»", icon: <Megaphone size={26} /> },
    { n: "3", t: "Follow-up entro 24h", s: "Un messaggio WhatsApp.", icon: <MessageCircle size={26} /> },
  ];
  return (
    <SlideShell bg="tips_slide_bg.png" overlay="linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.9) 100%)" contentClassName="justify-center">
      <Kicker color="orange">Tips & Best Practice</Kicker>
      <FadeUp delay={0.15}><h2 className="t-h2 text-white mb-[5cqh]">3 consigli per il team.</h2></FadeUp>
      <div className="grid grid-cols-3 gap-[3cqw]">
        {tips.map((tip, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.18, duration: 0.7 }} className="border-l-2 pl-[2cqw]" style={{ borderColor: "#FF6600" }}>
            <div className="flex items-center gap-3 mb-[2cqh]" style={{ color: "#FF6600" }}>
              <span className="t-num" style={{ fontSize: "clamp(2rem,5cqw,5rem)" }}>{tip.n}</span>
              {tip.icon}
            </div>
            <h3 className="t-h3 text-white">{tip.t}</h3>
            <p className="t-sub mt-[1.5cqh]">{tip.s}</p>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

/* SLIDE 24 — Prossimi Passi */
const ProssimiPassi = () => {
  const roadmap = [
    { q: "Q3", t: "A/B testing landing", c: "#FF6600" },
    { q: "Q3", t: "Broadcast WhatsApp schedulati", c: "#FFB066" },
    { q: "Q4", t: "Integrazione CRM", c: "#C8FF00" },
  ];
  return (
    <SlideShell bg="roadmap_slide_bg.png" overlay="linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.88) 100%)" contentClassName="justify-center">
      <Kicker color="lime">Prossimi Passi</Kicker>
      <FadeUp delay={0.15}><h2 className="t-h2 text-white mb-[5cqh]">La rotta: Q3 → Q4.</h2></FadeUp>
      <div className="grid grid-cols-3 gap-[3cqw]">
        {roadmap.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2, duration: 0.7 }}>
            <div className="flex items-center gap-2 t-kicker mb-[2cqh]" style={{ color: r.c }}><Clock size={16} />{r.q}</div>
            <h3 className="t-h3 text-white">{r.t}</h3>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

/* SLIDE 25 — Vision */
const Vision = () => (
  <SlideShell overlay="radial-gradient(120% 120% at 50% 40%, rgba(200,255,0,0.06) 0%, rgba(0,0,0,0.9) 70%)" contentClassName="justify-center">
    <Kicker color="lime">Vision</Kicker>
    <FadeUp delay={0.2}>
      <h2 className="t-h1 text-white glow-lime max-w-[70cqw]">Progettato per evolvere.</h2>
    </FadeUp>
    <FadeUp delay={0.5}>
      <p className="t-sub mt-[5cqh] max-w-[58cqw] leading-relaxed">
        Un ecosistema in continua crescita, costruito per adattarsi alle esigenze di persone, aziende e partner.
      </p>
    </FadeUp>
    <FadeUp delay={0.75}>
      <p className="t-sub mt-[2.5cqh] max-w-[58cqw] leading-relaxed">
        Ogni evoluzione nasce dall’<span style={{ color: "#C8FF00" }}>ascolto</span>, dall’<span style={{ color: "#FFB066" }}>esperienza</span> e dall’<span style={{ color: "#FF6600" }}>innovazione</span>.
      </p>
    </FadeUp>
  </SlideShell>
);

/* SLIDE 26 — Finale */
const Finale = () => (
  <SlideShell bg="closing_slide_bg.png" overlay="radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 70%)" contentClassName="items-center justify-center text-center">
    <FadeUp delay={0.2}>
      <div className="flex items-center justify-center gap-[2cqw] mb-[4cqh]">
        <span className="t-h2 font-extrabold" style={{ color: "#C8FF00" }}>QRHub</span>
        <span className="w-px h-[5cqh] bg-white/20" />
        <span className="t-h2 font-extrabold" style={{ color: "#FF6600" }}>WINDTRE</span>
        <span className="t-h2 font-light text-white/50">Partner</span>
      </div>
    </FadeUp>
    <FadeUp delay={0.5}><h1 className="t-h1 text-white glow-orange">#insiemeperilsuccesso</h1></FadeUp>
    <FadeUp delay={0.85}><p className="t-sub mt-[4cqh]">Grazie. · <span style={{ color: "#C8FF00" }}>qrhub.it</span></p></FadeUp>
  </SlideShell>
);

export default [<OpenSource key="s22" />, <Tips key="s23" />, <ProssimiPassi key="s24" />, <Vision key="s25" />, <Finale key="s26" />];
