export const BRAND = {
  orange: "#FF6600",
  lime: "#C8FF00",
  white: "#FFFFFF",
  zinc: "#A1A1AA",
  black: "#000000",
};

export const CHANNEL_COLORS = {
  WhatsApp: "#C8FF00",
  Google: "#FF6600",
  Instagram: "#D946EF",
  Facebook: "#3B82F6",
  Appuntamento: "#A1A1AA",
  PWA: "#71717A",
  Maps: "#52525B",
};

export const EASE = [0.16, 1, 0.3, 1];

export const ASSET = (name) => `${process.env.PUBLIC_URL || ""}/assets/${name}`;
export const REAL = (name) => `${process.env.PUBLIC_URL || ""}/assets/real/${name}`;

export const STATIC =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("static") === "1";
