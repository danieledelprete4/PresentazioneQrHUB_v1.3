import React from "react";

export const IPhone = ({ children, scale = 1, className = "" }) => (
  <div className={`relative ${className}`} style={{ width: 300 * scale }}>
    <div
      className="relative rounded-[3rem] device-shadow overflow-hidden"
      style={{
        width: 300 * scale,
        height: 620 * scale,
        border: `${11 * scale}px solid #1b1b1d`,
        background: "#000",
      }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 z-30 rounded-b-2xl"
        style={{ top: 0, width: 120 * scale, height: 26 * scale, background: "#1b1b1d" }}
      />
      <div className="absolute inset-0 overflow-hidden">{children}</div>
    </div>
  </div>
);

export const MacBook = ({ children, className = "" }) => (
  <div className={`relative w-full ${className}`}>
    <div
      className="relative rounded-t-2xl device-shadow overflow-hidden"
      style={{ border: "8px solid #1b1b1d", background: "#000", aspectRatio: "16 / 10" }}
    >
      <div className="absolute top-0 left-0 right-0 h-7 bg-[#111] flex items-center gap-2 px-4 z-30">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[10px] text-zinc-500 truncate">qrhub.it · dashboard</span>
      </div>
      <div className="absolute inset-0 pt-7 overflow-hidden">{children}</div>
    </div>
    <div className="mx-auto rounded-b-xl bg-[#1b1b1d]" style={{ width: "112%", height: 14, marginLeft: "-6%" }} />
  </div>
);

export const StatusBar = ({ dark = false }) => (
  <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold ${dark ? "text-black" : "text-white"}`}>
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <span className="opacity-90">●●●</span>
      <span className="opacity-90">5G</span>
      <span className="w-5 h-2.5 rounded-[3px] border border-current relative">
        <span className="absolute inset-0.5 rounded-[1px]" style={{ background: "currentColor" }} />
      </span>
    </div>
  </div>
);
