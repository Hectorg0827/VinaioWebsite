// ─── Design Tokens ────────────────────────────────────────────────────────────
// All colors and font stacks used throughout the site.
// Import as: import { T, ff } from "@/lib/theme";

export const T = {
  bg:          "#F8F6F3",
  paper:       "#FFFDF9",
  cream:       "#F0ECE6",
  taupe:       "#D5CEC4",
  warm:        "#A89F93",
  muted:       "#7A7369",
  deep:        "#4A443C",
  ink:         "#1A1815",
  charcoal:    "#58544F", // Explicit dark grey for subpage heroes
  metal:       "linear-gradient(135deg, #7A7570 0%, #484440 50%, #5C5853 100%)", // Metallic grey gradient
  wine:        "#722F37",
  wineDeep:    "#4E1A20",
  wineMetal:   "linear-gradient(180deg, #5D1F27 0%, #4E1A20 100%)", // Subdued luxury burgundy metal
  wineGlow:    "#722F3712",
  gold:        "#C2A355",
  silk:        "linear-gradient(135deg, #FFFDF9 0%, #F5F2EE 50%, #FFFDF9 100%)", // Silky white pearl
  green:       "#1B7A4E",
  greenLight:  "#E8F5EE",
  red:         "#C0392B",
  redLight:    "#FDECEB",
  blue:        "#2C6FB5",
  blueLight:   "#EBF2FA",
  orange:      "#D4760A",
  orangeLight: "#FFF3E0",
};

export const ff = {
  h: "'EB Garamond', Georgia, serif",
  b: "'Sora', 'Helvetica Neue', sans-serif",
};
