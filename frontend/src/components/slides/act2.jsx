import React from "react";
import { motion } from "framer-motion";
import { SlideShell } from "../SlideShell";
import { FadeUp, Kicker, SlideIn } from "../primitives";
import { PhoneShot } from "../devices/RealDevices";

const StepText = ({ step, title, sub, accent = "lime" }) => (
  <div className="flex flex-col justify-center h-full max-w-[40cqw]">
    <Kicker color={accent}>{step}</Kicker>
    <FadeUp delay={0.2}><h2 className="t-h2 text-white">{title}</h2></FadeUp>
    {sub && <FadeUp delay={0.45}><p className="t-sub mt-[3.5cqh]">{sub}</p></FadeUp>}
  </div>
);

/* Floating motion FX beneath the iPhone — pulsing glow + ripples + drifting particles */
const PhoneFX = ({ color = "#C8FF00" }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
    {/* Soft pulsing glow under the phone */}
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full"
      style={{
        bottom: "4%",
        width: "60%",
        height: "20%",
        background: `radial-gradient(ellipse at center, ${color}55 0%, ${color}00 65%)`,
        filter: "blur(28px)",
      }}
      animate={{ opacity: [0.5, 0.95, 0.5], scale: [1, 1.08, 1] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Concentric ripples */}
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: "32%",
          aspectRatio: "1 / 1",
          borderColor: `${color}40`,
          translate: "-50% -50%",
        }}
        animate={{ scale: [0.7, 1.55], opacity: [0.55, 0] }}
        transition={{ duration: 3.6, delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
      />
    ))}
    {/* Drifting particles */}
    {Array.from({ length: 14 }).map((_, i) => {
      const left = 12 + ((i * 47) % 76);
      const delay = (i * 0.37) % 4;
      return (
        <motion.span
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${left}%`,
            bottom: "8%",
            width: 4,
            height: 4,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
          animate={{ y: [0, -180, -260], opacity: [0, 0.85, 0] }}
          transition={{ duration: 5 + (i % 3), delay, repeat: Infinity, ease: "easeOut" }}
        />
      );
    })}
  </div>
);

const PhoneStage = ({ src, fxColor = "#C8FF00" }) => (
  <div className="relative flex items-center justify-center h-full">
    <PhoneFX color={fxColor} />
    <SlideIn delay={0.25} className="relative z-10">
      <PhoneShot src={src} />
    </SlideIn>
  </div>
);

const Split = ({ left, right }) => (
  <div className="grid grid-cols-2 gap-[5cqw] h-full">{left}{right}</div>
);

/* SLIDE 5 — La Scansione (foto reale Federica, focus su QR + telefono) */
const Scansione = () => (
  <SlideShell
    bg="real/federica_v2.png"
    bgPosition="center 45%"
    overlay="linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.94) 100%)"
    contentClassName="items-end justify-center"
  >
    <div className="max-w-[48cqw] ml-auto text-right">
      <Kicker color="orange">Step 1 · La Scansione</Kicker>
      <FadeUp delay={0.2}>
        <h2 className="t-h2 text-white">Il cliente inquadra il QR sul cartellino.</h2>
      </FadeUp>
      <FadeUp delay={0.45}>
        <p className="t-sub mt-[3.5cqh]">
          Fotocamera. Un secondo. E no, non deve scaricare l'ennesima app.
        </p>
      </FadeUp>
    </div>
  </SlideShell>
);

/* SLIDE 6 — La Landing */
const Landing = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 2 · La Landing" title={<>Si apre la pagina personale.</>} sub="Niente download, niente attese. Solo il consulente, già lì ad aspettare." />}
      right={<PhoneStage src="landing_v2.png" fxColor="#C8FF00" />}
    />
  </SlideShell>
);

/* SLIDE 7 — Le Azioni */
const Azioni = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 3 · Le Azioni" accent="orange" title={<>Un tap. E sei in contatto.</>} sub="WhatsApp. Recensione. Social. Offerte. Tutto a portata di pollice." />}
      right={<PhoneStage src="actions.webp" fxColor="#FF6600" />}
    />
  </SlideShell>
);

/* SLIDE 8 — Installa PWA */
const Install = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 4 · Installa PWA" title={<>Il consulente diventa un'app.</>} sub="«Aggiungi alla schermata Home» e il gioco è fatto. Senza mai passare dallo store." />}
      right={<PhoneStage src="install.webp" fxColor="#C8FF00" />}
    />
  </SlideShell>
);

/* SLIDE 9 — Sulla Home (icona installata, prima delle push) */
const HomeIcon = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 5 · Sulla Home" title={<>Federica diventa un'icona.</>} sub="L'app del consulente vive accanto a Telegram, Instagram e Safari. Sempre a un tap di distanza." />}
      right={<PhoneStage src="home_federica.png" fxColor="#FF6600" />}
    />
  </SlideShell>
);

/* SLIDE 10 — Notifiche Push */
const Push = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 6 · Notifiche Push" accent="orange" title={<>Il cliente sceglie cosa ricevere.</>} sub="Push dirette, senza store. E per una volta, è il negozio a chiedere il permesso." />}
      right={<PhoneStage src="push.webp" fxColor="#FF6600" />}
    />
  </SlideShell>
);

/* SLIDE 11 — Annunci to Push (annunci visibili nella landing del venditore) */
const StoreLanding = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 8 · Annunci to Push" accent="orange" title={<>Dagli annunci alle push.</>} sub={<>Dopo la push, il cliente torna nella landing del consulente e trova le offerte già pronte: iPhone, Fibra, Luce & Gas. <span className="text-white font-medium">Servite gratuitamente via push</span> direttamente dal venditore alle app dei clienti installate.</>} />}
      right={<PhoneStage src="store_landing.png" fxColor="#C8FF00" />}
    />
  </SlideShell>
);

/* SLIDE 12 — Gestione Notifiche (cliente sceglie tipo di marketing) */
const GestioneNotifiche = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 7 · Scelta del Cliente" title={<>Il cliente sceglie sempre.</>} sub="Solo il consulente, o tutte le offerte del brand. Marketing isolato in un tap — e può cambiare idea quando vuole." />}
      right={<PhoneStage src="notif_choice.png" fxColor="#C8FF00" />}
    />
  </SlideShell>
);

/* SLIDE 13 — Store Landing (Protetti + Fibra) */
const Annunci = () => (
  <SlideShell>
    <Split
      left={<StepText step="Step 9 · Store Landing" title={<>Il negozio comunica offerte e novità.</>} sub={<>WINDTRE Protetti, Fibra, Luce & Gas — direttamente al cliente giusto. <span className="text-white font-medium">Sponsorizzati su piattaforme a pagamento</span> per alimentare il funnel.</>} />}
      right={
        <div className="relative flex items-center justify-center gap-[2.5cqw] h-full">
          <PhoneFX color="#FF6600" />
          <SlideIn delay={0.25} className="relative z-10"><PhoneShot src="protetti.webp" maxH="68cqh" /></SlideIn>
          <SlideIn delay={0.4} className="relative z-10"><PhoneShot src="announce.webp" maxH="68cqh" /></SlideIn>
        </div>
      }
    />
  </SlideShell>
);

export default [<Scansione key="s5" />, <Landing key="s6" />, <Azioni key="s7" />, <Install key="s8" />, <HomeIcon key="s9" />, <Push key="s10" />, <GestioneNotifiche key="s11" />, <StoreLanding key="s12" />, <Annunci key="s13" />];
