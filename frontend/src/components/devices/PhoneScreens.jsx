import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, Star, Instagram, Facebook, Bell, MapPin, CalendarDays,
  Share, Plus, Check, Zap, Wifi, ShieldCheck, ChevronRight,
} from "lucide-react";
import { IPhone, StatusBar } from "./Devices";
import { ASSET } from "../../lib/brand";

const Avatar = ({ size = 84 }) => (
  <img
    src={ASSET("federica_avatar.png")}
    alt="Federica"
    className="rounded-full object-cover border-4 border-white/90 shadow-xl"
    style={{ width: size, height: size }}
  />
);

/* SLIDE 6 — Landing personale */
export const LandingScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0 bg-[#0b0b0c] overflow-hidden">
      <div className="relative" style={{ background: "linear-gradient(160deg,#FF7A14 0%,#FF6600 55%,#E14d00 100%)" }}>
        <StatusBar />
        <div className="flex flex-col items-center text-center px-6 pb-7 pt-3">
          <Avatar />
          <h3 className="text-white font-extrabold text-[20px] mt-3 leading-tight">Federica Russo</h3>
          <p className="text-white/85 text-[12px] font-medium mt-0.5">Consulente · WINDTRE Partner</p>
          <p className="text-white/75 text-[10px] mt-0.5">Vento Del Nord · Store Milano</p>
        </div>
        <div className="absolute -bottom-px left-0 right-0 h-6 bg-[#0b0b0c] rounded-t-[22px]" />
      </div>
      <div className="px-5 pt-3">
        <p className="text-zinc-300 text-[12px] leading-relaxed text-center mb-4">
          Ciao! 👋 Sono Federica. Resta in contatto con me per offerte, assistenza e novità WINDTRE.
        </p>
        <button className="w-full flex items-center gap-3 bg-[#1f1f22] rounded-2xl px-4 py-3 mb-2.5">
          <span className="w-9 h-9 rounded-full grid place-items-center" style={{ background: "#25D366" }}>
            <MessageCircle size={18} className="text-white" />
          </span>
          <span className="text-white text-[13px] font-semibold">Scrivimi su WhatsApp</span>
          <ChevronRight size={16} className="ml-auto text-zinc-500" />
        </button>
        <button className="w-full flex items-center gap-3 bg-[#1f1f22] rounded-2xl px-4 py-3 mb-2.5">
          <span className="w-9 h-9 rounded-full grid place-items-center bg-white">
            <Star size={18} className="text-[#FF6600]" fill="#FF6600" />
          </span>
          <span className="text-white text-[13px] font-semibold">Lascia una recensione</span>
          <ChevronRight size={16} className="ml-auto text-zinc-500" />
        </button>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-[10px] text-zinc-600">Powered by</span>
          <span className="text-[10px] font-bold" style={{ color: "#C8FF00" }}>QRHub</span>
        </div>
      </div>
    </div>
  </IPhone>
);

/* SLIDE 7 — Azioni */
const ActionCard = ({ icon, label, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 bg-[#16161a] rounded-2xl px-4 py-3 border border-white/5"
  >
    <span className="w-10 h-10 rounded-full grid place-items-center" style={{ background: color }}>{icon}</span>
    <div className="text-left">
      <p className="text-white text-[13px] font-semibold leading-tight">{label}</p>
      <p className="text-zinc-500 text-[10px]">{sub}</p>
    </div>
    <ChevronRight size={16} className="ml-auto text-zinc-600" />
  </motion.div>
);

export const ActionsScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0 bg-[#0b0b0c]">
      <StatusBar />
      <div className="px-5 pt-2">
        <h3 className="text-white font-extrabold text-[17px] mb-1">Un tap. Tutto qui.</h3>
        <p className="text-zinc-500 text-[11px] mb-4">Scegli come restare in contatto</p>
        <div className="space-y-2.5">
          <ActionCard delay={0.15} color="#25D366" icon={<MessageCircle size={19} className="text-white" />} label="WhatsApp" sub="Chatta con Federica" />
          <ActionCard delay={0.3} color="#fff" icon={<Star size={19} className="text-[#FF6600]" fill="#FF6600" />} label="Recensione Google" sub="Valuta il servizio" />
          <ActionCard delay={0.45} color="#E1306C" icon={<Instagram size={19} className="text-white" />} label="Instagram" sub="@windtre.partner" />
          <ActionCard delay={0.6} color="#1877F2" icon={<Facebook size={19} className="text-white" />} label="Facebook" sub="Seguici sui social" />
          <ActionCard delay={0.75} color="#FF6600" icon={<CalendarDays size={19} className="text-white" />} label="Appuntamento" sub="Prenota in negozio" />
        </div>
      </div>
    </div>
  </IPhone>
);

/* SLIDE 8 — Installa PWA */
export const InstallScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#101015 0%,#000 100%)" }}>
      <StatusBar />
      <div className="grid grid-cols-4 gap-x-3 gap-y-4 px-5 pt-4">
        {["#FF6600", "#1f1f22", "#1f1f22", "#1f1f22", "#1f1f22", "#1f1f22"].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-[14px]" style={{ background: c, boxShadow: i === 0 ? "0 0 22px rgba(255,102,0,0.6)" : "none" }}>
              {i === 0 && <div className="w-full h-full grid place-items-center text-white font-black text-[10px]">F</div>}
            </div>
            <span className="text-[8px] text-zinc-400">{i === 0 ? "Federica" : ""}</span>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ y: 260 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-2.5 right-2.5 bottom-2.5 bg-[#1c1c1e]/95 backdrop-blur rounded-3xl p-4 border border-white/10"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-white/10">
          <div className="w-11 h-11 rounded-xl bg-[#FF6600] grid place-items-center text-white font-black">F</div>
          <div className="flex-1">
            <p className="text-white text-[12px] font-semibold">Federica · QRHub</p>
            <p className="text-zinc-500 text-[10px]">qrhub.it</p>
          </div>
          <Share size={16} className="text-[#0A84FF]" />
        </div>
        <div className="flex items-center justify-between py-3 mt-1">
          <span className="text-white text-[13px] font-medium">Aggiungi alla schermata Home</span>
          <span className="w-7 h-7 rounded-lg bg-white/10 grid place-items-center"><Plus size={16} className="text-white" /></span>
        </div>
      </motion.div>
    </div>
  </IPhone>
);

/* SLIDE 9 — Notifiche push */
export const PushScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#15100a 0%,#000 100%)" }}>
      <StatusBar />
      <div className="px-5 pt-4 text-center">
        <div className="w-14 h-14 rounded-2xl mx-auto grid place-items-center" style={{ background: "#FF6600", boxShadow: "0 0 30px rgba(255,102,0,0.5)" }}>
          <Bell size={26} className="text-white" />
        </div>
        <h3 className="text-white font-extrabold text-[16px] mt-3">Vuoi ricevere le novità?</h3>
        <p className="text-zinc-500 text-[11px] mt-1 px-3">Niente app da scaricare. Push direttamente sul telefono.</p>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mx-4 mt-5 bg-[#1c1c1e] rounded-2xl p-4 border border-white/10"
      >
        <p className="text-white text-[12px] font-semibold mb-3">Con che frequenza?</p>
        {[["Tutte le offerte", true], ["Solo novità importanti", false], ["Mensile", false]].map(([t, on], i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-zinc-300 text-[11px]">{t}</span>
            <span className={`w-9 h-5 rounded-full flex items-center px-0.5 ${on ? "justify-end" : "justify-start"}`} style={{ background: on ? "#C8FF00" : "#2c2c2e" }}>
              <span className="w-4 h-4 rounded-full bg-white" />
            </span>
          </div>
        ))}
        <button className="w-full mt-3 rounded-xl py-2.5 text-[12px] font-bold text-black" style={{ background: "#C8FF00" }}>
          Attiva notifiche
        </button>
      </motion.div>
    </div>
  </IPhone>
);

/* SLIDE 10 — Annunci negozio */
const Banner = ({ icon, title, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="rounded-2xl p-3.5 flex items-center gap-3 border border-white/5"
    style={{ background: "#16161a" }}
  >
    <span className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: color }}>{icon}</span>
    <div>
      <p className="text-white text-[12px] font-semibold leading-tight">{title}</p>
      <p className="text-zinc-500 text-[10px]">{sub}</p>
    </div>
  </motion.div>
);

export const AnnouncementsScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0 bg-[#0b0b0c]">
      <StatusBar />
      <div className="px-5 pt-2">
        <h3 className="text-white font-extrabold text-[16px] mb-0.5">Novità dal negozio</h3>
        <p className="text-zinc-500 text-[11px] mb-4">3 nuovi annunci</p>
        <div className="space-y-2.5">
          <Banner delay={0.2} color="#FF6600" icon={<Zap size={19} className="text-white" />} title="Luce & Gas" sub="Promo casa: blocca il prezzo" />
          <Banner delay={0.35} color="#C8FF00" icon={<Wifi size={19} className="text-black" />} title="Fibra FTTH" sub="Fino a 2,5 Gbps in città" />
          <Banner delay={0.5} color="#3B82F6" icon={<ShieldCheck size={19} className="text-white" />} title="WINDTRE Protetti" sub="Assicura i tuoi dispositivi" />
          <Banner delay={0.65} color="#D946EF" icon={<MapPin size={19} className="text-white" />} title="Open Day" sub="Sabato in store · ti aspettiamo" />
        </div>
      </div>
    </div>
  </IPhone>
);

/* SLIDE 21 — Gestione notifiche / GDPR */
export const ManageNotifScreen = ({ scale = 1 }) => (
  <IPhone scale={scale}>
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0d120a 0%,#000 100%)" }}>
      <StatusBar />
      <div className="px-5 pt-4 text-center">
        <div className="w-14 h-14 rounded-full mx-auto grid place-items-center border-2" style={{ borderColor: "#C8FF00" }}>
          <Check size={26} style={{ color: "#C8FF00" }} />
        </div>
        <h3 className="text-white font-extrabold text-[16px] mt-3">Notifiche attive</h3>
        <p className="text-zinc-500 text-[11px] mt-1 px-3">Hai il pieno controllo. Modifica o disattiva quando vuoi.</p>
      </div>
      <div className="mx-4 mt-5 bg-[#1c1c1e] rounded-2xl p-4 border border-white/10">
        {[["Offerte e promo", true], ["Assistenza", true], ["Eventi in negozio", false]].map(([t, on], i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
            <span className="text-zinc-300 text-[12px]">{t}</span>
            <span className={`w-9 h-5 rounded-full flex items-center px-0.5 ${on ? "justify-end" : "justify-start"}`} style={{ background: on ? "#C8FF00" : "#2c2c2e" }}>
              <span className="w-4 h-4 rounded-full bg-white" />
            </span>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 flex gap-2">
        <button className="flex-1 rounded-xl py-2.5 text-[11px] font-bold text-black" style={{ background: "#C8FF00" }}>Mantieni</button>
        <button className="flex-1 rounded-xl py-2.5 text-[11px] font-semibold text-zinc-300 border border-white/10">Disattiva tutto</button>
      </div>
      <p className="text-center text-[9px] text-zinc-600 mt-3 px-6">🔒 GDPR-ready · I dati restano del negozio</p>
    </div>
  </IPhone>
);
