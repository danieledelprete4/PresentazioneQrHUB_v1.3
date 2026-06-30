import act1 from "./act1";
import act2 from "./act2";
import act3 from "./act3";
import act4 from "./act4";
import act5 from "./act5";

export const slides = [...act1, ...act2, ...act3, ...act4, ...act5];

export const ACTS = [
  { name: "Apertura", start: 0, end: 4 },
  { name: "Il Flusso Reale", start: 5, end: 13 },
  { name: "I Numeri", start: 14, end: 19 },
  { name: "Update Luglio", start: 20, end: 27 },
  { name: "Chiusura & Vision", start: 28, end: 32 },
];

export const actNameFor = (i) => (ACTS.find((a) => i >= a.start && i <= a.end) || ACTS[0]).name;
