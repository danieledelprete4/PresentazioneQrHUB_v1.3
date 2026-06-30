import React from "react";
import { REAL } from "../../lib/brand";

/* Native screenshots — shown as-is (no device frame / no base), only rounded corners + soft shadow */
export const PhoneShot = ({ src, maxH = "80cqh", className = "" }) => (
  <img
    src={REAL(src)}
    alt=""
    draggable={false}
    className={`block w-auto rounded-[1.6rem] device-shadow ${className}`}
    style={{ maxHeight: maxH }}
  />
);

export const MacShot = ({ src, className = "" }) => (
  <img
    src={REAL(src)}
    alt=""
    draggable={false}
    className={`block w-full rounded-xl device-shadow ${className}`}
  />
);
