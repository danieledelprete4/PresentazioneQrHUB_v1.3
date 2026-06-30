import React from "react";
import { motion } from "framer-motion";
import { SlideShell } from "../SlideShell";
import { FadeUp, Kicker, SlideIn } from "../primitives";
import { MacShot, PhoneShot } from "../devices/RealDevices";
import { ASSET, REAL } from "../../lib/brand";
import { FileText, Cloud, MessageCircle, Database } from "lucide-react";

/* Floating motion FX beneath the MacBook — wide pulsing glow + ripples + drifting particles */
const MacFX = ({ color = "#C8FF00" }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {/* Wide pulsing glow under the mac */}
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full"
      style={{
        bottom: "2%",
        width: "85%",
        height: "22%",
        background: `radial-gradient(ellipse at center, ${color}55 0%, ${color}00 70%)`,
        filter: "blur(32px)",
      }}
      animate={{ opacity: [0.45, 0.95, 0.45], scale: [1, 1.06, 1] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Concentric ripples — flatter for laptop */}
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: "44%",
          aspectRatio: "2.4 / 1",
          borderColor: `${color}40`,
          translate: "-50% -50%",
        }}
        animate={{ scale: [0.6, 1.45], opacity: [0.5, 0] }}
        transition={{ duration: 3.8, delay: i * 1.3, repeat: Infinity, ease: "easeOut" }}
      />
    ))}
    {/* Drifting particles */}
    {Array.from({ length: 18 }).map((_, i) => {
      const left = 8 + ((i * 41) % 84);
      const delay = (i * 0.31) % 4.5;
      return (
        <motion.span
          key={`mp-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            bottom: "6%",
            width: 4,
            height: 4,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
          animate={{ y: [0, -220, -320], opacity: [0, 0.8, 0] }}
          transition={{ duration: 5.5 + (i % 3), delay, repeat: Infinity, ease: "easeOut" }}
        />
      );
    })}
  </div>
);

const MacLayout = ({ kicker, title, sub, accent = "lime", src, fxColor }) => {
  const color = fxColor || (accent === "orange" ? "#FF6600" : "#C8FF00");
  return (
    <SlideShell contentClassName="">
      <div className="grid grid-cols-12 gap-[4cqw] h-full items-center">
        <div className="col-span-5 flex flex-col justify-center">
          <Kicker color={accent}>{kicker}</Kicker>
          <FadeUp delay={0.2}><h2 className="t-h2 text-white">{title}</h2></FadeUp>
          {sub && <FadeUp delay={0.45}><p className="t-sub mt-[3cqh]">{sub}</p></FadeUp>}
        </div>
        <div className="col-span-7 relative h-full flex items-center justify-center">
          <MacFX color={color} />
          <SlideIn delay={0.3} x={70} className="relative z-10 w-full"><MacShot src={src} /></SlideIn>
        </div>
      </div>
    </SlideShell>
  );
};

/* Generic mockup layout — text left, device shot right (object-contain) */
const ShotLayout = ({ kicker, title, sub, accent = "lime", src, fxColor }) => {
  const color = fxColor || (accent === "orange" ? "#FF6600" : "#C8FF00");
  return (
    <SlideShell contentClassName="">
      <div className="grid grid-cols-12 gap-[4cqw] h-full items-center">
        <div className="col-span-5 flex flex-col justify-center">
          <Kicker color={accent}>{kicker}</Kicker>
          <FadeUp delay={0.2}><h2 className="t-h2 text-white">{title}</h2></FadeUp>
          {sub && <FadeUp delay={0.45}><p className="t-sub mt-[3cqh]">{sub}</p></FadeUp>}
        </div>
        <div className="col-span-7 relative h-full flex items-center justify-center">
          <MacFX color={color} />
          <SlideIn delay={0.3} x={70} className="relative z-10 w-full flex items-center justify-center">
            <img
              src={REAL(src)}
              alt=""
              draggable={false}
              style={{
                maxHeight: "86cqh",
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              }}
            />
          </SlideIn>
        </div>
      </div>
    </SlideShell>
  );
};

/* SLIDE 17 — Titolo Update */
const TitoloUpdate = () => (
  <SlideShell bg="update_slide_bg.png" overlay="linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%)" contentClassName="justify-center">
    <FadeUp delay={0.1}><h2 className="t-display text-white">Cosa c'è di nuovo.</h2></FadeUp>
    <FadeUp delay={0.4}><h2 className="t-h1 mt-[1cqh]" style={{ color: "#C8FF00" }}>Luglio 2026.</h2></FadeUp>
  </SlideShell>
);

const StoreManager = () => (
  <MacLayout
    kicker="Store Manager"
    accent="lime"
    title={<>Vedi l'andamento di ogni specialist.</>}
    sub="Panoramica globale dei numeri del team: scansioni, click e trend giornaliero in un colpo d'occhio."
    src="store_overview.png"
  />
);

const ContaPersone = () => (
  <MacLayout
    kicker="Conta Persone"
    accent="orange"
    title={<>C'è chi scansiona, e chi scrive.</>}
    sub="Il contapersone del negozio: ogni QR scansionato è un ingresso, ogni conversazione WhatsApp avviata è un cliente caldo, pronto da seguire."
    src="mac_d.png"
  />
);

const VistaSpecialist = () => (
  <MacLayout
    kicker="Vista Specialist"
    accent="orange"
    title={<>Le proprie performance, in tempo reale.</>}
    sub="Ogni venditore vede le proprie statistiche personali: visite, click per canale e dettaglio."
    src="mac_e.png"
  />
);

const EsportaPDF = () => (
  <MacLayout
    kicker="Esporta PDF"
    accent="lime"
    title={<>Report scaricabile.</>}
    sub="Analytics dettagliata, pronta da esportare. Per riunioni, valutazioni e coaching."
    src="mac_b.png"
  />
);

const PatternDispositivi = () => (
  <MacLayout
    kicker="Pattern & Dispositivi"
    accent="orange"
    title={<>Quando, e da dove.</>}
    sub="L'orario di picco delle interazioni e il dispositivo usato dai clienti."
    src="mac_c.png"
  />
);

/* SLIDE — Notifiche Push reali (screenshot reali da iPhone) */
const PushReali = () => (
  <SlideShell contentClassName="">
    <div className="grid grid-cols-12 gap-[4cqw] h-full items-center">
      <div className="col-span-5 flex flex-col justify-center">
        <Kicker color="orange">Notifiche Push</Kicker>
        <FadeUp delay={0.2}><h2 className="t-h2 text-white">Push reali, già in funzione.</h2></FadeUp>
        <FadeUp delay={0.45}>
          <p className="t-sub mt-[3cqh]">
            Il sistema invia un messaggio: arriva sul telefono del cliente in un secondo, senza app store.
          </p>
        </FadeUp>
      </div>
      <div className="col-span-7 flex items-center justify-center gap-[2.5cqw] h-full">
        <SlideIn delay={0.3} x={70}>
          <PhoneShot src="push_lock.png" maxH="80cqh" />
        </SlideIn>
        <SlideIn delay={0.5} x={70}>
          <PhoneShot src="push_home.png" maxH="80cqh" />
        </SlideIn>
      </div>
    </div>
  </SlideShell>
);

/* SLIDE — Preventivatore (Tool Satellite) */
const Preventivatore = () => {
  const steps = [
    { icon: FileText, t: "Compila", s: "Offerta personalizzata", c: "#C8FF00" },
    { icon: Cloud, t: "Google Drive", s: "Salvataggio automatico", c: "#FF6600" },
    { icon: MessageCircle, t: "WhatsApp", s: "Cliente già in chat", c: "#C8FF00" },
    { icon: Database, t: "Salesforce", s: "Call center · follow-up", c: "#FF6600" },
  ];
  return (
    <SlideShell contentClassName="">
      <div className="flex flex-col h-full gap-[1cqh]">
        {/* Compact header */}
        <div className="flex items-start justify-between gap-[3cqw]">
          <div className="max-w-[62cqw]">
            <Kicker color="orange">Ecosistema Esteso · Tool Satellite</Kicker>
            <FadeUp delay={0.15}>
              <h2 className="text-white leading-[1.1] mt-[0.6cqh]" style={{ fontSize: "clamp(0.85rem,3.2cqw,3.6rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Dal preventivo al <span style={{ color: "#C8FF00" }}>follow-up</span>.
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.3}>
            <p className="max-w-[32cqw] text-right" style={{ fontSize: "clamp(0.42rem,1.05cqw,1.1rem)", color: "var(--zinc)", lineHeight: 1.3 }}>
              Non parte di QRHub: uno script collegato che <span className="text-white font-medium">chiude il loop commerciale</span> dopo la scansione.
            </p>
          </FadeUp>
        </div>

        {/* BIG mockup */}
        <div className="flex-1 flex items-center justify-center relative min-h-0 overflow-hidden">
          {/* glow under mockup */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              bottom: "2%",
              width: "78%",
              height: "20%",
              background: "radial-gradient(ellipse at center, rgba(255,102,0,0.4) 0%, rgba(255,102,0,0) 70%)",
              filter: "blur(36px)",
            }}
            animate={{ opacity: [0.55, 0.95, 0.55], scale: [1, 1.05, 1] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <SlideIn delay={0.4} x={0} className="relative z-10 h-full w-full flex items-center justify-center">
            <img
              src={ASSET("preventivatore_mockup.png")}
              alt="Preventivatore desktop mockup"
              draggable={false}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                transform: "scale(1.05)",
                transformOrigin: "center 40%",
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
              }}
            />
          </SlideIn>
        </div>

        {/* Flow steps - always 4 cols horizontally */}
        <div className="grid grid-cols-4 gap-[1.2cqw]">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.55 }}
                className="flex items-center gap-[0.8cqw] border-l-2 pl-[0.8cqw] py-[0.4cqh] min-w-0"
                style={{ borderColor: s.c }}
              >
                <span className="font-bold opacity-50" style={{ color: s.c, fontSize: "clamp(0.7rem,2.2cqw,2.6rem)", lineHeight: 1 }}>
                  0{i + 1}
                </span>
                <Icon style={{ color: s.c, width: "clamp(10px,1.6cqw,22px)", height: "clamp(10px,1.6cqw,22px)", flexShrink: 0 }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-semibold truncate" style={{ fontSize: "clamp(0.5rem,1.4cqw,1.5rem)", lineHeight: 1.1 }}>{s.t}</span>
                  <span className="truncate" style={{ fontSize: "clamp(0.4rem,0.95cqw,0.95rem)", color: "var(--zinc)", lineHeight: 1.2 }}>{s.s}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
};

/* NEW — Recensioni Google (mockup) */
const Recensioni = () => (
  <ShotLayout
    kicker="Recensioni Google · Ultimi 30 giorni"
    accent="lime"
    title={<>280 recensioni in 30 giorni.</>}
    sub="Tracciate nel tempo, negozio per negozio. In testa WINDTRE Vittorio Veneto con 61 recensioni — il 21,8% del totale raccolto."
    src="reviews_dash.png"
  />
);

/* NEW — Classifica recensioni per negozio (stile Top Venditori) */
const RecensioniRanking = () => {
  const stores = [
    { name: "WINDTRE Vittorio Veneto", v: 61 },
    { name: "WINDTRE · C.C. San Bonifacio", v: 51 },
    { name: "WINDTRE · C.C. Emisfero", v: 48 },
    { name: "WINDTRE · C.C. Il Gotico", v: 42 },
    { name: "WINDTRE Corso Milano VR", v: 21 },
    { name: "WINDTRE · C.C. Galassia", v: 21 },
    { name: "WINDTRE · C.C. Il Faro", v: 18 },
    { name: "WINDTRE Castelnuovo del Garda", v: 9 },
    { name: "WINDTRE · Corso Vittorio E.", v: 9 },
  ];
  const max = stores[0].v;
  const total = stores.reduce((s, r) => s + r.v, 0);
  const medals = ["#FFD24A", "#C0C7D0", "#CD7F4D"];
  return (
    <SlideShell contentClassName="justify-center">
      <Kicker color="orange">Recensioni · Classifica Negozi</Kicker>
      <FadeUp delay={0.15}>
        <h2 className="t-h2 text-white mb-[1cqh]">Chi raccoglie più recensioni.</h2>
      </FadeUp>
      <FadeUp delay={0.25}>
        <p className="t-body text-white/45 mb-[3cqh]">{total} recensioni totali · 9 negozi attivi</p>
      </FadeUp>
      <div className="space-y-[1.1cqh]">
        {stores.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.55 }}
            className="flex items-center gap-[1.4cqw]"
          >
            <span
              className="font-extrabold tabular-nums text-right"
              style={{ fontSize: "clamp(0.85rem,1.8cqw,2rem)", color: i < 3 ? medals[i] : "#52525B", width: "3cqw" }}
            >
              {i + 1}
            </span>
            <span className="text-white font-semibold truncate" style={{ width: "26cqw", fontSize: "clamp(0.78rem,1.5cqw,1.7rem)" }}>
              {s.name}
            </span>
            <div className="flex-1 rounded-full bg-white/5 overflow-hidden" style={{ height: "2cqh" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: i < 3 ? medals[i] : "#FF6600" }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.v / max) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-white font-bold tabular-nums" style={{ width: "8cqw", textAlign: "right", fontSize: "clamp(0.78rem,1.5cqw,1.7rem)" }}>
              {s.v} <span className="text-white/40" style={{ fontSize: "0.62em" }}>REC</span>
            </span>
            <span className="text-white/50 tabular-nums" style={{ width: "5.5cqw", textAlign: "right", fontSize: "clamp(0.7rem,1.2cqw,1.4rem)" }}>
              {((s.v / total) * 100).toFixed(1)}%
            </span>
          </motion.div>
        ))}
      </div>
    </SlideShell>
  );
};

/* NEW — Monitoraggio Notifiche Push (mockup) */
const MonitoraggioPush = () => (
  <ShotLayout
    kicker="Notifiche Push · Monitoraggio"
    accent="orange"
    title={<>Ogni push, misurata.</>}
    sub="Iscritti, notifiche inviate, click e CTR: il nuovo modulo monitora l'efficacia di ogni annuncio, vendor per vendor."
    src="push_monitor.png"
  />
);

/* NEW — Store Landing Funnel (mockup) */
const StoreLandingFunnel = () => (
  <ShotLayout
    kicker="Store Landing · Funnel lead-gen"
    accent="lime"
    title={<>Misuriamo tutto il funnel.</>}
    sub="Atterraggi → visitatori coinvolti → click CTA → form WINDTRE. Conversion rate e bounce, negozio per negozio."
    src="landing_funnel.png"
  />
);

export default [
  <TitoloUpdate key="s16" />, <StoreManager key="s17" />, <ContaPersone key="s17b" />, <VistaSpecialist key="s18" />,
  <EsportaPDF key="s19" />, <PatternDispositivi key="s20" />,
  <Recensioni key="s20a" />, <RecensioniRanking key="s20b" />,
  <PushReali key="s21" />, <MonitoraggioPush key="s21b" />,
  <StoreLandingFunnel key="s21c" />,
  <Preventivatore key="s22" />,
];
