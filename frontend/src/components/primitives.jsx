import { motion } from "framer-motion";
import { EASE } from "../lib/brand";

export const FadeUp = ({ children, delay = 0, y = 36, className, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.85, delay, ease: EASE }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, delay = 0, x = 90, className }) => (
  <motion.div
    initial={{ opacity: 0, x }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.9, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Kicker = ({ children, color = "lime", delay = 0 }) => (
  <FadeUp delay={delay}>
    <div className="flex items-center gap-3 mb-[2.5cqh]">
      <span
        style={{ background: color === "lime" ? "var(--lime)" : "var(--orange)", width: "clamp(1.5rem,3cqw,3rem)", height: "2px" }}
      />
      <span className="t-kicker" style={{ color: color === "lime" ? "var(--lime)" : "var(--orange)" }}>
        {children}
      </span>
    </div>
  </FadeUp>
);
