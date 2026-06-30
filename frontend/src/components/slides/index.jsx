import act1 from "./act1";
import act2 from "./act2";
import act3 from "./act3";
import act4 from "./act4";
import act5 from "./act5";

export const slides = [...act1, ...act2, ...act3, ...act4, ...act5];

export const ACTS = [
  { name: "Apertura", start: 0, end: 3 },
  { name: "Il Flusso Reale", start: 4, end: 12 },
  { name: "I Numeri", start: 13, end: 18 },
  { name: "Update Luglio", start: 19, end: 25 },
  { name: "Chiusura & Vision", start: 26, end: 29 },
];

export const actNameFor = (i) => (ACTS.find((a) => i >= a.start && i <= a.end) || ACTS[0]).name;
