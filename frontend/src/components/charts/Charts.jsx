import React, { useRef, useState, useLayoutEffect } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, LabelList,
  PieChart, Pie, LineChart, Line, CartesianGrid,
} from "recharts";
import { CHANNELS, DAILY, HOURLY, DEVICES, SPECIALIST_CHANNELS } from "../../data/presentation";
import { CHANNEL_COLORS, BRAND, STATIC } from "../../lib/brand";

const fmt = (v) => {
  const s = String(Math.round(Number(v)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const ANIM = !STATIC;

function useMeasure() {
  const ref = useRef(null);
  const [s, setS] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setS({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, s];
}

const Box = ({ height = "100%", children }) => {
  const [ref, { w, h }] = useMeasure();
  return (
    <div ref={ref} style={{ width: "100%", height }}>
      {w > 0 && h > 0 ? children(w, h) : null}
    </div>
  );
};

export const ChannelBars = ({ height = "62cqh", fontSize = 20 }) => (
  <Box height={height}>
    {(w, h) => (
      <BarChart width={w} height={h} data={CHANNELS} layout="vertical" margin={{ top: 4, right: 150, left: 8, bottom: 4 }} barCategoryGap={"22%"}>
        <XAxis type="number" hide domain={[0, 1000]} />
        <YAxis type="category" dataKey="name" width={Math.min(160, w * 0.22)} tickLine={false} axisLine={false} tick={{ fill: "#fff", fontSize, fontWeight: 600 }} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1500} isAnimationActive={ANIM} animationEasing="ease-out">
          {CHANNELS.map((c) => (
            <Cell key={c.name} fill={CHANNEL_COLORS[c.name]} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            content={({ x, y, width, height, value, index }) => {
              const ch = CHANNELS[index];
              return (
                <g>
                  <text x={x + width + 10} y={y + height / 2 + fontSize * 0.36} fill="#fff" fontSize={fontSize} fontWeight={800}>
                    {fmt(value)}
                  </text>
                  <text x={x + width + 10 + fontSize * 2.2} y={y + height / 2 + fontSize * 0.32} fill="#a1a1aa" fontSize={fontSize * 0.78} fontWeight={600}>
                    {ch.pct}
                  </text>
                </g>
              );
            }}
          />
        </Bar>
      </BarChart>
    )}
  </Box>
);

export const DailyChart = ({ height = "55cqh" }) => (
  <Box height={height}>
    {(w, h) => (
      <BarChart width={w} height={h} data={DAILY} margin={{ top: 10, right: 8, left: -18, bottom: 0 }} barGap={2}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#71717A", fontSize: 13 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717A", fontSize: 13 }} />
        <Bar dataKey="scans" name="Scansioni" fill={BRAND.orange} radius={[3, 3, 0, 0]} animationDuration={1400} isAnimationActive={ANIM} />
        <Bar dataKey="wa" name="WhatsApp" fill={BRAND.lime} radius={[3, 3, 0, 0]} animationDuration={1700} isAnimationActive={ANIM} />
      </BarChart>
    )}
  </Box>
);

export const HourlyChart = ({ height = "100%" }) => (
  <Box height={height}>
    {(w, h) => (
      <BarChart width={w} height={h} data={HOURLY} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
        <XAxis dataKey="h" tickLine={false} axisLine={false} tick={{ fill: "#71717A", fontSize: 11 }} interval={1} />
        <YAxis hide />
        <Bar dataKey="v" radius={[3, 3, 0, 0]} animationDuration={1500} isAnimationActive={ANIM}>
          {HOURLY.map((d) => (
            <Cell key={d.h} fill={Number(d.v) >= 110 ? BRAND.lime : BRAND.orange} fillOpacity={Number(d.v) >= 110 ? 1 : 0.55} />
          ))}
        </Bar>
      </BarChart>
    )}
  </Box>
);

export const DeviceDonut = ({ size = "100%", centerLabel = "92%", centerSub = "Mobile" }) => (
  <div style={{ width: size, height: size, position: "relative" }}>
    <Box height="100%">
      {(w, h) => (
        <PieChart width={w} height={h}>
          <Pie data={DEVICES} dataKey="value" cx="50%" cy="50%" innerRadius={Math.min(w, h) * 0.34} outerRadius={Math.min(w, h) * 0.48} startAngle={90} endAngle={-270} stroke="none" animationDuration={1400} isAnimationActive={ANIM}>
            {DEVICES.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      )}
    </Box>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="t-num text-lime" style={{ fontSize: "clamp(1rem,2.5cqw,2.5rem)" }}>{centerLabel}</span>
      <span className="t-kpilabel mt-0.5">{centerSub}</span>
    </div>
  </div>
);

export const MiniChannelBars = ({ data = SPECIALIST_CHANNELS }) => (
  <Box height="100%">
    {(w, h) => (
      <BarChart width={w} height={h} data={data} layout="vertical" margin={{ top: 0, right: 30, left: 4, bottom: 0 }} barCategoryGap={"28%"}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={78} tickLine={false} axisLine={false} tick={{ fill: "#a1a1aa", fontSize: 11 }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1300} isAnimationActive={ANIM}>
          {data.map((c) => (
            <Cell key={c.name} fill={CHANNEL_COLORS[c.name] || "#71717A"} />
          ))}
          <LabelList dataKey="value" position="right" formatter={fmt} style={{ fill: "#fff", fontSize: 11, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    )}
  </Box>
);

export const MiniLine = () => (
  <Box height="100%">
    {(w, h) => (
      <LineChart width={w} height={h} data={DAILY} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
        <Line type="monotone" dataKey="scans" stroke={BRAND.orange} strokeWidth={2} dot={false} animationDuration={1500} isAnimationActive={ANIM} />
        <Line type="monotone" dataKey="wa" stroke={BRAND.lime} strokeWidth={2} dot={false} animationDuration={1700} isAnimationActive={ANIM} />
      </LineChart>
    )}
  </Box>
);
