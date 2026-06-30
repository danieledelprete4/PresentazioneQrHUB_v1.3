import { ASSET } from "../lib/brand";

export const SlideShell = ({ children, bg, overlay, bgPosition = "center", grain = true, className = "", contentClassName = "" }) => {
  return (
    <div className={`slide-shell ${className}`}>
      {bg && <img src={ASSET(bg)} className="slide-bg" alt="" draggable={false} style={{ objectPosition: bgPosition }} />}
      {bg && (
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: overlay || "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.2) 100%)" }}
        />
      )}
      {grain && <div className="slide-grain z-[1]" />}
      <div className={`slide-content ${contentClassName}`}>{children}</div>
    </div>
  );
};
