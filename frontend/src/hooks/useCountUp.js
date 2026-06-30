import { useEffect, useRef, useState } from "react";
import { STATIC } from "../lib/brand";

export function useCountUp(target, { duration = 1700, delay = 0, decimals = 0 } = {}) {
  const [value, setValue] = useState(STATIC ? target : 0);
  const raf = useRef();

  useEffect(() => {
    if (STATIC) {
      setValue(target);
      return;
    }
    const startAt = performance.now() + delay;
    const tick = (now) => {
      if (now < startAt) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration, delay]);

  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  const [intPart, decPart] = rounded.toFixed(decimals).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimals ? `${grouped},${decPart}` : grouped;
}
