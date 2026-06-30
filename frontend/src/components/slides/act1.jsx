import React from "react";
import { SlideShell } from "../SlideShell";
import { FadeUp, Kicker, SlideIn } from "../primitives";
import { MacShot } from "../devices/RealDevices";

/* SLIDE 1 — Cover */
const Cover = () => (
  <SlideShell bg="hero_cover_bg.png" overlay="radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.82) 70%)" contentClassName="items-center justify-center text-center">
    <FadeUp delay={0.1}>
      <div className="flex items-center justify-center gap-[2cqw] mb-[4cqh]">
        <span className="t-h3 font-extrabold" style={{ color: "#FF6600" }}>WINDTRE</span>
        <span className="t-h3 font-light text-white/40">Partner</span>
        <span className="w-px h-[4cqh] bg-white/20" />
        <span className="t-h3 font-extrabold" style={{ color: "#C8FF00" }}>QRHub</span>
      </div>
    </FadeUp>
    <FadeUp delay={0.3}>
      <h1 className="t-display text-white">Il QR diventa<br />relazione.</h1>
    </FadeUp>
    <FadeUp delay={0.6}>
      <p className="t-sub mt-[4cqh] max-w-[60cqw] mx-auto">Progetto Open Source al tuo servizio.<br />Review del primo mese · Vento Del Nord</p>
    </FadeUp>
    <FadeUp delay={0.9}>
      <span className="t-kicker mt-[5cqh] inline-block" style={{ color: "#C8FF00" }}>#insiemeperilsuccesso</span>
    </FadeUp>
  </SlideShell>
);

/* SLIDE 2 — La Genesi */
const Genesi = () => (
  <SlideShell bg="update_slide_bg.png" overlay="linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.55) 100%)" contentClassName="">
    <div className="grid grid-cols-12 gap-[4cqw] h-full items-center">
      <div className="col-span-6">
        <Kicker color="lime">La Genesi</Kicker>
        <FadeUp delay={0.2}><h2 className="t-h1 text-white">Tutto è nato da un cartellino.</h2></FadeUp>
        <FadeUp delay={0.5}><p className="t-sub mt-[4cqh] max-w-[44cqw]">Prendere un QR e trasformarlo in <span className="text-white font-medium">una leva commerciale senza confini</span>. Sì, proprio quel quadratino che di solito nessuno scansiona.</p></FadeUp>
      </div>
      <div className="col-span-6">
        <SlideIn delay={0.35} x={70}><MacShot src="mac_a.png" /></SlideIn>
      </div>
    </div>
  </SlideShell>
);

/* SLIDE 3 — Il Problema */
const Problema = () => (
  <SlideShell bg="problem_slide_bg.png" overlay="linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 100%)" contentClassName="justify-center">
    <div className="max-w-[58cqw]">
      <Kicker color="orange">Il Problema</Kicker>
      <FadeUp delay={0.25}><h2 className="t-h1 text-white">Il cliente esce<br />dal negozio.</h2></FadeUp>
      <FadeUp delay={0.6}><p className="t-display mt-[2cqh]" style={{ color: "#FF6600" }}>E poi? Silenzio.</p></FadeUp>
    </div>
  </SlideShell>
);

/* SLIDE 4 — La Soluzione (immagine Federica come background full-bleed) */
const Soluzione = () => (
  <SlideShell
    bg="real/federica_v3.png"
    bgPosition="72% 70%"
    overlay="linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%)"
    contentClassName="justify-center"
  >
    <div className="max-w-[52cqw]">
      <Kicker color="lime">La Soluzione</Kicker>
      <FadeUp delay={0.2}>
        <h2 className="t-h1 text-white leading-[1.05]">
          Un badge.<br />
          <span style={{ color: "#FF6600" }}>Un QR.</span><br />
          <span style={{ color: "#C8FF00" }}>Un canale diretto</span> permanente.
        </h2>
      </FadeUp>
      <FadeUp delay={0.6}>
        <p className="t-sub mt-[4cqh] max-w-[42cqw]">
          Federica indossa il cartellino. Il cliente se la porta a casa. Nel telefono, s'intende.
        </p>
      </FadeUp>
    </div>
  </SlideShell>
);

export default [<Cover key="s1" />, <Genesi key="s2" />, <Problema key="s3" />, <Soluzione key="s4" />];
