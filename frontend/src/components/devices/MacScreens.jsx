import React from "react";
import { ChevronDown, Download, TrendingUp, Users, MousePointerClick, FileText } from "lucide-react";
import { MacBook } from "./Devices";
import { ChannelBars, DailyChart, HourlyChart, DeviceDonut, MiniChannelBars, MiniLine } from "../charts/Charts";
import { SPECIALISTS } from "../../data/presentation";

const Sidebar = ({ active = "Panoramica" }) => (
  <div className="w-[22%] h-full bg-[#0b0b0c] border-r border-white/5 py-4 px-3 hidden md:block">
    <div className="flex items-center gap-2 px-2 mb-5">
      <span className="w-6 h-6 rounded-lg grid place-items-center font-black text-black text-[11px]" style={{ background: "#C8FF00" }}>Q</span>
      <span className="text-white font-bold text-[12px]">QRHub</span>
    </div>
    {["Panoramica", "Area Venditore", "Statistiche", "Analytics", "Notifiche"].map((t) => (
      <div key={t} className={`px-2.5 py-2 rounded-lg text-[11px] mb-1 ${active === t ? "text-black font-semibold" : "text-zinc-400"}`} style={{ background: active === t ? "#C8FF00" : "transparent" }}>
        {t}
      </div>
    ))}
  </div>
);

const Stat = ({ icon, label, value, accent }) => (
  <div className="flex-1 bg-[#141417] rounded-xl p-3 border border-white/5">
    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">{icon}{label}</div>
    <div className="font-extrabold text-[20px]" style={{ color: accent || "#fff" }}>{value}</div>
  </div>
);

/* SLIDE 17 — Store Manager: Area Venditore con dropdown */
export const VendorAreaScreen = () => (
  <MacBook>
    <div className="flex h-full bg-[#050506]">
      <Sidebar active="Area Venditore" />
      <div className="flex-1 p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white font-bold text-[14px]">Area Venditore</h4>
            <p className="text-zinc-500 text-[10px]">Andamento per specialist</p>
          </div>
          <div className="flex items-center gap-2 bg-[#16161a] border border-white/10 rounded-lg px-3 py-1.5">
            <span className="w-5 h-5 rounded-full grid place-items-center text-black text-[9px] font-bold" style={{ background: "#FF6600" }}>F</span>
            <span className="text-white text-[11px] font-medium">Federica</span>
            <ChevronDown size={13} className="text-zinc-500" />
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          <Stat icon={<Users size={11} />} label="Visite" value="389" />
          <Stat icon={<MousePointerClick size={11} />} label="Click" value="302" accent="#FF6600" />
          <Stat icon={<TrendingUp size={11} />} label="Conv." value="78%" accent="#C8FF00" />
        </div>
        <div className="bg-[#141417] rounded-xl p-3 border border-white/5" style={{ height: "44%" }}>
          <p className="text-zinc-400 text-[10px] mb-1">Click giornalieri</p>
          <DailyChart height="92%" />
        </div>
        <div className="mt-2 flex gap-1.5">
          {SPECIALISTS.map((s) => (
            <span key={s.name} className="text-[9px] px-2 py-1 rounded-md text-zinc-300 bg-[#16161a] border border-white/5">{s.name}</span>
          ))}
        </div>
      </div>
    </div>
  </MacBook>
);

/* SLIDE 18 — Vista Specialist: Le Tue Statistiche */
export const SpecialistStatsScreen = () => (
  <MacBook>
    <div className="flex h-full bg-[#050506]">
      <Sidebar active="Statistiche" />
      <div className="flex-1 p-4">
        <h4 className="text-white font-bold text-[14px] mb-0.5">Le Tue Statistiche</h4>
        <p className="text-zinc-500 text-[10px] mb-3">Federica · ultimi 30 giorni</p>
        <div className="flex gap-2 mb-3">
          <Stat icon={<Users size={11} />} label="Visite" value="389" />
          <Stat icon={<MousePointerClick size={11} />} label="Click totali" value="302" accent="#FF6600" />
          <Stat icon={<TrendingUp size={11} />} label="Conversion" value="78%" accent="#C8FF00" />
        </div>
        <div className="grid grid-cols-2 gap-2" style={{ height: "52%" }}>
          <div className="bg-[#141417] rounded-xl p-3 border border-white/5">
            <p className="text-zinc-400 text-[10px] mb-2">Click per canale</p>
            <div style={{ height: "82%" }}><MiniChannelBars /></div>
          </div>
          <div className="bg-[#141417] rounded-xl p-3 border border-white/5">
            <p className="text-zinc-400 text-[10px] mb-2">Trend visite</p>
            <div style={{ height: "82%" }}><MiniLine /></div>
          </div>
        </div>
      </div>
    </div>
  </MacBook>
);

/* SLIDE 19 — Esporta PDF */
export const ExportPDFScreen = () => (
  <MacBook>
    <div className="flex h-full bg-[#050506]">
      <Sidebar active="Analytics" />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white font-bold text-[14px]">Analytics Dettagliata</h4>
            <p className="text-zinc-500 text-[10px]">Report completo del mese</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-black text-[11px] font-bold" style={{ background: "#FF6600", boxShadow: "0 0 26px rgba(255,102,0,0.55)" }}>
            <Download size={13} /> Esporta PDF
          </button>
        </div>
        <div className="flex gap-2 mb-3">
          <Stat icon={<Users size={11} />} label="Visite" value="1.699" />
          <Stat icon={<MousePointerClick size={11} />} label="Click" value="1.311" accent="#FF6600" />
          <Stat icon={<TrendingUp size={11} />} label="Conv." value="54,3%" accent="#C8FF00" />
          <Stat icon={<FileText size={11} />} label="Report" value="PDF" />
        </div>
        <div className="bg-[#141417] rounded-xl p-3 border border-white/5" style={{ height: "48%" }}>
          <p className="text-zinc-400 text-[10px] mb-1">Distribuzione click per canale</p>
          <ChannelBars height="92%" fontSize={11} />
        </div>
      </div>
    </div>
  </MacBook>
);

/* SLIDE 20 — Pattern orario + dispositivi */
export const PatternDevicesScreen = () => (
  <MacBook>
    <div className="flex h-full bg-[#050506]">
      <Sidebar active="Panoramica" />
      <div className="flex-1 p-4">
        <h4 className="text-white font-bold text-[14px] mb-3">Pattern & Dispositivi</h4>
        <div className="grid grid-cols-3 gap-2" style={{ height: "70%" }}>
          <div className="col-span-2 bg-[#141417] rounded-xl p-3 border border-white/5">
            <p className="text-zinc-400 text-[10px] mb-1">Pattern orario (interazioni)</p>
            <div style={{ height: "86%" }}><HourlyChart /></div>
          </div>
          <div className="bg-[#141417] rounded-xl p-3 border border-white/5 flex flex-col">
            <p className="text-zinc-400 text-[10px] mb-1">Dispositivi</p>
            <div className="flex-1 grid place-items-center"><DeviceDonut size="92%" /></div>
          </div>
        </div>
        <p className="text-zinc-500 text-[10px] mt-3">Picco di interazioni tra le <span className="text-white font-semibold">16:00 e le 19:00</span> · il <span style={{ color: "#C8FF00" }}>92%</span> da mobile.</p>
      </div>
    </div>
  </MacBook>
);
